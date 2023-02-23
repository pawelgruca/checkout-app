import { NextPage } from "next";
import { useFetchAllCheckoutsQuery } from "../../generated/graphql";

const ExamplePage: NextPage = () => {
  const [{ data, error }] = useFetchAllCheckoutsQuery();

  if (!data?.checkouts) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      <h1>Example page</h1>
      <main>
        {data.checkouts.edges.map(({ node }) => (
          <p key={node.id}>{node.id}</p>
        ))}
      </main>
    </div>
  );
};

export default ExamplePage;
