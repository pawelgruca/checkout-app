import {
  AddressInput,
  CheckoutLineInput,
  useCheckoutBillingAddressUpdateMutation,
  useCheckoutCompleteMutation,
  useCheckoutCreateMutation,
  useCheckoutDeliveryMethodUpdateMutation,
  useCheckoutPayemntCreateMutation,
  useCheckoutShippingAddressUpdateMutation,
  useProductListQuery,
} from '@/saleor/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useStripe } from '@stripe/react-stripe-js';

import { loadStripe, Stripe } from '@stripe/stripe-js';

const addressExample: AddressInput = {
  firstName: 'test',
  streetAddress1: 'Czecha',
  city: 'Warszawa',
  postalCode: '04-555',
  country: 'PL',
};

export default function Home(props) {
  const [selectedProducts, setSelectedProducts] = useState<CheckoutLineInput[]>();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState('');
  const [peymentIntentId, setPeymentIntentId] = useState('');
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null>>();

  const { data } = useProductListQuery();
  const [checkoutCreate] = useCheckoutCreateMutation();
  const [checkoutDeliveryMethodUpdate] = useCheckoutDeliveryMethodUpdateMutation();
  const [checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();
  const [checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation();
  const [checkoutPaymentCreate] = useCheckoutPayemntCreateMutation();
  const [checkoutComplete] = useCheckoutCompleteMutation();
  const stripe = useStripe();

  const products = data?.products?.edges.map(({ node }) => ({
    name: node.name,
    variants: node.variants,
    thumbnail: node.thumbnail,
  }));

  const handleOnProductClick = ({ variantId, price }: { variantId: string; price?: number }) => {
    if (!price) {
      return;
    }

    setSelectedProducts((prev) => {
      const selectedProduct = { variantId, quantity: 1 };

      if (!prev?.length) {
        return [selectedProduct];
      }

      return [...prev, selectedProduct];
    });
  };

  const handleCreateCheckout = async () => {
    if (!selectedProducts?.length) {
      return;
    }
    const checkoutCreateResult = await checkoutCreate({ variables: { lines: selectedProducts } });

    const token = checkoutCreateResult.data?.checkoutCreate?.checkout?.token;

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

    const checkoutId = checkoutCreateResult.data?.checkoutCreate?.checkout?.id;
    const totalPrice =
      checkoutDeliveryMethodUpdateResult.data?.checkoutDeliveryMethodUpdate?.checkout?.totalPrice.gross.amount;

    const checkoutPaymentCreateResult = await checkoutPaymentCreate({
      variables: {
        checkoutId,
        input: {
          gateway: 'saleor.payments.stripe',
          amount: totalPrice,
        },
      },
    });

    const checkoutCompleteResult = await checkoutComplete({
      variables: {
        checkoutId,
      },
    });

    const clientSecret = JSON.parse(
      checkoutCompleteResult.data?.checkoutComplete?.confirmationData || ''
    ).client_secret;

    if (!clientSecret) {
      return;
    }

    router.replace(`payment/?checkoutId=${checkoutId}&?clientSecret=${clientSecret}`);
  };

  return (
    <>
      <ul>
        {products
          ? products.map((product) => (
              <li key={product.name}>
                <h4>{product.name}</h4>
                {product.variants?.map((variant) => (
                  <p
                    onClick={() =>
                      handleOnProductClick({ variantId: variant.id, price: variant.pricing?.price?.gross.amount })
                    }
                  >
                    {variant.id} {variant.pricing?.price?.gross.amount}
                  </p>
                ))}
              </li>
            ))
          : null}
      </ul>
      <button disabled={!selectedProducts?.length} onClick={handleCreateCheckout}>
        Create checkout
      </button>
    </>
  );
}
