import { ObjectType, Field, registerEnumType } from 'type-graphql';
import { TransactionType as PrismaTransactionType } from '@prisma/client';
import { Category } from './category.model';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

registerEnumType(TransactionType, {
  name: 'TransactionType',
  description: 'Transaction type',
});

@ObjectType()
export class Transaction {
  @Field(() => String)
  id!: string;

  @Field()
  description!: string;

  @Field(() => Number)
  amount!: number;

  @Field()
  date!: string;

  @Field(() => TransactionType)
  type!: PrismaTransactionType;

  @Field(() => String)
  categoryId!: string;

  @Field(() => Category, { nullable: true })
  category?: Category;
}
