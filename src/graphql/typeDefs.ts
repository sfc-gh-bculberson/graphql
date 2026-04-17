export const typeDefs = `#graphql
  type Customer {
    cCustomerSk: String!
    cCustomerId: String
    cFirstName: String
    cLastName: String
  }

  type Query {
    customers(limit: Int = 5): [Customer!]!
    customerHealth: String!
  }
`;
