import { test, expect, } from '@playwright/test';

const GRAPHQL_ENDPOINT = 'http://localhost:4000/';

test.describe.serial('Auth', () => {
  const name = `Test User ${Date.now()}`;
  const email = `test${Date.now()}@example.com`;
  const password = 'password123';

  test('Signup', async ({ request }) => {
    const mutation = `
      mutation {
        signup(name: "${name}", email: "${email}", password: "${password}") {
          token
          user {
            id
            email
          }
        }
      }
    `;
    const response = await request.post(GRAPHQL_ENDPOINT, {
      data: { query: mutation },
    });
    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json.data.signup.user.email).toBe(email);
  });

  test('Signup with existing email', async ({ request }) => {
    const mutation = `
      mutation {
        signup(name: "${name}", email: "${email}", password: "${password}") {
          token
          user {
            id
            email
          }
        }
      }
    `;
    const response = await request.post(GRAPHQL_ENDPOINT, {
      data: { query: mutation },
    });
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
    const json = await response.json();
    expect(json.errors[0].message).toBe('User already exists');

  });

  test('Login', async ({ request }) => {
    const mutation = `
      mutation {
        login(email: "${email}", password: "${password}") {
          token
          user {
            id
            email
          }
        }
      }
    `;
    const response = await request.post(GRAPHQL_ENDPOINT, {
      data: { query: mutation },
    });
    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json.data.login.user.email).toBe(email);
  });

  test('Login with invalid email', async ({ request }) => {
    const mutation = `
      mutation {
        login(email: "invalidemail@example.com", password: "${password}") {
          token
        }
      }
    `;
    const response = await request.post(GRAPHQL_ENDPOINT, {
      data: { query: mutation },
    });
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
    const json = await response.json();
    expect(json.errors[0].message).toBe('Invalid credentials');
  });

  test('Login with invalid password', async ({ request }) => {
    const mutation = `
      mutation {
        login(email: "${email}", password: "wrongpassword") {
          token
        }
      }
    `;
    const response = await request.post(GRAPHQL_ENDPOINT, {
      data: { query: mutation },
    });
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);
    const json = await response.json();
    expect(json.errors[0].message).toBe('Invalid credentials');
  });
});
