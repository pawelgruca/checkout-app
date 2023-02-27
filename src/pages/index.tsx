import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import {
  CheckoutLineInput,
  useCheckoutCreateMutation,
  useCheckoutDeliveryMethodUpdateMutation,
  useCheckoutPayemntCreateMutation,
  useCheckoutShippingAddressUpdateMutation,
  useProductListQuery,
} from '@/saleor/api';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [selectedProducts, setSelectedProducts] = useState<CheckoutLineInput[]>();
  const router = useRouter();

  const { data } = useProductListQuery();
  const [checkoutCreate] = useCheckoutCreateMutation();
  const [checkoutDeliveryMethodUpdate] = useCheckoutDeliveryMethodUpdateMutation();
  const [checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();
  // const [checkoutPaymentCreate] = useCheckoutPaymntCreateMutation();

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
        shippingAddress: {
          firstName: 'test',
          streetAddress1: 'Czecha',
          city: 'Warszawa',
          postalCode: '04-555',
          country: 'PL',
        },
      },
    });

    console.log(checkoutShippingAddressUpdateResult);

    const checkoutDeliveryMethodUpdateResult = await checkoutDeliveryMethodUpdate({
      variables: {
        deliveryMethodId: 'U2hpcHBpbmdNZXRob2Q6Mg==',
        // id: 'Q2hlY2tvdXQ6MWM5NTZjNDEtOGMxZS00NTNjLWE3YmUtNTYxNjEwMGY1M2Jj',
        token,
      },
    });

    if (!checkoutDeliveryMethodUpdateResult.errors) {
      // console.log(checkoutDeliveryMethodUpdateResult);
      // checkoutPaymentCreate({variables: {
      //   checkouId: '',
      //   token: '',
      //   input: {
      //     gateway: ''
      //   }
      // }});
      router.push('/payment');
    }
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
