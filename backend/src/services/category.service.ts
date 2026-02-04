import { PrismaClient } from '@prisma/client';
import { CreateCategoryInput, UpdateCategoryInput } from '../dto/category.dto';

export class CategoryService {
  constructor(private readonly prisma: PrismaClient) {}

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
    if (!category) throw new Error('Category not found or access denied');
    return this.prisma.category.update({
      where: { id },
      data: input,
    });
  }

  async delete(id: string, userId: string): Promise<boolean> {
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
