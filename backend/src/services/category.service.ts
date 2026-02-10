import { PrismaClient } from '@prisma/client';
import { CreateCategoryInput, UpdateCategoryInput } from '../dto/category.dto';
import { ERROR_MESSAGE, NOT_FOUND_ERROR } from '../errors';

export class CategoryService {
  constructor(private readonly prisma: PrismaClient) { }

  async create(userId: string, input: CreateCategoryInput) {
    return this.prisma.category.create({
      data: {
        ...input,
        userId,
      },
    });
  }

  async update(id: string, userId: string, input: UpdateCategoryInput) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
    });
    if (!category) throw NOT_FOUND_ERROR;
    return this.prisma.category.update({
      where: { id },
      data: input,
    });
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
    });
    if (!category) throw NOT_FOUND_ERROR;

    const transactionCount = await this.prisma.transaction.count({
      where: { categoryId: id, userId },
    });
    if (transactionCount > 0) {
      throw ERROR_MESSAGE(
        `Cannot delete category: it has ${transactionCount} transaction(s). Reassign or remove them first.`
        , 'CATEGORY_HAS_TRANSACTIONS', 400);
    }

    const { count } = await this.prisma.category.deleteMany({
      where: { id, userId },
    });
    return count > 0;
  }

  async findMany(userId: string) {
    return this.prisma.category.findMany({ where: { userId } });
  }

  async findById(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async findManyByUserId(userId: string) {
    return this.prisma.category.findMany({ where: { userId } });
  }
}
