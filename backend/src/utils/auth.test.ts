import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from './auth';

describe('Auth Utils', () => {
  it('should hash and verify password correctly', async () => {
    const password = 'mysecretpassword';
    const hash = await hashPassword(password);
    const isValid = await comparePassword(password, hash);
    expect(isValid).toBe(true);
  });

  it('should fail for wrong password', async () => {
    const password = 'mysecretpassword';
    const hash = await hashPassword(password);
    const isValid = await comparePassword('wrongpassword', hash);
    expect(isValid).toBe(false);
  });
});
