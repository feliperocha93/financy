import { APIRequestContext } from "@playwright/test";
import { prisma } from "../src/context";
import { TransactionType } from "@prisma/client";

export interface UserObject {
  name: string;
  email: string;
  password: string;
}

/**
 * Build a user object
 * @param prefix - The prefix for the user
 * @returns The user object @see UserObject
 */
export const buildUserObject = (prefix: string): UserObject => {
  return { name: `${prefix} User ${Date.now()}`, email: `${prefix}-test${Date.now()}@example.com`, password: 'password123' };
};

export interface SignupResponse {
  userId: string;
  token: string;
}

/**
 * Create new user and return the token
 * @param userObject - The user to signup
 * @param request - The request context
 * @returns The user id and token @see SignupResponse
 */
export const signup = async (userObject: UserObject, request: APIRequestContext): Promise<SignupResponse> => {
  const mutation = `
      mutation {
        signup(name: "${userObject.name}", email: "${userObject.email}", password: "${userObject.password}") {
          token
          user {
            id
          }
        }
      }
    `;
  const response = await request.post("/", {
    data: { query: mutation },
  });
  const json = await response.json();
  const userId = json.data.signup.user.id;
  const token = json.data.signup.token;
  return { userId, token };
};

export const createUser = async (userObject: UserObject) => {
  const user = await prisma.user.create({
    data: {
      name: userObject.name,
      email: userObject.email,
      password: userObject.password,
    },
  });
  return user.id;
}

/**
 * Create new category
 * @param userId - The user id
 * @returns The category
 */
export const createCategory = async (userId: string) => {
  const category = await prisma.category.create({
    data: {
      title: "Test Category",
      icon: "fa-test-icon",
      color: "#000000",
      userId,
    },
  });
  return category.id;
};

/**
 * Create new transaction
 * @param userId - The user id
 * @param categoryId - The category id
 * @returns The transaction
 */
export const createTransaction = async (userId: string, categoryId: string) => {
  const transaction = await prisma.transaction.create({
    data: {
      description: "Test Transaction",
      amount: 100,
      date: new Date(),
      type: TransactionType.INCOME,
      categoryId,
      userId,
    },
  });
  return transaction.id;
};

/**
 * Find a category by id and user id
 * @param id - The category id
 * @param userId - The user id
 * @returns The category
 */
export const findCategory = async (id: string, userId: string) => {
  return await prisma.category.findUnique({
    where: {
      id,
      userId,
    },
  });
};

/**
 * Find a transaction by id and user id
 * @param id - The transaction id
 * @param userId - The user id
 * @returns The transaction
 */
export const findTransaction = async (id: string, userId: string) => {
  return await prisma.transaction.findFirst({
    where: {
      id,
      userId,
    },
  });
};

/**
 * Delete all categories for a user
 * @param userId - The user id
 */
export const deleteUserCategories = async (userId: string) => {
  await prisma.category.deleteMany({
    where: {
      userId
    },
  });
};

/**
 * Delete all transactions for a user
 * @param userId - The user id
 */
export const deleteUserTransactions = async (userId: string) => {
  await prisma.transaction.deleteMany({
    where: {
      userId
    },
  });
};

/**
 * Delete a user
 * @param id - The user id
 */
export const deleteUser = async (id: string) => {
  await prisma.user.delete({
    where: {
      id
    },
  });
};

/**
 * Clean a user and all its data
 * @param userId - The user id
 */
export const cleanUser = async (userId: string) => {
  await deleteUserTransactions(userId);
  await deleteUserCategories(userId);
  await deleteUser(userId);
};
