import { AuthResolver } from './auth.resolver';
import { UserResolver } from './user.resolver';
import { CategoryResolver } from './category.resolver';
import { TransactionResolver } from './transaction.resolver';

export const resolvers = [
  AuthResolver,
  UserResolver,
  CategoryResolver,
  TransactionResolver,
] as const;