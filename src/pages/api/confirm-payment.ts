import type { NextApiRequest, NextApiResponse } from 'next';

import { stripe } from './create-payment-intent';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { clientSecret } = JSON.parse(req.body);

  res.status(200).send({ status: '' });
}
