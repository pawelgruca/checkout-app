interface AddressFormProps {
  title: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ title }) => {
  return (
    <div>
      <h3>{title}</h3>
      <form style={{ display: 'flex', flexDirection: 'column', width: '400px', gap: '10px' }}>
        <label htmlFor="firstName">First name</label>
        <input type="text" id="firstName" name="firstName" />
        <label htmlFor="lastName">Last name</label>
        <input type="text" id="lastName" name="lastName" />
        <label htmlFor="postalCode">Postal code</label>
        <input type="text" id="postalCode" name="postalCode" />
        <label htmlFor="address">Address</label>
        <input type="text" id="address" name="address" />
        <label htmlFor="city">City</label>
        <input type="text" id="city" name="city" />
        <label htmlFor="country">Country</label>
        <input type="text" id="country" name="country" />
        <button style={{ paddingBlock: '10px' }}>Continue to payment</button>
      </form>
    </div>
  );
};

export default AddressForm;
