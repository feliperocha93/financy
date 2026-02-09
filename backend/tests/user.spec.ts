import { expect, test } from '@playwright/test';
import { signup } from './testFixture';

test.describe.serial('User', async () => {
  const user = {
    name: `User Test User ${Date.now()}`,
    email: `user-test${Date.now()}@example.com`,
    password: 'password123',
  };

  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await signup(user, request);
  });

  test('Query Me', async ({ request }) => {
    const query = `
      query {
        me {
          email
        }
      }
    `;
    const response = await request.post('/', {
      data: { query },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json.data.me.email).toBe(user.email);
  });

  test('Query Me with invalid token', async ({ request }) => {
    const query = `
      query {
        me {
          email
        }
      }
    `;
    const response = await request.post('/', {
      data: { query },
      headers: {
        Authorization: `Bearer invalidtoken`,
      },
    });
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(401);
    const json = await response.json();
    expect(json.errors[0].message).toBe('Not authenticated');
  });
});
