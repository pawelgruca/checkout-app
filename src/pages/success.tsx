import { useRouter } from 'next/router';
import { useStripe } from '@stripe/react-stripe-js';
import { useEffect } from 'react';

const Success = () => {
  const stripe = useStripe();
  const router = useRouter();

  const clientSecret = router.query.payment_intent_client_secret;

  return <h1>Success</h1>;
};

export default Success;
