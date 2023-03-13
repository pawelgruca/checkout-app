import AddressForm from '@/components/AddressForm';

import Payment from '@/components/Payment';
import { useCookie } from '@/hooks/useCookie';
import {
  AddressInput,
  useCheckoutBillingAddressUpdateMutation,
  useCheckoutCompleteMutation,
  useCheckoutDeliveryMethodUpdateMutation,
  useCheckoutPaymntCreateMutation,
  useCheckoutQuery,
  useCheckoutShippingAddressUpdateMutation,
} from '@/saleor/api';

import { useEffect, useState } from 'react';

const addressExample: AddressInput = {
  firstName: 'test',
  streetAddress1: 'Czecha',
  city: 'Warszawa',
  postalCode: '04-555',
  country: 'PL',
};

const Checkout = () => {
  const [checkoutDeliveryMethodUpdate] = useCheckoutDeliveryMethodUpdateMutation();
  const [checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();
  const [checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation();
  const [checkoutPaymentCreate] = useCheckoutPaymntCreateMutation();
  const [checkoutComplete] = useCheckoutCompleteMutation();
  const [showShippingAddress, setShowShippingAddress] = useState(false);

  const token = useCookie('checkout_token');
  const checkoutId = useCookie('checkout_id');

  const { data } = useCheckoutQuery({
    variables: {
      id: checkoutId,
    },
  });

  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (!token || !checkoutId) {
      return;
    }

    (async () => {
      const checkoutShippingAddressUpdateResult = await checkoutShippingAddressUpdate({
        variables: {
          token,
          shippingAddress: addressExample,
        },
      });

      const checkoutBillingAddressUpdateResult = await checkoutBillingAddressUpdate({
        variables: {
          token,
          billingAddress: addressExample,
        },
      });

      const checkoutDeliveryMethodUpdateResult = await checkoutDeliveryMethodUpdate({
        variables: {
          deliveryMethodId: 'U2hpcHBpbmdNZXRob2Q6Mg==',
          token,
        },
      });

      if (checkoutDeliveryMethodUpdateResult.errors) {
        return;
      }

      const totalPrice =
        checkoutDeliveryMethodUpdateResult.data?.checkoutDeliveryMethodUpdate?.checkout?.totalPrice.gross.amount;

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
    })();
  }, [token, checkoutId]);

  if (token) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {data?.checkout?.lines.map((line) => (
          <h2>
            {line.variant.product.name} {line.variant.pricing?.price?.gross.amount}
          </h2>
        ))}
        <div style={{ display: 'flex', gap: '50px', width: '100%' }}>
          <AddressForm title="Billing address" />
          <AddressForm title="Shipping address" />
        </div>
        {clientSecret ? <Payment clientSecret={clientSecret} /> : null}
      </div>
    );
  }

  return <div>No token found</div>;
};

export default Checkout;
