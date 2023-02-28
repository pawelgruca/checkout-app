import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || '';

export const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2022-11-15',
});

type Data = {
  clientSecret?: string;
  id?: string;
  error?: {
    message: string;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: 'USD',
      amount: 1999,
      automatic_payment_methods: { enabled: true },
    });

    console.log(paymentIntent.payment_method);

    if (!paymentIntent.client_secret) {
      return new Error('Something went wrong');
    }

    res.send({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).send({
        error: {
          message: err.message,
        },
      });
    }
  }
}
