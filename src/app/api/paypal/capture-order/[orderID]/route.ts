import { NextRequest, NextResponse } from 'next/server';
import { captureOrder } from '../../../../lib/paypal';

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ orderID: string }> }
) {
	try {
		const { orderID } = await params;

		if (!orderID) {
			return NextResponse.json(
				{ error: 'Order ID is required' },
				{ status: 400 }
			);
		}

		const { jsonResponse, httpStatusCode } = await captureOrder(
			orderID
		);

		return NextResponse.json(jsonResponse, {
			status: httpStatusCode,
		});
	} catch (error) {
		console.error('Failed to capture order:', error);
		return NextResponse.json(
			{ error: 'Failed to capture order.' },
			{ status: 500 }
		);
	}
}
