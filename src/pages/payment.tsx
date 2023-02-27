import { useEffect, useState } from 'react';

import { Elements } from '@stripe/react-stripe-js';

import { loadStripe, Stripe } from '@stripe/stripe-js';
import CheckoutForm from '@/components/CheckoutForm';

function Payment() {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    fetch('/api/config').then(async (res) => {
      const { publishableKey } = await res.json();

      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({}),
    }).then(async (result) => {
      const { clientSecret, id } = await result.json();

      setClientSecret(clientSecret);
    });
  }, []);

  return (
    <>
      <h1>Payment Element</h1>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

export default Payment;
