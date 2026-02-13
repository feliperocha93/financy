import { expect, test } from '@playwright/test';
import { createCategory, createTransaction, buildUserObject, signup, deleteUserCategories, deleteUserTransactions, SignupResponse, findCategory, cleanUser } from './testFixture';

test.describe.configure({ mode: 'serial' });

test.describe('Category', async () => {
    const userObject = buildUserObject('Category - User');
    const thirdObject = buildUserObject('Category - Third');

    let user: SignupResponse;
    let third: SignupResponse;

    test.beforeAll(async ({ request }) => {
        user = await signup(userObject, request);
        third = await signup(thirdObject, request);
    });

    test.afterEach(async () => {
        await deleteUserCategories(user.userId);
        await deleteUserCategories(third.userId);
    });

    test.afterAll(async () => {
        await cleanUser(user.userId);
        await cleanUser(third.userId);
    });

    test.describe('categories', () => {
        test('returns categories', async ({ request }) => {
            const categoryId = await createCategory(user.userId);
            const query = `
                query {
                    categories {
                        id
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: query },
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const json = await response.json();
            const categories = json.data.categories;
            expect(categories.length).toBe(1);
            expect(categories[0].id).toBe(categoryId);
        });

        test('returns error when not authenticated', async ({ request }) => {
            const query = `
                query {
                    categories {
                        id
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: query },
                headers: {
                    Authorization: `Bearer invalidtoken`,
                },
            });
            const json = await response.json();
            expect(json.errors[0].message).toBe('Not authenticated');
        });

        test('returns only categories for the current user', async ({ request }) => {
            await createCategory(third.userId);
            const query = `
                query { categories { id } }
            `;
            const response = await request.post('/', {
                data: { query: query },
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const json = await response.json();
            expect(json.data.categories.length).toBe(0);
        });
    })

    test.describe('create category', () => {
        test('creates category', async ({ request }) => {
            const mutation = `
                mutation {
                    createCategory(data: { title: "Test Category", icon: "fa-test-icon", color: "#000000" }) {
                        id
                        title
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const json = await response.json();
            const category = json.data.createCategory;
            const foundCategory = await findCategory(category.id, user.userId);
            expect(foundCategory).toBeDefined();
        });

        test('returns error when not authenticated', async ({ request }) => {
            const mutation = `
                mutation {
                    createCategory(data: { title: "Test Category", icon: "fa-test-icon", color: "#000000" }) {
                        id
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: {
                    Authorization: `Bearer invalidtoken`,
                },
            });
            const json = await response.json();
            expect(json.errors[0].message).toBe('Not authenticated');
        });

        test('returns error when invalid data is provided', async ({ request }) => {
            const mutation = `
                mutation {
                    createCategory(data: { title: "Test Category", color: "#000000" }) {
                        id
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            expect(response.status()).toBe(400);
            const json = await response.json();
            expect(json.errors.length).toBeGreaterThan(0);
        });
    })

    test.describe('update category', () => {
        test('updates category', async ({ request }) => {
            const categoryId = await createCategory(user.userId);
            const mutation = `
                mutation {
                    updateCategory(id: "${categoryId}", data: { title: "Updated Category", icon: "fa-test-icon", color: "#000000" }) {
                        id
                        title
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const json = await response.json();
            const category = json.data.updateCategory;
            const foundCategory = await findCategory(category.id, user.userId);
            expect(foundCategory?.title).toBe('Updated Category');
        });

        test('returns error when not authenticated', async ({ request }) => {
            const categoryId = await createCategory(user.userId);
            const mutation = `
                mutation {
                    updateCategory(id: "${categoryId}", data: { title: "Updated Category", icon: "fa-test-icon", color: "#000000" }) {
                        id
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: {
                    Authorization: `Bearer invalidtoken`,
                },
            });
            const json = await response.json();
            expect(json.errors[0].message).toBe('Not authenticated');
        });

        test('returns error when category not found', async ({ request }) => {
            const mutation = `
                mutation {
                    updateCategory(id: "123", data: { title: "Updated Category", icon: "fa-test-icon", color: "#000000" }) {
                        id
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            expect(response.status()).toBe(404);
        });

        test('returns error when category does not belong to the current user', async ({ request }) => {
            const categoryId = await createCategory(third.userId);
            const mutation = `
                mutation {
                    updateCategory(id: "${categoryId}", data: { title: "Updated Category", icon: "fa-test-icon", color: "#000000" }) {
                        id
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            expect(response.status()).toBe(404);
        });
    });

    test.describe('delete category', () => {
        test('deletes category', async ({ request }) => {
            const categoryId = await createCategory(user.userId);
            const mutation = `
                mutation {
                    deleteCategory(id: "${categoryId}")
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const json = await response.json();
            expect(json.data.deleteCategory).toBe(true);
            const foundCategory = await findCategory(categoryId, user.userId);
            expect(foundCategory).toBeNull();
        });

        test('returns error when not authenticated', async ({ request }) => {
            const categoryId = await createCategory(user.userId);
            const mutation = `
                mutation {
                    deleteCategory(id: "${categoryId}")
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: {
                    Authorization: `Bearer invalidtoken`,
                },
            });
            const json = await response.json();
            expect(json.errors[0].message).toBe('Not authenticated');
        });

        test('returns error when category not found', async ({ request }) => {
            const mutation = `
                mutation {
                    deleteCategory(id: "123")
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            expect(response.status()).toBe(404);
        });

        test('returns error when category does not belong to the current user', async ({ request }) => {
            const categoryId = await createCategory(third.userId);
            const mutation = `
                mutation {
                    deleteCategory(id: "${categoryId}")
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            expect(response.status()).toBe(404);
        });

        test('returns clear error when category has transactions', async ({ request }) => {
            const categoryId = await createCategory(user.userId);
            await createTransaction(user.userId, categoryId);
            const mutation = `
                mutation {
                    deleteCategory(id: "${categoryId}")
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            await deleteUserTransactions(user.userId);
            const json = await response.json();
            const message = json.errors[0].message ?? '';
            expect(message).toContain('1 transaction(s)');
            expect(message).toContain('Reassign or remove them first');
        });
    });
});
