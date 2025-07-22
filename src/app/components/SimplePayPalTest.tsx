'use client';

import { useEffect, useRef, useState } from 'react';
import {
	PayPalNamespace,
	OnApproveData,
	OnApproveActions,
	CreateOrderData,
	CreateOrderActions,
	PayPalButtonsComponent,
} from '@paypal/paypal-js';

declare global {
	interface Window {
		paypal?: PayPalNamespace | null | undefined;
	}
}

export default function SimplePayPalTest() {
	const paypalRef = useRef<HTMLDivElement>(null);
	const [debugInfo, setDebugInfo] = useState({
		clientId: '',
		sdkLoaded: false,
		containerReady: false,
		error: '',
	});

	useEffect(() => {
		const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

		setDebugInfo((prev) => ({
			...prev,
			clientId: clientId || 'NOT SET',
			containerReady: !!paypalRef.current,
		}));

		if (!clientId) {
			setDebugInfo((prev) => ({
				...prev,
				error: 'NEXT_PUBLIC_PAYPAL_CLIENT_ID is not set',
			}));
			return;
		}

		// Load PayPal SDK
		const script = document.createElement('script');
		script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&components=buttons`;
		script.async = true;

		script.onload = () => {
			console.log('PayPal SDK loaded successfully');
			setDebugInfo((prev) => ({ ...prev, sdkLoaded: true }));

			if (
				window.paypal &&
				typeof window.paypal.Buttons === 'function' &&
				paypalRef.current
			) {
				try {
					window.paypal
						.Buttons({
							style: {
								shape: 'rect',
								color: 'gold',
								layout: 'vertical',
								label: 'paypal',
							},
							createOrder: (
								data: CreateOrderData,
								actions: CreateOrderActions
							) => {
								console.log('Creating PayPal order...');
								return actions.order.create({
									intent: 'CAPTURE',
									purchase_units: [
										{
											amount: {
												value: '10.00',
												currency_code: 'USD',
											},
										},
									],
								});
							},
							onApprove: async (
								data: OnApproveData,
								actions: OnApproveActions
							) => {
								console.log('PayPal order approved:', data);
								if (
									actions.order &&
									typeof actions.order.capture === 'function'
								) {
									const details = await actions.order.capture();
									if (
										details &&
										typeof details === 'object' &&
										'payer' in details &&
										(
											details as {
												payer?: { name?: { given_name?: string } };
											}
										).payer?.name?.given_name
									) {
										alert(
											`Test transaction completed by ${
												(
													details as {
														payer: { name: { given_name: string } };
													}
												).payer.name.given_name
											}`
										);
									} else {
										alert('Test transaction completed.');
									}
									console.log('Transaction details:', details);
								}
							},
							onError: (err: unknown) => {
								console.error('PayPal error:', err);
								setDebugInfo((prev) => ({
									...prev,
									error: `PayPal error: ${String(err)}`,
								}));
							},
						})
						.render(paypalRef.current);
					console.log('PayPal buttons rendered successfully');
				} catch (error) {
					console.error('Error rendering PayPal buttons:', error);
					setDebugInfo((prev) => ({
						...prev,
						error: `Render error: ${String(error)}`,
					}));
				}
			}
		};

		script.onerror = () => {
			console.error('Failed to load PayPal SDK');
			setDebugInfo((prev) => ({
				...prev,
				error: 'Failed to load PayPal SDK',
			}));
		};

		document.head.appendChild(script);

		return () => {
			// Cleanup script
			const scripts = document.querySelectorAll(
				'script[src*="paypal.com/sdk"]'
			);
			scripts.forEach((script) => script.remove());
		};
	}, []);

	return (
		<div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
			<h2 className="text-xl font-bold mb-4">PayPal Debug Test</h2>

			{/* Debug Information */}
			<div className="mb-6 p-4 bg-gray-100 rounded-lg">
				<h3 className="font-semibold mb-2">Debug Info:</h3>
				<div className="space-y-1 text-sm">
					<p>
						<strong>Client ID:</strong> {debugInfo.clientId}
					</p>
					<p>
						<strong>SDK Loaded:</strong>{' '}
						{debugInfo.sdkLoaded ? '✅ Yes' : '❌ No'}
					</p>
					<p>
						<strong>Container Ready:</strong>{' '}
						{debugInfo.containerReady ? '✅ Yes' : '❌ No'}
					</p>
					{debugInfo.error && (
						<p className="text-red-600">
							<strong>Error:</strong> {debugInfo.error}
						</p>
					)}
				</div>
			</div>

			{/* PayPal Container */}
			<div className="mb-4">
				<h3 className="font-semibold mb-2">PayPal Buttons:</h3>
				<div
					ref={paypalRef}
					className="min-h-[150px] border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50"
					style={{ minHeight: '150px' }}
				>
					{!debugInfo.sdkLoaded && (
						<div className="flex items-center justify-center h-full text-gray-500">
							Loading PayPal buttons...
						</div>
					)}
				</div>
			</div>

			{/* Instructions */}
			<div className="text-sm text-gray-600">
				<p>
					<strong>Expected:</strong> PayPal buttons should appear in
					the blue dashed box above.
				</p>
				<p>
					<strong>If not working:</strong> Check the debug info and
					browser console for errors.
				</p>
			</div>
		</div>
	);
}
