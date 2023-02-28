import { useEffect, useState } from 'react';

import { Elements, useStripe } from '@stripe/react-stripe-js';

import { loadStripe, Stripe } from '@stripe/stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { useRouter } from 'next/router';

function Payment() {
  const router = useRouter();

  return (
    <>
      <h1>Payment Element</h1>
      <CheckoutForm />
    </>
  );
}

export default Payment;
