'use client';

import { useState } from 'react';
import {
	ShoppingCart as CartIcon,
	X,
	Trash2,
	Plus,
	Minus,
} from 'lucide-react';
import { CartItem } from '../lib/paypal';
import { formatCurrency } from '../lib/gift-cards';

interface ShoppingCartProps {
	cartItems: CartItem[];
	onUpdateQuantity: (itemIndex: number, quantity: number) => void;
	onRemoveItem: (itemIndex: number) => void;
	onCheckout: () => void;
	isCheckingOut: boolean;
}

export default function ShoppingCart({
	cartItems,
	onUpdateQuantity,
	onRemoveItem,
	onCheckout,
	isCheckingOut,
}: ShoppingCartProps) {
	const [isOpen, setIsOpen] = useState(false);

	const totalAmount = cartItems.reduce(
		(sum, item) => sum + item.giftCard.value * item.quantity,
		0
	);

	const totalItems = cartItems.reduce(
		(sum, item) => sum + item.quantity,
		0
	);

	return (
		<>
			{/* Enhanced Cart Toggle Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="fixed top-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-2xl shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 z-50 transform hover:scale-105 active:scale-95"
			>
				<div className="relative">
					<CartIcon className="w-6 h-6" />
					{totalItems > 0 && (
						<>
							<span className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
								{totalItems > 99 ? '99+' : totalItems}
							</span>
							<div className="absolute -top-3 -right-3 bg-red-400 rounded-full w-6 h-6 animate-ping opacity-20"></div>
						</>
					)}
				</div>
			</button>

			{/* Enhanced Cart Sidebar */}
			<div
				className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-all duration-500 ease-in-out z-40 ${
					isOpen ? 'translate-x-0' : 'translate-x-full'
				} flex flex-col`}
			>
				{/* Cart Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
					<div>
						<h2 className="text-xl font-bold text-gray-900">
							Shopping Cart
						</h2>
						{totalItems > 0 && (
							<p className="text-sm text-gray-600">
								{totalItems} item{totalItems !== 1 ? 's' : ''}
							</p>
						)}
					</div>
					<button
						onClick={() => setIsOpen(false)}
						className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-white/80"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Cart Content */}
				<div className="flex-1 overflow-y-auto p-4">
					{cartItems.length === 0 ? (
						<div className="text-center py-16">
							<div className="mb-6">
								<div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
									<CartIcon className="w-12 h-12 text-gray-300" />
								</div>
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								Your cart is empty
							</h3>
							<p className="text-gray-500 mb-6">
								Add some gift cards to get started!
							</p>
							<button
								onClick={() => setIsOpen(false)}
								className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
							>
								Continue Shopping
							</button>
						</div>
					) : (
						<div className="space-y-4">
							{cartItems.map((item, index) => (
								<div
									key={`${item.giftCard.id}-${index}`}
									className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-100 shadow-sm"
								>
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<h3 className="font-semibold text-gray-900 mb-1">
												{item.giftCard.name}
											</h3>
											<p className="text-sm text-gray-600">
												{formatCurrency(item.giftCard.value)} each
											</p>
										</div>
										<button
											onClick={() => onRemoveItem(index)}
											className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex items-center bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
											<button
												onClick={() =>
													onUpdateQuantity(
														index,
														Math.max(1, item.quantity - 1)
													)
												}
												className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
												disabled={item.quantity <= 1}
											>
												<Minus className="w-4 h-4" />
											</button>
											<span className="px-4 py-2 font-semibold text-gray-900 min-w-[3rem] text-center bg-white">
												{item.quantity}
											</span>
											<button
												onClick={() =>
													onUpdateQuantity(
														index,
														Math.min(10, item.quantity + 1)
													)
												}
												className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
												disabled={item.quantity >= 10}
											>
												<Plus className="w-4 h-4" />
											</button>
										</div>
										<div className="text-right">
											<p className="font-bold text-lg text-gray-900">
												{formatCurrency(
													item.giftCard.value * item.quantity
												)}
											</p>
											{item.quantity > 1 && (
												<p className="text-xs text-gray-500">
													{item.quantity} ×{' '}
													{formatCurrency(item.giftCard.value)}
												</p>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Enhanced Cart Footer */}
				{cartItems.length > 0 && (
					<div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-6">
						<div className="mb-6">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm text-gray-600">
									Subtotal ({totalItems} item
									{totalItems !== 1 ? 's' : ''})
								</span>
								<span className="text-lg font-semibold text-gray-900">
									{formatCurrency(totalAmount)}
								</span>
							</div>
							<div className="flex items-center justify-between mb-4">
								<span className="text-sm text-gray-600">
									Processing Fee
								</span>
								<span className="text-sm text-green-600 font-medium">
									FREE
								</span>
							</div>
							<div className="border-t border-gray-200 pt-4">
								<div className="flex items-center justify-between">
									<span className="text-xl font-bold text-gray-900">
										Total
									</span>
									<span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
										{formatCurrency(totalAmount)}
									</span>
								</div>
							</div>
						</div>

						<button
							onClick={onCheckout}
							disabled={isCheckingOut}
							className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
						>
							{isCheckingOut ? (
								<div className="flex items-center justify-center">
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
									Processing...
								</div>
							) : (
								<div className="flex items-center justify-center">
									<span>Proceed to Checkout</span>
									<svg
										className="w-5 h-5 ml-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 7l5 5m0 0l-5 5m5-5H6"
										/>
									</svg>
								</div>
							)}
						</button>

						{/* Trust indicators */}
						<div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
							<div className="flex items-center">
								<svg
									className="w-4 h-4 mr-1 text-green-500"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
										clipRule="evenodd"
									/>
								</svg>
								Secure Payment
							</div>
							<div className="flex items-center">
								<svg
									className="w-4 h-4 mr-1 text-blue-500"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								Instant Delivery
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Enhanced Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity duration-300"
					onClick={() => setIsOpen(false)}
				/>
			)}
		</>
	);
}
