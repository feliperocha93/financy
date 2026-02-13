import { expect, test } from '@playwright/test';
import { buildUserObject, cleanUser, createCategory, createTransaction, signup, SignupResponse } from './testFixture';

test.describe('User', async () => {
  const userObject = buildUserObject('User - User');
  const thirdObject = buildUserObject('User - Third');

  let user: SignupResponse;
  let third: SignupResponse;

  test.beforeAll(async ({ request }) => {
    user = await signup(userObject, request);
    third = await signup(thirdObject, request);
  });

  test.afterAll(async () => {
    await cleanUser(user.userId);
    await cleanUser(third.userId);
  });

  test('Query Me', async ({ request }) => {
    const userCategory = await createCategory(user.userId);
    const userTransaction = await createTransaction(user.userId, userCategory);

    const thirdCategory = await createCategory(third.userId);
    const thirdTransaction = await createTransaction(third.userId, thirdCategory);

    const query = `
      query {
        me {
          email
          categories {
            id
          }
          transactions {
            id
          }
        }
      }
    `;
    const response = await request.post('/', {
      data: { query },
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json.data.me.email).toBe(userObject.email);
    expect(json.data.me.categories.length).toBe(1);
    expect(json.data.me.categories[0].id).toBe(userCategory);
    expect(json.data.me.transactions.length).toBe(1);
    expect(json.data.me.transactions[0].id).toBe(userTransaction);
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
