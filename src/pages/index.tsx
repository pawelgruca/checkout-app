import AddressForm from '@/components/AddressForm';

import Payment from '@/components/Payment';
import { useCookie } from '@/hooks/useCookie';
import {
  AddressInput,
  useCheckoutAddPromoCodeMutation,
  useCheckoutCompleteMutation,
  useCheckoutDeliveryMethodUpdateMutation,
  useCheckoutPaymntCreateMutation,
  useCheckoutQuery,
} from '@/saleor/api';

import { useState } from 'react';

const Checkout = () => {
  const [checkoutDeliveryMethodUpdate] = useCheckoutDeliveryMethodUpdateMutation();
  const [checkoutAddPromoCode] = useCheckoutAddPromoCodeMutation();

  const [checkoutPaymentCreate] = useCheckoutPaymntCreateMutation();
  const [checkoutComplete] = useCheckoutCompleteMutation();
  const [showShippingAddressForm, setShowShippingAddressForm] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);

  const token = useCookie('checkout_token');
  const checkoutId = useCookie('checkout_id');

  const { data: { checkout } = {} } = useCheckoutQuery({
    variables: {
      id: checkoutId,
    },
  });

  const shippingMethods = checkout?.shippingMethods;

  const [clientSecret, setClientSecret] = useState('');

  const handleCheckoutComplete = async () => {
    const checkoutDeliveryMethodUpdateResult = await checkoutDeliveryMethodUpdate({
      variables: {
        deliveryMethodId: 'U2hpcHBpbmdNZXRob2Q6MQ==',
        token,
      },
    });

    const totalPrice =
      checkoutDeliveryMethodUpdateResult.data?.checkoutDeliveryMethodUpdate?.checkout?.totalPrice.gross.amount;

    if (totalPrice) {
      setTotalPrice(totalPrice);
    }

    const checkoutPaymentCreateResult = await checkoutPaymentCreate({
      variables: {
        token,
        input: {
          gateway: 'saleor.payments.stripe',
          amount: totalPrice,
        },
      },
    });

    const checkoutCompleteResult = await checkoutComplete({
      variables: {
        checkoutId,
        paymentData: JSON.stringify({
          payment_method_types: ['card'],
        }),
      },
    });

    const clientSecret = JSON.parse(
      checkoutCompleteResult.data?.checkoutComplete?.confirmationData || ''
    ).client_secret;

    if (clientSecret) {
      setClientSecret(clientSecret);
    }
  };

  const handleAddPromoCode = async () => {
    let checkoutAddPromoCodeResults = await checkoutAddPromoCode({
      variables: {
        promoCode: 'D0A1-41F3-9A73',
        token,
      },
    });
    checkoutAddPromoCodeResults = await checkoutAddPromoCode({
      variables: {
        promoCode: 'XEJWFE095U',
        token,
      },
    });
    const totalPrice = checkoutAddPromoCodeResults.data?.checkoutAddPromoCode?.checkout?.totalPrice.gross.amount;
    if (totalPrice) {
      setTotalPrice(totalPrice);
    }
  };

  const setShippingMethod = async (id: string) => {
    const checkoutDeliveryMethodUpdateResult = await checkoutDeliveryMethodUpdate({
      variables: {
        deliveryMethodId: 'U2hpcHBpbmdNZXRob2Q6Mg==',
        token,
      },
    });

    const totalPrice =
      checkoutDeliveryMethodUpdateResult.data?.checkoutDeliveryMethodUpdate?.checkout?.totalPrice.gross.amount;

    if (totalPrice) {
      setTotalPrice(totalPrice);
    }
  };

  if (token) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {checkout?.lines.map((line) => (
          <h2>
            {line.variant.product.name} ${line.variant.pricing?.price?.gross.amount}
          </h2>
        ))}
        <div style={{ display: 'flex', gap: '10px' }}>
          {shippingMethods?.map((shippingMethod) => (
            <div
              onClick={() => setShippingMethod(shippingMethod.id)}
              style={{ border: '1px solid black', padding: '20px' }}
            >
              {shippingMethod.name}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '50px', width: '100%' }}>
          <AddressForm title="Billing address" token={token} cb={() => setShowShippingAddressForm(true)} />

          {showShippingAddressForm && (
            <AddressForm title="Shipping address" token={token} cb={handleCheckoutComplete} />
          )}
        </div>
        <label style={{ marginBlock: '20px' }}>Gift card</label>
        <div>
          <input type="text" value="D0A1-41F3-9A73" style={{ width: '200px', height: '30px' }} />

          <button onClick={handleAddPromoCode}>Add</button>
        </div>
        {totalPrice && <h3>Total price: ${totalPrice}</h3>}
        {clientSecret && !isPaymentCompleted && (
          <Payment clientSecret={clientSecret} cb={() => setIsPaymentCompleted(true)} />
        )}
        {isPaymentCompleted && <h2>Payment completed</h2>}
      </div>
    );
  }

  return <div>Token not found</div>;
};

export default Checkout;
