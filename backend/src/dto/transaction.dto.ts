import { InputType, Field } from 'type-graphql';
import { TransactionType } from '../models/transaction.model';

@InputType()
export class CreateTransactionInput {
  @Field()
  description!: string;

  @Field(() => Number)
  amount!: number;

  @Field()
  date!: string;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => String)
  categoryId!: string;
}

@InputType()
export class UpdateTransactionInput {
  @Field({ nullable: true })
  description?: string;

  @Field(() => Number, { nullable: true })
  amount?: number;

  @Field({ nullable: true })
  date?: string;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => String, { nullable: true })
  categoryId?: string;
}
