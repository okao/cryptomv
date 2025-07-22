import { GiftCard } from './paypal';

export const GIFT_CARDS: GiftCard[] = [
	{
		id: 'gift-card-15',
		name: '$15 Gift Card',
		value: 15,
		description: 'Perfect for small treats and essentials',
	},
	{
		id: 'gift-card-50',
		name: '$50 Gift Card',
		value: 50,
		description: 'Great for special occasions and gifts',
	},
	{
		id: 'gift-card-100',
		name: '$100 Gift Card',
		value: 100,
		description: 'Premium gift card for luxury purchases',
	},
];

export function getGiftCardById(id: string): GiftCard | undefined {
	return GIFT_CARDS.find((card) => card.id === id);
}

export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(amount);
}
