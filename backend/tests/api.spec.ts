import { test, expect } from '@playwright/test';

const GRAPHQL_ENDPOINT = 'http://localhost:4000/';

test.describe.serial('E2E Flow', () => {
  let token = '';
  const email = `test${Date.now()}@example.com`;

  test('Signup', async ({ request }) => {
    const mutation = `
      mutation {
        signup(name: "Test User", email: "${email}", password: "password123") {
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
    token = json.data.signup.token;
  });

  test('Create Category', async ({ request }) => {
    const mutation = `
      mutation {
        createCategory(input: { title: "Groceries", icon: "🍎", color: "red" }) {
          id
          title
        }
      }
    `;
    const response = await request.post(GRAPHQL_ENDPOINT, {
      data: { query: mutation },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json.data.createCategory.title).toBe('Groceries');
  });

  test('Query Me', async ({ request }) => {
      const query = `
        query {
            me {
                email
                categories {
                    title
                }
            }
        }
      `;
      const response = await request.post(GRAPHQL_ENDPOINT, {
          data: { query },
          headers: { Authorization: `Bearer ${token}` }
      });
      const json = await response.json();
      expect(json.data.me.email).toBe(email);
      expect(json.data.me.categories[0].title).toBe('Groceries');
  });
});
