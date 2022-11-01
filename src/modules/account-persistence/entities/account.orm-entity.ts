import { Schema, model, models, Types } from 'mongoose';

export interface AccountOrmEntity {
  _id?: Types.ObjectId;
  userId: string;
}

export const accountOrmSchema = new Schema<AccountOrmEntity>({
  _id: { type: Schema.Types.ObjectId },
  userId: { type: String, required: true },
});

export const accountModel = models.Account || model<AccountOrmEntity>('Account', accountOrmSchema);