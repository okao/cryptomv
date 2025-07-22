'use client';

import { useState } from 'react';
import { Plus, Minus, Gift, Sparkles } from 'lucide-react';
import { GiftCard } from '../lib/paypal';
import { formatCurrency } from '../lib/gift-cards';

interface GiftCardItemProps {
	giftCard: GiftCard;
	onAddToCart: (giftCard: GiftCard, quantity: number) => void;
}

export default function GiftCardItem({
	giftCard,
	onAddToCart,
}: GiftCardItemProps) {
	const [quantity, setQuantity] = useState(1);
	const [isAdding, setIsAdding] = useState(false);

	const incrementQuantity = () =>
		setQuantity((prev) => Math.min(prev + 1, 10));
	const decrementQuantity = () =>
		setQuantity((prev) => Math.max(prev - 1, 1));

	const handleAddToCart = async () => {
		setIsAdding(true);
		await new Promise((resolve) => setTimeout(resolve, 300)); // Brief animation delay
		onAddToCart(giftCard, quantity);
		setIsAdding(false);
	};

	const getCardGradient = () => {
		switch (giftCard.value) {
			case 15:
				return 'from-emerald-400 via-cyan-500 to-blue-500';
			case 50:
				return 'from-purple-400 via-pink-500 to-red-500';
			case 100:
				return 'from-amber-400 via-orange-500 to-red-500';
			default:
				return 'from-blue-400 via-purple-500 to-pink-500';
		}
	};

	const getButtonGradient = () => {
		switch (giftCard.value) {
			case 15:
				return 'from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700';
			case 50:
				return 'from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700';
			case 100:
				return 'from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700';
			default:
				return 'from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700';
		}
	};

	return (
		<div className="group relative">
			{/* Background glow effect */}
			<div
				className={`absolute -inset-0.5 bg-gradient-to-r ${getCardGradient()} rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300`}
			></div>

			<div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
				{/* Premium badge for $100 card */}
				{giftCard.value === 100 && (
					<div className="absolute top-4 right-4 z-10">
						<div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
							<Sparkles className="w-3 h-3 mr-1" />
							PREMIUM
						</div>
					</div>
				)}

				{/* Card Header */}
				<div
					className={`bg-gradient-to-br ${getCardGradient()} p-8 text-white relative overflow-hidden`}
				>
					{/* Decorative elements */}
					<div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 transform translate-x-16 -translate-y-16"></div>
					<div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 transform -translate-x-12 translate-y-12"></div>

					<div className="relative z-10">
						<div className="flex items-center justify-center mb-6">
							<div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
								<Gift className="w-10 h-10" />
							</div>
						</div>

						<h3 className="text-4xl font-bold text-center mb-2">
							{formatCurrency(giftCard.value)}
						</h3>

						<div className="text-center">
							<span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
								Gift Card
							</span>
						</div>
					</div>
				</div>

				{/* Card Body */}
				<div className="p-8">
					<p className="text-gray-600 text-center mb-8 text-lg leading-relaxed">
						{giftCard.description}
					</p>

					{/* Quantity Selector */}
					<div className="mb-8">
						<label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
							Select Quantity
						</label>
						<div className="flex items-center justify-center">
							<div className="flex items-center bg-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden">
								<button
									onClick={decrementQuantity}
									className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
									disabled={quantity <= 1}
								>
									<Minus className="w-5 h-5" />
								</button>
								<div className="px-6 py-3 font-bold text-lg min-w-[4rem] text-center bg-white border-x-2 border-gray-200">
									{quantity}
								</div>
								<button
									onClick={incrementQuantity}
									className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
									disabled={quantity >= 10}
								>
									<Plus className="w-5 h-5" />
								</button>
							</div>
						</div>
					</div>

					{/* Total Price */}
					<div className="text-center mb-8">
						<p className="text-sm text-gray-500 mb-2">Total Amount</p>
						<p className="text-3xl font-bold text-gray-900">
							{formatCurrency(giftCard.value * quantity)}
						</p>
						{quantity > 1 && (
							<p className="text-sm text-gray-500 mt-1">
								{quantity} × {formatCurrency(giftCard.value)}
							</p>
						)}
					</div>

					{/* Add to Cart Button */}
					<button
						onClick={handleAddToCart}
						disabled={isAdding}
						className={`w-full bg-gradient-to-r ${getButtonGradient()} text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl`}
					>
						{isAdding ? (
							<div className="flex items-center justify-center">
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
								Adding...
							</div>
						) : (
							<div className="flex items-center justify-center">
								<Gift className="w-5 h-5 mr-2" />
								Add to Cart
							</div>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
