import { PrismaClient } from '@prisma/client';
import { verifyToken } from './utils/auth';
import { AuthService } from './services/auth.service';
import { CategoryService } from './services/category.service';
import { TransactionService } from './services/transaction.service';

export const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  user: { id: string } | null;
  authService: AuthService;
  categoryService: CategoryService;
  transactionService: TransactionService;
}

export function createContext(
  authService: AuthService,
  categoryService: CategoryService,
  transactionService: TransactionService
) {
  return async ({ req }: any): Promise<Context> => {
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
      authService,
      categoryService,
      transactionService,
    };
  };
}
