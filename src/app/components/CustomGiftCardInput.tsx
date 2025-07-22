import { useState } from 'react';
import { Gift } from 'lucide-react';
import { GiftCard } from '../lib/paypal';
import { formatCurrency } from '../lib/gift-cards';

interface CustomGiftCardInputProps {
	onAddToCart: (giftCard: GiftCard, quantity: number) => void;
}

export default function CustomGiftCardInput({
	onAddToCart,
}: CustomGiftCardInputProps) {
	const [amount, setAmount] = useState('');
	const [quantity, setQuantity] = useState(1);
	const [isAdding, setIsAdding] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const minAmount = 5;
	const maxAmount = 500;

	const handleAmountChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value.replace(/[^0-9.]/g, '');
		setAmount(value);
		setError(null);
	};

	const incrementQuantity = () =>
		setQuantity((prev) => Math.min(prev + 1, 10));
	const decrementQuantity = () =>
		setQuantity((prev) => Math.max(prev - 1, 1));

	const handleAddToCart = async () => {
		const numAmount = parseFloat(amount);
		if (
			isNaN(numAmount) ||
			numAmount < minAmount ||
			numAmount > maxAmount
		) {
			setError(
				`Enter an amount between $${minAmount} and $${maxAmount}`
			);
			return;
		}
		setIsAdding(true);
		await new Promise((resolve) => setTimeout(resolve, 300));
		const customGiftCard: GiftCard = {
			id: `custom-${numAmount}`,
			name: `Custom Gift Card ($${numAmount})`,
			value: numAmount,
			description: 'A custom gift card amount of your choice',
		};
		onAddToCart(customGiftCard, quantity);
		setIsAdding(false);
		setAmount('');
		setQuantity(1);
		setError(null);
	};

	return (
		<div className="group relative">
			{/* Background glow effect */}
			<div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
			<div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
				{/* Card Header */}
				<div className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-8 text-white relative overflow-hidden">
					<div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 transform translate-x-16 -translate-y-16"></div>
					<div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 transform -translate-x-12 translate-y-12"></div>
					<div className="relative z-10">
						<div className="flex items-center justify-center mb-6">
							<div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
								<Gift className="w-10 h-10" />
							</div>
						</div>
						<h3 className="text-4xl font-bold text-center mb-2">
							{amount ? formatCurrency(Number(amount)) : '$—'}
						</h3>
						<div className="text-center">
							<span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
								Custom Gift Card
							</span>
						</div>
					</div>
				</div>
				{/* Card Body */}
				<div className="p-8">
					<p className="text-gray-600 text-center mb-8 text-lg leading-relaxed">
						Enter your desired gift card amount and quantity
					</p>
					{/* Amount Input */}
					<div className="mb-6">
						<label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
							Enter Amount (USD)
						</label>
						<input
							type="number"
							min={minAmount}
							max={maxAmount}
							step="0.01"
							value={amount}
							onChange={handleAmountChange}
							placeholder={`$${minAmount} - $${maxAmount}`}
							className="w-full text-center px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 font-bold text-lg mb-2"
						/>
						{error && (
							<div className="text-red-500 text-xs text-center mt-1">
								{error}
							</div>
						)}
					</div>
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
									-
								</button>
								<div className="px-6 py-3 font-bold text-lg min-w-[4rem] text-center bg-white border-x-2 border-gray-200">
									{quantity}
								</div>
								<button
									onClick={incrementQuantity}
									className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
									disabled={quantity >= 10}
								>
									+
								</button>
							</div>
						</div>
					</div>
					{/* Total Price */}
					<div className="text-center mb-8">
						<p className="text-sm text-gray-500 mb-2">Total Amount</p>
						<p className="text-3xl font-bold text-gray-900">
							{amount && !isNaN(Number(amount))
								? formatCurrency(Number(amount) * quantity)
								: '$—'}
						</p>
						{quantity > 1 && amount && !isNaN(Number(amount)) && (
							<p className="text-sm text-gray-500 mt-1">
								{quantity} × {formatCurrency(Number(amount))}
							</p>
						)}
					</div>
					{/* Add to Cart Button */}
					<button
						onClick={handleAddToCart}
						disabled={isAdding || !amount}
						className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl`}
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
