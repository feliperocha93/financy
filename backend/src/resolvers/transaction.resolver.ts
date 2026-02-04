import { Resolver, Query, Mutation, Arg, FieldResolver, Root, Ctx } from 'type-graphql';
import { Transaction } from '../models/transaction.model';
import { Category } from '../models/category.model';
import { CreateTransactionInput, UpdateTransactionInput } from '../dto/transaction.dto';
import { Context } from '../context';

@Resolver(() => Transaction)
export class TransactionResolver {
  @Query(() => [Transaction])
  async transactions(@Ctx() context: Context) {
    if (!context.user) throw new Error('Not authenticated');
    return context.transactionService.findMany(context.user.id);
  }

  @Mutation(() => Transaction)
  async createTransaction(
    @Arg('data') data: CreateTransactionInput,
    @Ctx() context: Context
  ) {
    if (!context.user) throw new Error('Not authenticated');
    return context.transactionService.create(context.user.id, data);
  }

  @Mutation(() => Transaction)
  async updateTransaction(
    @Arg('id') id: string,
    @Arg('data') data: UpdateTransactionInput,
    @Ctx() context: Context
  ) {
    if (!context.user) throw new Error('Not authenticated');
    return context.transactionService.update(id, context.user.id, data);
  }

  @Mutation(() => Boolean)
  async deleteTransaction(@Arg('id') id: string, @Ctx() context: Context) {
    if (!context.user) throw new Error('Not authenticated');
    return context.transactionService.delete(id, context.user.id);
  }

  @FieldResolver(() => String)
  date(@Root() parent: { date: Date | string }) {
    if (typeof parent.date === 'string') return parent.date;
    return (parent.date as Date).toISOString();
  }

  @FieldResolver(() => Category, { nullable: true })
  async category(@Root() parent: { categoryId: string }, @Ctx() context: Context) {
    return context.transactionService.findCategoryById(parent.categoryId);
  }
}
