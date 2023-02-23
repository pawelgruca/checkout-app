import { ApolloClient, InMemoryCache } from "@apollo/client";
require("dotenv").config();
const API_URI = process.env.NEXT_PUBLIC_API_URI;

export const client = new ApolloClient({
  uri: API_URI,
  cache: new InMemoryCache(),
});
