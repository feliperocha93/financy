import { expect, test } from '@playwright/test';
import { createCategory, createTransaction, buildUser, signup, deleteCategories, deleteUsers, deleteTransactions, cleanDb } from './testFixture';

test.describe.serial('Category', async () => {
    const userCurrent = buildUser('Category - Current');
    const userOther = buildUser('Category - Other');

    let tokenCurrent: string;
    let tokenOther: string;

    test.beforeAll(async ({ request }) => {
        await cleanDb();
        tokenCurrent = await signup(userCurrent, request);
        tokenOther = await signup(userOther, request);
    });

    test.afterEach(async () => {
        await deleteCategories();
    });

    test.describe('categories', () => {
        test('returns categories', async ({ request }) => {
            await createCategory(tokenCurrent, request);
            const query = `
                query {
                    categories {
                        id
                        title
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: query },
                headers: {
                    Authorization: `Bearer ${tokenCurrent}`,
                },
            });
            const json = await response.json();
            const categories = json.data.categories;
            expect(categories.length).toBeGreaterThan(0);
            expect(categories[0].id).toBeDefined();
            expect(categories[0].title).toBe('Test Category');
        });

        test('returns error when not authenticated', async ({ request }) => {
            const query = `
                query {
                    categories {
                        id
                        title
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
            expect(json.errors).toBeDefined();
            expect(json.errors.length).toBeGreaterThan(0);
            expect(json.errors[0].message).toBe('Not authenticated');
        });

        test('returns only categories for the current user', async ({ request }) => {
            const categoryIdOther = await createCategory(tokenOther, request);
            const query = `
                query { categories { id title } }
            `;
            const response = await request.post('/', {
                data: { query: query },
                headers: { Authorization: `Bearer ${tokenCurrent}` },
            });
            const json = await response.json();
            const categories = json.data.categories;
            for (const category of categories) {
                expect(category.id).not.toBe(categoryIdOther);
            }
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
                    Authorization: `Bearer ${tokenCurrent}`,
                },
            });
            const json = await response.json();
            const category = json.data.createCategory;
            expect(category.id).toBeDefined();
            expect(category.title).toBe('Test Category');
        });

        test('returns error when not authenticated', async ({ request }) => {
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
                    Authorization: `Bearer invalidtoken`,
                },
            });
            const json = await response.json();
            expect(json.errors).toBeDefined();
            expect(json.errors.length).toBeGreaterThan(0);
            expect(json.errors[0].message).toBe('Not authenticated');
        });

        test('returns error when invalid data is provided', async ({ request }) => {
            const mutation = `
                mutation {
                    createCategory(data: { title: "Test Category", color: "#000000" }) {
                        id
                        title
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: {
                    Authorization: `Bearer ${tokenCurrent}`,
                },
            });
            expect(response.status()).toBe(400);
            const json = await response.json();
            expect(json.errors.length).toBeGreaterThan(0);
        });
    })

    test.describe('update category', () => {
        test('updates category', async ({ request }) => {
            const categoryId = await createCategory(tokenCurrent, request);
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
                    Authorization: `Bearer ${tokenCurrent}`,
                },
            });
            const json = await response.json();
            const category = json.data.updateCategory;
            expect(category.title).toBe('Updated Category');
        });

        test('returns error when not authenticated', async ({ request }) => {
            const categoryId = await createCategory(tokenCurrent, request);
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
                    Authorization: `Bearer invalidtoken`,
                },
            });
            const json = await response.json();
            expect(json.errors).toBeDefined();
            expect(json.errors.length).toBeGreaterThan(0);
            expect(json.errors[0].message).toBe('Not authenticated');
        });

        test('returns error when category not found', async ({ request }) => {
            const mutation = `
                mutation {
                    updateCategory(id: "123", data: { title: "Updated Category", icon: "fa-test-icon", color: "#000000" }) {
                        id
                        title
                    }
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: {
                    Authorization: `Bearer ${tokenCurrent}`,
                },
            });
            expect(response.status()).toBe(404);
        });

        test('returns error when category does not belong to the current user', async ({ request }) => {
            const categoryId = await createCategory(tokenOther, request);
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
                    Authorization: `Bearer ${tokenCurrent}`,
                },
            });
            expect(response.status()).toBe(404);
        });
    });

    test.describe('delete category', () => {
        test('deletes category', async ({ request }) => {
            const categoryId = await createCategory(tokenCurrent, request);
            const mutation = `
                mutation {
                    deleteCategory(id: "${categoryId}")
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: {
                    Authorization: `Bearer ${tokenCurrent}`,
                },
            });
            const json = await response.json();
            expect(json.data.deleteCategory).toBe(true);
        });

        test('returns error when not authenticated', async ({ request }) => {
            const categoryId = await createCategory(tokenCurrent, request);
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
            expect(json.errors).toBeDefined();
            expect(json.errors.length).toBeGreaterThan(0);
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
                    Authorization: `Bearer ${tokenCurrent}`,
                },
            });
            expect(response.status()).toBe(404);
        });

        test('returns error when category does not belong to the current user', async ({ request }) => {
            const categoryId = await createCategory(tokenOther, request);
            const mutation = `
                mutation {
                    deleteCategory(id: "${categoryId}")
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: {
                    Authorization: `Bearer ${tokenCurrent}`,
                },
            });
            expect(response.status()).toBe(404);
        });

        test('returns clear error when category has transactions', async ({ request }) => {
            const categoryId = await createCategory(tokenCurrent, request);
            await createTransaction(tokenCurrent, request, categoryId);
            const mutation = `
                mutation {
                    deleteCategory(id: "${categoryId}")
                }
            `;
            const response = await request.post('/', {
                data: { query: mutation },
                headers: {
                    Authorization: `Bearer ${tokenCurrent}`,
                },
            });
            const json = await response.json();
            expect(json.errors).toBeDefined();
            expect(json.errors.length).toBeGreaterThan(0);
            const message = json.errors[0].message ?? '';
            expect(message).toContain('1 transaction(s)');
            expect(message).toContain('Reassign or remove them first');
            await deleteTransactions();
        });
    });
});
