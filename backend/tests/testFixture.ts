import { APIRequestContext } from "@playwright/test";

export interface User {
    name: string;
    email: string;
    password: string;
}

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
