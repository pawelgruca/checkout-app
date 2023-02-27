import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { Product } from '@/saleor/api';

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || '';

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { products } = req.body;

  const items = products.map((product: Product) => {
    const variant = product.variants?.at(0);

    if (!variant?.pricing?.price) {
      return;
    }

    return {
      price_data: {
        currency: variant.pricing.price.gross.currency,
        unit_amount: variant.pricing.price.gross.amount * 100,
        product_data: {
          name: product.name,
        },
      },
      quantity: 1,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items,
    mode: 'payment',
    success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: req.headers.origin,
  });

  if (session.id) {
    res.status(200).json({ sessionId: session.id });
  }
}
