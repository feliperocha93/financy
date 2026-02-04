import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const APP_SECRET = process.env.JWT_SECRET as Secret;

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, APP_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, APP_SECRET) as { userId: string };
  } catch (e) {
    return null;
  }
};
