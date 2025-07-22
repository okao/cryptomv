import {
	ApiError,
	CheckoutPaymentIntent,
	Client,
	Environment,
	LogLevel,
	OrdersController,
} from '@paypal/paypal-server-sdk';

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
	throw new Error('PayPal credentials are required');
}

const client = new Client({
	clientCredentialsAuthCredentials: {
		oAuthClientId: PAYPAL_CLIENT_ID,
		oAuthClientSecret: PAYPAL_CLIENT_SECRET,
	},
	timeout: 0,
	environment: Environment.Sandbox, // Change to Environment.Production for live
	logging: {
		logLevel: LogLevel.Info,
		logRequest: {
			logBody: true,
		},
		logResponse: {
			logHeaders: true,
		},
	},
});

export const ordersController = new OrdersController(client);

export interface GiftCard {
	id: string;
	name: string;
	value: number;
	description: string;
}

export interface CartItem {
	giftCard: GiftCard;
	quantity: number;
}

/**
 * Create an order to start the transaction.
 */
export const createOrder = async (cartItems: CartItem[]) => {
	const totalAmount = cartItems.reduce(
		(sum, item) => sum + item.giftCard.value * item.quantity,
		0
	);

	const collect = {
		body: {
			intent: CheckoutPaymentIntent.Capture,
			purchaseUnits: [
				{
					amount: {
						currencyCode: 'USD',
						value: totalAmount.toFixed(2),
					},
					description: `Gift Card Purchase: ${cartItems
						.map(
							(item) =>
								`${item.quantity}x $${item.giftCard.value} Gift Card`
						)
						.join(', ')}`,
				},
			],
		},
		prefer: 'return=minimal',
	};

	try {
		const { body, ...httpResponse } =
			await ordersController.createOrder(collect);
		return {
			jsonResponse:
				typeof body === 'string' ? JSON.parse(body) : body,
			httpStatusCode: httpResponse.statusCode,
		};
	} catch (error) {
		if (error instanceof ApiError) {
			throw new Error(error.message);
		}
		throw error;
	}
};

/**
 * Capture payment for the created order to complete the transaction.
 */
export const captureOrder = async (orderID: string) => {
	const collect = {
		id: orderID,
		prefer: 'return=minimal',
	};

	try {
		const { body, ...httpResponse } =
			await ordersController.captureOrder(collect);
		return {
			jsonResponse:
				typeof body === 'string' ? JSON.parse(body) : body,
			httpStatusCode: httpResponse.statusCode,
		};
	} catch (error) {
		if (error instanceof ApiError) {
			throw new Error(error.message);
		}
		throw error;
	}
};
