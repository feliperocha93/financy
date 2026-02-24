import { Resolver, Query, Mutation, Arg, FieldResolver, Root, Ctx } from 'type-graphql';
import { User } from '../models/user.model';
import { Category } from '../models/category.model';
import { Transaction } from '../models/transaction.model';
import { Context } from '../context';
import { GraphQLError } from 'graphql';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() context: Context) {
    if (!context.user) throw new GraphQLError('Not authenticated', { extensions: { code: 'NOT_AUTHENTICATED', http: { status: 401 } } });
    const user = await context.authService.getUserById(context.user.id);
    return user ?? null;
  }

  @Mutation(() => User)
  async updateProfile(@Arg('name') name: string, @Ctx() context: Context) {
    if (!context.user) throw new GraphQLError('Not authenticated', { extensions: { code: 'NOT_AUTHENTICATED', http: { status: 401 } } });
    return context.authService.updateUser(context.user.id, { name });
  }

  @FieldResolver(() => [Category], { nullable: true })
  async categories(@Root() parent: { id: string }, @Ctx() context: Context) {
    return context.categoryService.findManyByUserId(parent.id);
  }

  @FieldResolver(() => [Transaction], { nullable: true })
  async transactions(@Root() parent: { id: string }, @Ctx() context: Context) {
    return context.transactionService.findMany(parent.id);
  }
}
