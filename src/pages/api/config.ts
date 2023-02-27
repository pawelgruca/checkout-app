// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  publishableKey: string;
};

const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || '';

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ publishableKey: STRIPE_PUBLISHABLE_KEY });
}
