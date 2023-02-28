import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { client } from '@/client/client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>();

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
      setPaymentIntentId(id);
    });
  }, []);

  return (
    <ApolloProvider client={client}>
      {clientSecret && (
        <Elements stripe={stripePromise || null} options={{ clientSecret }}>
          <Component {...pageProps} paymentId={paymentIntentId} />
        </Elements>
      )}
    </ApolloProvider>
  );
}
