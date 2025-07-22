import { NextRequest, NextResponse } from 'next/server';
import { createOrder, CartItem } from '../../../lib/paypal';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { cartItems }: { cartItems: CartItem[] } = body;

		if (!cartItems || cartItems.length === 0) {
			return NextResponse.json(
				{ error: 'Cart items are required' },
				{ status: 400 }
			);
		}

		// Validate cart items
		const validCartItems = cartItems.filter(
			(item) =>
				item.giftCard && item.giftCard.value > 0 && item.quantity > 0
		);

		if (validCartItems.length === 0) {
			return NextResponse.json(
				{ error: 'No valid cart items found' },
				{ status: 400 }
			);
		}

		const { jsonResponse, httpStatusCode } = await createOrder(
			validCartItems
		);

		return NextResponse.json(jsonResponse, {
			status: httpStatusCode,
		});
	} catch (error) {
		console.error('Failed to create order:', error);
		return NextResponse.json(
			{ error: 'Failed to create order.' },
			{ status: 500 }
		);
	}
}
