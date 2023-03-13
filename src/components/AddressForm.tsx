import {
  AddressInput,
  useCheckoutBillingAddressUpdateMutation,
  useCheckoutShippingAddressUpdateMutation,
} from '@/saleor/api';
import { FormEvent } from 'react';

const addressExample: AddressInput = {
  firstName: 'John',
  lastName: 'Doe',
  streetAddress1: 'Tęczowa 7',
  city: 'Wrocław',
  postalCode: '53-601',
  country: 'PL',
};

interface AddressFormProps {
  title: string;
  cb?: () => void;
  token: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ title, cb, token }) => {
  const [checkoutBillingAddressUpdate] = useCheckoutBillingAddressUpdateMutation();
  const [checkoutShippingAddressUpdate] = useCheckoutShippingAddressUpdateMutation();

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title === 'Billing address') {
      await checkoutBillingAddressUpdate({
        variables: {
          billingAddress: addressExample,
          token,
        },
      });
    } else {
      const result = await checkoutShippingAddressUpdate({
        variables: {
          shippingAddress: addressExample,
          token,
        },
      });
    }

    cb && cb();
  };

  return (
    <div>
      <h3>{title}</h3>
      <form
        onSubmit={handleFormSubmit}
        style={{ display: 'flex', flexDirection: 'column', width: '400px', gap: '10px' }}
      >
        <label htmlFor="firstName">First name</label>
        <input type="text" id="firstName" name="firstName" value={addressExample.firstName!} />
        <label htmlFor="lastName">Last name</label>
        <input type="text" id="lastName" name="lastName" value={addressExample.lastName!} />
        <label htmlFor="postalCode">Postal code</label>
        <input type="text" id="postalCode" name="postalCode" value={addressExample.postalCode!} />
        <label htmlFor="address">Address</label>
        <input type="text" id="address" name="address" value={addressExample.streetAddress1!} />
        <label htmlFor="city">City</label>
        <input type="text" id="city" name="city" value={addressExample.city!} />
        <label htmlFor="country">Country</label>
        <input type="text" id="country" name="country" value={'Poland'} />
        <button type="submit" style={{ paddingBlock: '10px' }}>
          Continue
        </button>
      </form>
    </div>
  );
};

export default AddressForm;
