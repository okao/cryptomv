'use client';

import { useEffect, useRef, useState } from 'react';
import { CartItem } from '../lib/paypal';
import { formatCurrency } from '../lib/gift-cards';
import type {
	PayPalNamespace,
	OnApproveData,
	OnApproveActions,
} from '@paypal/paypal-js';

declare global {
	interface Window {
		paypal?: PayPalNamespace | null;
	}
}

interface PayPalCheckoutProps {
	cartItems: CartItem[];
	onSuccess: (orderData: unknown) => void;
	onError: (error: string) => void;
}

export default function PayPalCheckout({
	cartItems,
	onSuccess,
	onError,
}: PayPalCheckoutProps) {
	const paypalRef = useRef<HTMLDivElement>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	const totalAmount = cartItems.reduce(
		(sum, item) => sum + item.giftCard.value * item.quantity,
		0
	);

	useEffect(() => {
		const loadPayPalScript = () => {
			if (window.paypal) {
				setIsLoaded(true);
				return;
			}

			const script = document.createElement('script');
			script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&buyer-country=US&currency=USD&components=buttons&enable-funding=venmo`;
			script.async = true;
			script.onload = () => setIsLoaded(true);
			script.onerror = () => onError('Failed to load PayPal SDK');
			document.head.appendChild(script);
		};

		loadPayPalScript();
	}, [onError]);

	useEffect(() => {
		if (isLoaded && window.paypal && paypalRef.current) {
			// Clear any existing PayPal buttons
			paypalRef.current.innerHTML = '';

			if (
				window.paypal &&
				typeof window.paypal.Buttons === 'function'
			) {
				window.paypal
					.Buttons({
						style: {
							shape: 'rect',
							layout: 'vertical',
							color: 'gold',
							label: 'paypal',
						},
						message: {
							amount: totalAmount,
						},

						async createOrder() {
							try {
								const response = await fetch(
									'/api/paypal/create-order',
									{
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
										},
										body: JSON.stringify({
											cartItems: cartItems,
										}),
									}
								);

								const orderData = await response.json();

								if (orderData.id) {
									return orderData.id;
								}

								const errorDetail = orderData?.details?.[0];
								const errorMessage = errorDetail
									? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
									: JSON.stringify(orderData);

								throw new Error(errorMessage);
							} catch (error) {
								console.error('PayPal Create Order Error:', error);
								onError(
									`Could not initiate PayPal Checkout: ${error}`
								);
								return null;
							}
						},

						async onApprove(
							data: OnApproveData,
							actions: OnApproveActions
						) {
							try {
								const response = await fetch(
									`/api/paypal/capture-order/${data.orderID}`,
									{
										method: 'POST',
										headers: {
											'Content-Type': 'application/json',
										},
									}
								);

								const orderData = await response.json();

								const errorDetail = orderData?.details?.[0];

								if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
									// Recoverable state, restart the payment flow
									return actions.restart();
								} else if (errorDetail) {
									// Non-recoverable error
									throw new Error(
										`${errorDetail.description} (${orderData.debug_id})`
									);
								} else if (!orderData.purchase_units) {
									throw new Error(JSON.stringify(orderData));
								} else {
									// Successful transaction
									const transaction =
										orderData?.purchase_units?.[0]?.payments
											?.captures?.[0] ||
										orderData?.purchase_units?.[0]?.payments
											?.authorizations?.[0];

									onSuccess({
										...orderData,
										transaction,
										cartItems,
										totalAmount,
									});
								}
							} catch (error) {
								console.error('PayPal Capture Error:', error);
								onError(
									`Transaction could not be processed: ${error}`
								);
							}
						},

						onError(err: unknown) {
							console.error('PayPal Button Error:', err);
							onError(
								'PayPal encountered an error. Please try again.'
							);
						},
					})
					.render(paypalRef.current);
			}
		}
	}, [isLoaded, cartItems, totalAmount, onSuccess, onError]);

	if (!isLoaded) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<span className="ml-2 text-gray-600">Loading PayPal...</span>
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="mb-4 p-4 bg-gray-50 rounded-lg">
				<h3 className="font-medium text-gray-900 mb-2">
					Order Summary
				</h3>
				<div className="space-y-1 text-sm">
					{cartItems.map((item, index) => (
						<div
							key={index}
							className="flex justify-between text-gray-600"
						>
							<span>
								{item.quantity}x {item.giftCard.name}
							</span>
							<span>
								{formatCurrency(item.giftCard.value * item.quantity)}
							</span>
						</div>
					))}
				</div>
				<div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-medium">
					<span>Total:</span>
					<span>{formatCurrency(totalAmount)}</span>
				</div>
			</div>
			<div ref={paypalRef} className="paypal-buttons-container" />
		</div>
	);
}
