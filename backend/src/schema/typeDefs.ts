export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    categories: [Category!]
    transactions: [Transaction!]
  }

  type Category {
    id: ID!
    title: String!
    icon: String!
    color: String!
    transactions: [Transaction!]
  }

  type Transaction {
    id: ID!
    description: String!
    amount: Float!
    date: String!
    type: TransactionType!
    category: Category
  }

  enum TransactionType {
    INCOME
    EXPENSE
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    transactions: [Transaction!]!
    categories: [Category!]!
  }

  input CreateCategoryInput {
    title: String!
    icon: String!
    color: String!
  }

  input UpdateCategoryInput {
    title: String
    icon: String
    color: String
  }

  input CreateTransactionInput {
    description: String!
    amount: Float!
    date: String!
    type: TransactionType!
    categoryId: ID!
  }

  input UpdateTransactionInput {
    description: String
    amount: Float
    date: String
    type: TransactionType
    categoryId: ID
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!

    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(id: ID!, input: UpdateTransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`;
