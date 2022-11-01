import { Model, Types as MongooseTypes } from "mongoose";
import { AccountEntity } from "../../../domains/entities/account.entity";
import { UpdateAccountStatePort } from "../../../domains/ports/out/update-account-state.port";
import { AccountMapper } from "../account.mapper";
import { ActivityOrmEntity } from "../entities/activity.orm-entity";

export class UpdateAccountActivitiesAdapter implements UpdateAccountStatePort {
  constructor(
    private readonly _activityModel: Model<ActivityOrmEntity>,
  ) {}

  async updateActivities(account: AccountEntity): Promise<void> {
    account.activityWindow.activities.forEach((activity) => {
      if (!activity.id) {
        this._activityModel.create({
          _id: new MongooseTypes.ObjectId(),
          ...AccountMapper.mapToActivityOrmEntity(activity),
        });
      } else {
        this._activityModel.findOneAndUpdate(
          { _id: activity.id },
          AccountMapper.mapToActivityOrmEntity(activity),
        );
      }
    }); 
  }
}