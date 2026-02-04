import { PrismaClient } from '@prisma/client';
import { CreateTransactionInput } from '../dto/transaction.dto';
import { UpdateTransactionInput } from '../dto/transaction.dto';

export class TransactionService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(userId: string, input: CreateTransactionInput) {
    const category = await this.prisma.category.findFirst({
      where: { id: input.categoryId, userId },
    });
    if (!category) throw new Error('Category not found or access denied');

    return this.prisma.transaction.create({
      data: {
        description: input.description,
        amount: input.amount,
        date: new Date(input.date),
        type: input.type,
        categoryId: input.categoryId,
        userId,
      },
    });
  }

  async update(id: string, userId: string, input: UpdateTransactionInput) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });
    if (!transaction) throw new Error('Transaction not found or access denied');

    const data: {
      description?: string;
      amount?: number;
      date?: Date;
      type?: 'INCOME' | 'EXPENSE';
      categoryId?: string;
    } = {};

    if (input.description !== undefined) data.description = input.description;
    if (input.amount !== undefined) data.amount = input.amount;
    if (input.date !== undefined) data.date = new Date(input.date);
    if (input.type !== undefined) data.type = input.type;
    if (input.categoryId !== undefined) {
      const category = await this.prisma.category.findFirst({
        where: { id: input.categoryId, userId },
      });
      if (!category) throw new Error('Category not found or access denied');
      data.categoryId = input.categoryId;
    }

    return this.prisma.transaction.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const { count } = await this.prisma.transaction.deleteMany({
      where: { id, userId },
    });
    return count > 0;
  }

  async findMany(userId: string) {
    return this.prisma.transaction.findMany({ where: { userId } });
  }

  async findManyByCategoryId(categoryId: string) {
    return this.prisma.transaction.findMany({ where: { categoryId } });
  }

  async findCategoryById(categoryId: string) {
    return this.prisma.category.findUnique({ where: { id: categoryId } });
  }
}
