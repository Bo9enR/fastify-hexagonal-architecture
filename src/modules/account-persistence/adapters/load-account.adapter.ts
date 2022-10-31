import { AccountEntity } from "../../../domains/entities/account.entity";
import { LoadAccountPort } from "../../../domains/ports/out/load-account.port";
import { Model } from "mongoose";
import { AccountOrmEntity } from "../entities/account.orm-entity";
import { ActivityOrmEntity } from "../entities/activity.orm-entity";
import { AccountMapper } from "../account.mapper";

export class LoadAccountAdapter implements LoadAccountPort {
  constructor(
    private readonly _accountModel: Model<AccountOrmEntity>,
    private readonly _activityModel: Model<ActivityOrmEntity>,
  ) {
  }
  async loadAccount(accountId: string): Promise<AccountEntity> {
    const account = await this._accountModel.findOne({ userId: accountId });
    if (!account) {
      throw new Error('Account not found');
    }

    const activities = await this._activityModel.find({
      ownerAccountId: accountId,
    });

    return AccountMapper.mapToDomain(account, activities);
  }
}