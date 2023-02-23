import { NextPage } from "next";
import {
  CountryCode,
  useAddressValidationRulesQuery,
  useCheckoutCreateMutation,
  useFetchAllCheckoutsQuery,
} from "../../generated/graphql";

const ExamplePage: NextPage = () => {
  const [{ data, error }] = useFetchAllCheckoutsQuery();
  const [{ data: addressValidationRulesData }] = useAddressValidationRulesQuery({
    variables: {
      countryCode: CountryCode.Pl,
    },
  });
  const [createCheckoutData, createCheckout] = useCheckoutCreateMutation();

  const handleCheckoutCreate = () => {
    createCheckout({});
    console.log(createCheckoutData);
  };

  console.log(addressValidationRulesData);

  if (!data?.checkouts) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      <h1>Example page</h1>
      <button onClick={handleCheckoutCreate}>test create checkout</button>
      <main>
        {data.checkouts.edges.map(({ node }) => (
          <p key={node.id}>{node.id}</p>
        ))}
      </main>
    </div>
  );
};

export default ExamplePage;
