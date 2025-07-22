'use client';

import { useState } from 'react';
import {
	Gift,
	ShoppingBag,
	Star,
	Shield,
	Clock,
	Sparkles,
	Crown,
	Zap,
} from 'lucide-react';
import GiftCardItem from './components/GiftCardItem';
import ShoppingCart from './components/ShoppingCart';
import PayPalCheckout from './components/PayPalCheckout';
import SuccessModal from './components/SuccessModal';
import { GIFT_CARDS } from './lib/gift-cards';
import { GiftCard, CartItem } from './lib/paypal';
import CustomGiftCardInput from './components/CustomGiftCardInput';
// import SimplePayPalTest from './components/SimplePayPalTest';

export default function HomePage() {
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [showCheckout, setShowCheckout] = useState(false);
	const [isCheckingOut, setIsCheckingOut] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [orderData, setOrderData] = useState<unknown>(null);
	const [error, setError] = useState<string | null>(null);

	const addToCart = (giftCard: GiftCard, quantity: number) => {
		setCartItems((prev) => {
			const existingItemIndex = prev.findIndex(
				(item) => item.giftCard.id === giftCard.id
			);

			if (existingItemIndex >= 0) {
				const newItems = [...prev];
				newItems[existingItemIndex].quantity += quantity;
				return newItems;
			} else {
				return [...prev, { giftCard, quantity }];
			}
		});
	};

	const updateQuantity = (itemIndex: number, quantity: number) => {
		setCartItems((prev) => {
			const newItems = [...prev];
			newItems[itemIndex].quantity = quantity;
			return newItems;
		});
	};

	const removeItem = (itemIndex: number) => {
		setCartItems((prev) =>
			prev.filter((_, index) => index !== itemIndex)
		);
	};

	const handleCheckout = () => {
		setShowCheckout(true);
		setIsCheckingOut(true);
		setError(null);
	};

	const handlePaymentSuccess = (data: unknown) => {
		setOrderData(data);
		setShowSuccessModal(true);
		setShowCheckout(false);
		setIsCheckingOut(false);
		setCartItems([]);
	};

	const handlePaymentError = (errorMessage: string) => {
		setError(errorMessage);
		setIsCheckingOut(false);
	};

	const closeCheckout = () => {
		setShowCheckout(false);
		setIsCheckingOut(false);
		setError(null);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
			{/* Animated background elements */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
			</div>

			{/* Header */}
			<header className="relative z-10 bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mr-4">
								<Gift className="w-8 h-8 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
									GiftCard Store
								</h1>
								<p className="text-gray-600 font-medium">
									Perfect gifts for every occasion
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-6">
							<div className="flex items-center text-sm text-gray-600 bg-green-50 px-4 py-2 rounded-full border border-green-200">
								<Shield className="w-4 h-4 mr-2 text-green-600" />
								<span className="font-medium">Secure Checkout</span>
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative z-10 py-10 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto text-center">
					<div className="mb-6">
						<h2 className="text-5xl font-bold mb-4">
							<span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
								Give the Perfect Gift
							</span>
						</h2>
						<p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
							Choose from our premium selection of digital gift cards.
							Instant delivery, no expiration dates, and accepted
							everywhere for the ultimate gifting experience.
						</p>
					</div>
					{/* Features Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
						<div className="group p-4 bg-white/80 rounded-xl shadow-md border border-white/40 hover:shadow-lg transition-all duration-300">
							<div className="flex justify-center mb-4">
								<div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
									<Zap className="w-7 h-7 text-white" />
								</div>
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-2">
								Instant Delivery
							</h3>
							<p className="text-gray-600 text-sm">
								Digital gift cards delivered to your email within
								minutes of purchase
							</p>
						</div>
						<div className="group p-4 bg-white/80 rounded-xl shadow-md border border-white/40 hover:shadow-lg transition-all duration-300">
							<div className="flex justify-center mb-4">
								<div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
									<Shield className="w-7 h-7 text-white" />
								</div>
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-2">
								Bank-Level Security
							</h3>
							<p className="text-gray-600 text-sm">
								Protected by PayPals industry-leading security and
								fraud protection
							</p>
						</div>
						<div className="group p-4 bg-white/80 rounded-xl shadow-md border border-white/40 hover:shadow-lg transition-all duration-300">
							<div className="flex justify-center mb-4">
								<div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
									<Crown className="w-7 h-7 text-white" />
								</div>
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-2">
								Never Expires
							</h3>
							<p className="text-gray-600 text-sm">
								Gift cards never expire and can be used anytime,
								anywhere
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Gift Cards Section */}
			<section className="relative z-10 py-10 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-10">
						<h2 className="text-3xl font-bold text-gray-900 mb-2">
							Choose Your Gift Card Amount
						</h2>
						<p className="text-base text-gray-600 max-w-2xl mx-auto">
							Each gift card comes with a unique code and can be
							redeemed instantly
						</p>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
						{GIFT_CARDS.map((giftCard) => (
							<GiftCardItem
								key={giftCard.id}
								giftCard={giftCard}
								onAddToCart={addToCart}
								// className="h-full flex flex-col"
							/>
						))}
						{/* Custom Amount Card */}
						<CustomGiftCardInput onAddToCart={addToCart} />
					</div>
				</div>
			</section>

			{/* Trust Section */}
			<section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-white/40 backdrop-blur-sm">
				<div className="max-w-4xl mx-auto text-center">
					<div className="flex items-center justify-center mb-8">
						<div className="flex items-center space-x-2">
							{[1, 2, 3, 4, 5].map((star) => (
								<Star
									key={star}
									className="w-6 h-6 text-yellow-400 fill-current"
								/>
							))}
						</div>
					</div>
					<h3 className="text-2xl font-bold text-gray-900 mb-4">
						Trusted by Thousands
					</h3>
					<p className="text-lg text-gray-600 mb-8">
						Join over 50,000 happy customers who have sent the perfect
						gift
					</p>
					<div className="grid grid-cols-3 gap-8 text-center">
						<div>
							<div className="text-3xl font-bold text-blue-600 mb-2">
								50K+
							</div>
							<div className="text-gray-600">Happy Customers</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-green-600 mb-2">
								99.9%
							</div>
							<div className="text-gray-600">Uptime</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-purple-600 mb-2">
								24/7
							</div>
							<div className="text-gray-600">Support</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="relative z-10 bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
						<div className="col-span-1 md:col-span-2">
							<div className="flex items-center mb-4">
								<div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-3">
									<Gift className="w-6 h-6 text-white" />
								</div>
								<span className="text-xl font-bold">
									GiftCard Store
								</span>
							</div>
							<p className="text-gray-400 mb-4 leading-relaxed">
								Making gift-giving simple, secure, and delightful
								since 2024. Your trusted partner for digital gift
								cards.
							</p>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Quick Links</h4>
							<ul className="space-y-2 text-gray-400">
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
									>
										How it Works
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
									>
										Terms of Service
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
									>
										Privacy Policy
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Support</h4>
							<ul className="space-y-2 text-gray-400">
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
									>
										Help Center
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
									>
										Contact Us
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white transition-colors"
									>
										Refund Policy
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-gray-800 pt-8 text-center text-gray-400">
						<p>&copy; 2024 GiftCard Store. All rights reserved.</p>
					</div>
				</div>
			</footer>

			{/* Shopping Cart */}
			<ShoppingCart
				cartItems={cartItems}
				onUpdateQuantity={updateQuantity}
				onRemoveItem={removeItem}
				onCheckout={handleCheckout}
				isCheckingOut={isCheckingOut}
			/>

			{/* Checkout Modal */}
			{showCheckout && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
						<div className="flex items-center justify-between p-6 border-b border-gray-200">
							<h2 className="text-2xl font-bold text-gray-900">
								Secure Checkout
							</h2>
							<button
								onClick={closeCheckout}
								className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
								disabled={isCheckingOut}
							>
								✕
							</button>
						</div>

						<div className="p-6">
							{error && (
								<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
									<p className="text-red-800 text-sm">{error}</p>
								</div>
							)}

							<PayPalCheckout
								cartItems={cartItems}
								onSuccess={handlePaymentSuccess}
								onError={handlePaymentError}
							/>
						</div>
					</div>
				</div>
			)}

			{/* Success Modal */}
			<SuccessModal
				isOpen={showSuccessModal}
				onClose={() => setShowSuccessModal(false)}
				orderData={orderData}
			/>
		</div>

		// <div className="min-h-screen bg-gray-100 py-8">
		// 	<SimplePayPalTest />
		// </div>
	);
}
