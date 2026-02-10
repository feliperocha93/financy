import { APIRequestContext } from "@playwright/test";
import { prisma } from "../src/context";

export interface User {
  name: string;
  email: string;
  password: string;
}

export const buildUser = (prefix: string): User => {
  return { name: `${prefix} User ${Date.now()}`, email: `${prefix}-test${Date.now()}@example.com`, password: 'password123' };
};

/**
 * Create new user and return the token
 * @param user - The user to signup
 * @param request - The request context
 * @returns The token
 */
export const signup = async (user: User, request: APIRequestContext) => {
  const mutation = `
      mutation {
        signup(name: "${user.name}", email: "${user.email}", password: "${user.password}") {
          token
        }
      }
    `;
  const response = await request.post("/", {
    data: { query: mutation },
  });
  const json = await response.json();
  return json.data.signup.token;
};

/**
 * Create new category and return the id
 * @param token - The token
 * @param request - The request context
 * @returns The category id
 */
export const createCategory = async (token: string, request: APIRequestContext) => {
  const mutation = `
      mutation {
        createCategory(data: { title: "Test Category", icon: "fa-test-icon", color: "#000000" }) {
          id
          title
        }
      }
    `;
  const response = await request.post("/", {
    data: { query: mutation },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await response.json();
  return json.data.createCategory.id;
};

/**
 * Create new transaction and return the id
 * @param token - The token
 * @param request - The request context
 * @param categoryId - The category id
 * @returns The transaction id
 */
export const createTransaction = async (token: string, request: APIRequestContext, categoryId: string) => {
  const mutation = `
      mutation {
                createTransaction(data: { description: "Test Transaction", amount: 100, date: "2026-01-01", type: INCOME, categoryId: "${categoryId}" }) {
                    id
                }
            }
    `;
  const response = await request.post("/", {
    data: { query: mutation },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await response.json();
  return json.data.createTransaction.id;
};

export const deleteCategories = async () => {
  await prisma.category.deleteMany();
};

export const deleteTransactions = async () => {
  await prisma.transaction.deleteMany();
};

export const deleteUsers = async () => {
  await prisma.user.deleteMany();
};

export const cleanDb = async () => {
  await deleteTransactions();
  await deleteCategories();
  await deleteUsers();
};
