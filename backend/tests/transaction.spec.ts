import { expect, test } from '@playwright/test';
import {
    createCategory,
    createTransaction,
    buildUserObject,
    signup,
    deleteUserTransactions,
    SignupResponse,
    findTransaction,
    cleanUser,
} from './testFixture';

test.describe.configure({ mode: 'serial' });
test.describe('Transaction', async () => {
    const userObject = buildUserObject('Transaction - User');
    const thirdObject = buildUserObject('Transaction - Third');

    let user: SignupResponse;
    let third: SignupResponse;

    test.beforeAll(async ({ request }) => {
        user = await signup(userObject, request);
        third = await signup(thirdObject, request);
    });

    test.afterEach(async () => {
        await deleteUserTransactions(user.userId);
        await deleteUserTransactions(third.userId);
    });

    test.afterAll(async () => {
        await cleanUser(user.userId);
        await cleanUser(third.userId);
    });

    const validDate = new Date().toISOString();

    test.describe('transactions', () => {
        test('should return user transactions', async ({ request }) => {
            const categoryId = await createCategory(user.userId);
            const transactionId = await createTransaction(user.userId, categoryId);
            const query = `
                query {
                    transactions {
                        id
                        date
                        category { id }
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query },
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const json = await response.json();
            const transactions = json.data.transactions;
            expect(transactions.length).toBe(1);
            expect(transactions[0].id).toBe(transactionId);
            expect(transactions[0].date).toBeDefined();
            expect(transactions[0].category?.id).toBe(categoryId);
        });

        test('should return error when not authenticated', async ({ request }) => {
            const query = `
                query {
                    transactions {
                        id
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query },
                headers: { Authorization: `Bearer invalidtoken` },
            });
            const json = await response.json();
            expect(json.errors[0].message).toBe('Not authenticated');
        });

        test('should not return third user\'s transactions', async ({ request }) => {
            const categoryId = await createCategory(third.userId);
            await createTransaction(third.userId, categoryId);
            const query = `
                query {
                    transactions {
                        id
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query },
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const json = await response.json();
            expect(json.data.transactions.length).toBe(0);
        });
    });

    test.describe('createTransaction', () => {
        test('should create transaction', async ({ request }) => {
            const categoryId = await createCategory(user.userId);
            const mutation = `
                mutation {
                    createTransaction(data: {
                        description: "Show me the money",
                        amount: 100,
                        date: "${validDate}",
                        type: INCOME,
                        categoryId: "${categoryId}"
                    }) {
                        id
                        description
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const json = await response.json();
            const transaction = json.data.createTransaction;
            const foundTransaction = await findTransaction(transaction.id, user.userId);
            expect(foundTransaction?.description).toBe('Show me the money');
        });

        test('should return error when not authenticated', async ({ request }) => {
            const categoryId = await createCategory(user.userId);
            const mutation = `
                mutation {
                    createTransaction(data: {
                        description: "Test",
                        amount: 100,
                        date: "${validDate}",
                        type: INCOME,
                        categoryId: "${categoryId}"
                    }) {
                        id
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: { Authorization: `Bearer invalidtoken` },
            });
            const json = await response.json();
            expect(json.errors[0].message).toBe('Not authenticated');
        });

        test('should return error when category not found or does not belong to user', async ({ request }) => {
            const thirdCategoryId = await createCategory(third.userId);
            const mutation = `
                mutation {
                    createTransaction(data: {
                        description: "Test",
                        amount: 100,
                        date: "${validDate}",
                        type: INCOME,
                        categoryId: "${thirdCategoryId}"
                    }) {
                        id
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: { Authorization: `Bearer ${user.token}` },
            });
            expect(response.status()).toBe(404);
            const json = await response.json();
            expect(json.errors[0].message).toContain('Category not found or access denied');
        });
    });

    test.describe('updateTransaction', () => {
        test('should update transaction', async ({ request }) => {
            const categoryId = await createCategory(user.userId);
            const transactionId = await createTransaction(user.userId, categoryId);
            const mutation = `
                mutation {
                    updateTransaction(id: "${transactionId}", data: { description: "Updated Transaction" }) {
                        id
                        description
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const json = await response.json();
            const transaction = json.data.updateTransaction;
            const foundTransaction = await findTransaction(transaction.id, user.userId);
            expect(foundTransaction?.description).toBe('Updated Transaction');
        });

        test('should return error when not authenticated', async ({ request }) => {
            const categoryId = await createCategory(user.userId);
            const transactionId = await createTransaction(user.userId, categoryId);
            const mutation = `
                mutation {
                    updateTransaction(id: "${transactionId}", data: { description: "Updated" }) {
                        id
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: { Authorization: `Bearer invalidtoken` },
            });
            const json = await response.json();
            expect(json.errors[0].message).toBe('Not authenticated');
        });

        test('should return error when transaction not found', async ({ request }) => {
            const mutation = `
                mutation {
                    updateTransaction(id: "00000000-0000-0000-0000-000000000000", data: { description: "Updated" }) {
                        id
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: { Authorization: `Bearer ${user.token}` },
            });
            expect(response.status()).toBe(404);
            const json = await response.json();
            expect(json.errors[0].message).toContain('Transaction not found or access denied');
        });

        test('should return error when transaction does not belong to user', async ({ request }) => {
            const categoryId = await createCategory(third.userId);
            const otherTransactionId = await createTransaction(third.userId, categoryId);
            const mutation = `
                mutation {
                    updateTransaction(id: "${otherTransactionId}", data: { description: "Updated" }) {
                        id
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: { Authorization: `Bearer ${user.token}` },
            });
            expect(response.status()).toBe(404);
            const json = await response.json();
            expect(json.errors[0].message).toContain('Transaction not found or access denied');
        });

        test('should return error when new categoryId is not found or does not belong to user', async ({ request }) => {
            const categoryId = await createCategory(user.userId);
            const thirdCategoryId = await createCategory(third.userId);
            const transactionId = await createTransaction(user.userId, categoryId);
            const mutation = `
                mutation {
                    updateTransaction(id: "${transactionId}", data: { categoryId: "${thirdCategoryId}" }) {
                        id
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: { Authorization: `Bearer ${user.token}` },
            });
            expect(response.status()).toBe(404);
            const json = await response.json();
            expect(json.errors[0].message).toContain('Category not found or access denied');
        });
    });

    test.describe('deleteTransaction', () => {
        test('should delete transaction and return true', async ({ request }) => {
            const categoryId = await createCategory(user.userId);
            const transactionId = await createTransaction(user.userId, categoryId);
            const mutation = `
                mutation {
                    deleteTransaction(id: "${transactionId}")
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const json = await response.json();
            expect(json.data.deleteTransaction).toBe(true);
            const foundTransaction = await findTransaction(transactionId, user.userId);
            expect(foundTransaction).toBeNull();
        });

        test('should return error when not authenticated', async ({ request }) => {
            const categoryId = await createCategory(user.userId);
            const transactionId = await createTransaction(user.userId, categoryId);
            const mutation = `
                mutation {
                    deleteTransaction(id: "${transactionId}")
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: { Authorization: `Bearer invalidtoken` },
            });
            const json = await response.json();
            expect(json.errors[0].message).toBe('Not authenticated');
        });

        test('should return false when transaction not found', async ({ request }) => {
            const mutation = `
                mutation {
                    deleteTransaction(id: "00000000-0000-0000-0000-000000000000")
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const json = await response.json();
            expect(json.data.deleteTransaction).toBe(false);
        });

        test('should return false when transaction belongs to another user', async ({ request }) => {
            const categoryId = await createCategory(third.userId);
            const transactionId = await createTransaction(third.userId, categoryId);
            const mutation = `
                mutation {
                    deleteTransaction(id: "${transactionId}")
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const json = await response.json();
            expect(json.data.deleteTransaction).toBe(false);
        });
    });
});
