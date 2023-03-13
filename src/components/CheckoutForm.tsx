import { PaymentElement } from '@stripe/react-stripe-js';
import { FormEvent, useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  cb?: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cb }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      redirect: 'if_required',
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error?.type === 'card_error' || error?.type === 'validation_error') {
      setMessage(error.message);
    } else {
      setMessage('Payment completed.');
      cb && cb();
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} style={{ width: '400px' }}>
      <PaymentElement id="payment-element" />
      <button
        disabled={isProcessing || !stripe || !elements}
        id="submit"
        style={{
          width: '100%',
          color: 'white',
          background: 'black',
          border: 'none',
          paddingBlock: '10px',
          marginTop: '20px',
        }}
      >
        <span id="button-text">{isProcessing ? 'Processing ... ' : 'Pay now'}</span>
      </button>

      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

export default CheckoutForm;
