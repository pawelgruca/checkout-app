import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
require("dotenv").config();

export const ORDERS_APP_CLIENT = "ORDERS_APP_CLIENT";
const API_URI = process.env.NEXT_PUBLIC_API_URI;

export const client = new ApolloClient({
  uri: API_URI,
  cache: new InMemoryCache(),
});
