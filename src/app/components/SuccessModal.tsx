'use client';

import { CheckCircle, X, Download, Mail } from 'lucide-react';
import { formatCurrency } from '../lib/gift-cards';
import { CartItem } from '../lib/paypal';

interface SuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	orderData: unknown;
}

export default function SuccessModal({
	isOpen,
	onClose,
	orderData,
}: SuccessModalProps) {
	if (!isOpen || !orderData) return null;

	const { transaction, cartItems, totalAmount } = orderData as {
		transaction: { id: string; status: string };
		cartItems: CartItem[];
		totalAmount: number;
	};

	const handleDownloadReceipt = () => {
		// In a real app, you would generate and download a PDF receipt
		const receiptData = {
			transactionId: transaction.id,
			amount: totalAmount,
			items: cartItems,
			date: new Date().toLocaleDateString(),
			status: transaction.status,
		};

		const dataStr = JSON.stringify(receiptData, null, 2);
		const dataBlob = new Blob([dataStr], {
			type: 'application/json',
		});
		const url = URL.createObjectURL(dataBlob);

		const link = document.createElement('a');
		link.href = url;
		link.download = `receipt-${transaction.id}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const handleEmailReceipt = () => {
		// In a real app, you would send an email with the receipt
		const subject = `Gift Card Purchase Receipt - ${transaction.id}`;
		const body = `Thank you for your purchase!\n\nTransaction ID: ${
			transaction.id
		}\nTotal Amount: ${formatCurrency(
			totalAmount
		)}\nDate: ${new Date().toLocaleDateString()}`;

		const mailtoLink = `mailto:?subject=${encodeURIComponent(
			subject
		)}&body=${encodeURIComponent(body)}`;
		window.open(mailtoLink);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<div className="flex items-center">
						<CheckCircle className="w-8 h-8 text-green-500 mr-3" />
						<h2 className="text-2xl font-bold text-gray-900">
							Payment Successful!
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6">
					<div className="text-center mb-6">
						<p className="text-gray-600 mb-2">
							Thank you for your purchase! Your gift cards have been
							processed successfully.
						</p>
						<div className="bg-gray-50 rounded-lg p-4 mb-4">
							<p className="text-sm text-gray-600">Transaction ID</p>
							<p className="font-mono text-sm font-medium text-gray-900 break-all">
								{transaction.id}
							</p>
						</div>
					</div>

					{/* Order Summary */}
					<div className="mb-6">
						<h3 className="font-medium text-gray-900 mb-3">
							Order Summary
						</h3>
						<div className="bg-gray-50 rounded-lg p-4">
							<div className="space-y-2">
								{cartItems.map((item: CartItem, index: number) => (
									<div
										key={index}
										className="flex justify-between text-sm"
									>
										<span className="text-gray-600">
											{item.quantity}x {item.giftCard.name}
										</span>
										<span className="font-medium">
											{formatCurrency(
												item.giftCard.value * item.quantity
											)}
										</span>
									</div>
								))}
							</div>
							<div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-medium">
								<span>Total Paid:</span>
								<span className="text-lg">
									{formatCurrency(totalAmount)}
								</span>
							</div>
						</div>
					</div>

					{/* Gift Card Information */}
					<div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
						<h4 className="font-medium text-blue-900 mb-2">
							Gift Card Details
						</h4>
						<p className="text-sm text-blue-800">
							Your digital gift cards will be sent to your email
							address within 5-10 minutes. Each gift card will contain
							a unique code that can be redeemed online or in-store.
						</p>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col space-y-3">
						<button
							onClick={handleDownloadReceipt}
							className="flex items-center justify-center w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
						>
							<Download className="w-5 h-5 mr-2" />
							Download Receipt
						</button>
						<button
							onClick={handleEmailReceipt}
							className="flex items-center justify-center w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
						>
							<Mail className="w-5 h-5 mr-2" />
							Email Receipt
						</button>
						<button
							onClick={onClose}
							className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
						>
							Continue Shopping
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
