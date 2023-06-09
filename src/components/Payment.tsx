import { useEffect, useState } from 'react';

import { Elements } from '@stripe/react-stripe-js';

import { loadStripe, Stripe } from '@stripe/stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { useRouter } from 'next/router';

interface PaymentProps {
  clientSecret: string;
  cb: () => void;
}

const Payment: React.FC<PaymentProps> = ({ clientSecret, cb }) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>();

  useEffect(() => {
    fetch('/api/config').then(async (res) => {
      const { publishableKey } = await res.json();

      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  return (
    <>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <h1>Payment Element</h1>
          <CheckoutForm cb={cb} />
        </Elements>
      )}
    </>
  );
};

export default Payment;
