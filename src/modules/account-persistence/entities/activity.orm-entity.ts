import { Schema, model, models } from 'mongoose';

export interface ActivityOrmEntity {
  _id?: string;
  timestamp: Date;
  ownerAccountId: string;
  sourceAccountId: string;
  targetAccountId: string;
  amount: number;
}

export const activityOrmSchema = new Schema<ActivityOrmEntity>({
  _id: { type: Schema.Types.ObjectId },
  timestamp: { type: Date, required: true },
  ownerAccountId: { type: String, required: true },
  sourceAccountId: { type: String, required: true },
  targetAccountId: { type: String, required: true },
  amount: { type: Number, required: true },
});

export const activityModel = models.Activity || model<ActivityOrmEntity>('Activity', activityOrmSchema);