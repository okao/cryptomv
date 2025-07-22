import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'GiftCard Store - Perfect Gifts for Every Occasion',
	description:
		'Buy digital gift cards online with instant delivery. Choose from $15, $50, and $100 gift cards with secure PayPal checkout.',
	keywords:
		'gift cards, digital gifts, PayPal, online shopping, instant delivery',
	authors: [{ name: 'GiftCard Store' }],
};

export const viewport = {
	width: 'device-width',
	initialScale: 1,
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</head>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
