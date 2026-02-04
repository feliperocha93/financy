import { PrismaClient } from '@prisma/client';
import { verifyToken } from './utils/auth';

export const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  user: { id: string } | null;
}

export const context = async ({ req }: any): Promise<Context> => {
  const token = req.headers.authorization || '';
  let user = null;

  if (token) {
    const bearer = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = verifyToken(bearer);
    if (decoded) {
      user = { id: decoded.userId };
    }
  }

  return {
    prisma,
    user,
  };
};
