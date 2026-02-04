import { Context } from '../context';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

export const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: Context) => {
      if (!context.user) throw new Error('Not authenticated');
      return context.prisma.user.findUnique({ where: { id: context.user.id } });
    },
    transactions: async (_parent: any, _args: any, context: Context) => {
      if (!context.user) throw new Error('Not authenticated');
      return context.prisma.transaction.findMany({ where: { userId: context.user.id } });
    },
    categories: async (_parent: any, _args: any, context: Context) => {
      if (!context.user) throw new Error('Not authenticated');
      return context.prisma.category.findMany({ where: { userId: context.user.id } });
    },
  },
  Mutation: {
    signup: async (_parent: any, args: any, context: Context) => {
      const hashedPassword = await hashPassword(args.password);
      const user = await context.prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });
      const token = generateToken(user.id);
      return { token, user };
    },
    login: async (_parent: any, args: any, context: Context) => {
      const user = await context.prisma.user.findUnique({ where: { email: args.email } });
      if (!user) throw new Error('Invalid credentials');
      const valid = await comparePassword(args.password, user.password);
      if (!valid) throw new Error('Invalid credentials');
      const token = generateToken(user.id);
      return { token, user };
    },
    createCategory: async (_parent: any, args: any, context: Context) => {
      if (!context.user) throw new Error('Not authenticated');
      return context.prisma.category.create({
        data: {
          ...args.input,
          userId: context.user.id,
        },
      });
    },
    updateCategory: async (_parent: any, args: any, context: Context) => {
      if (!context.user) throw new Error('Not authenticated');
      const category = await context.prisma.category.findFirst({
        where: { id: args.id, userId: context.user.id },
      });
      if (!category) throw new Error('Category not found or access denied');
      return context.prisma.category.update({
        where: { id: args.id },
        data: args.input,
      });
    },
    deleteCategory: async (_parent: any, args: any, context: Context) => {
      if (!context.user) throw new Error('Not authenticated');
      const { count } = await context.prisma.category.deleteMany({
        where: { id: args.id, userId: context.user.id },
      });
      return count > 0;
    },
    createTransaction: async (_parent: any, args: any, context: Context) => {
      if (!context.user) throw new Error('Not authenticated');
      // Ensure the category belongs to the user
      const category = await context.prisma.category.findFirst({
          where: { id: args.input.categoryId, userId: context.user.id }
      });
      if (!category) throw new Error('Category not found or access denied');

      return context.prisma.transaction.create({
        data: {
          ...args.input,
          userId: context.user.id,
        },
      });
    },
    updateTransaction: async (_parent: any, args: any, context: Context) => {
      if (!context.user) throw new Error('Not authenticated');
      const transaction = await context.prisma.transaction.findFirst({
        where: { id: args.id, userId: context.user.id },
      });
      if (!transaction) throw new Error('Transaction not found or access denied');
      return context.prisma.transaction.update({
        where: { id: args.id },
        data: args.input,
      });
    },
    deleteTransaction: async (_parent: any, args: any, context: Context) => {
      if (!context.user) throw new Error('Not authenticated');
      const { count } = await context.prisma.transaction.deleteMany({
        where: { id: args.id, userId: context.user.id },
      });
      return count > 0;
    },
  },
  User: {
    categories: (parent: any, _args: any, context: Context) => {
      return context.prisma.category.findMany({ where: { userId: parent.id } });
    },
    transactions: (parent: any, _args: any, context: Context) => {
      return context.prisma.transaction.findMany({ where: { userId: parent.id } });
    },
  },
  Category: {
    transactions: (parent: any, _args: any, context: Context) => {
      return context.prisma.transaction.findMany({ where: { categoryId: parent.id } });
    },
  },
  Transaction: {
    category: (parent: any, _args: any, context: Context) => {
      return context.prisma.category.findUnique({ where: { id: parent.categoryId } });
    },
  },
};
