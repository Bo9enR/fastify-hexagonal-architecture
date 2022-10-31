import { AccountEntity } from '../../domains/entities/account.entity';
import { ActivityWindowEntity } from '../../domains/entities/activity-window.entity';
import { ActivityEntity } from '../../domains/entities/activity.entity';
import { MoneyEntity } from '../../domains/entities/money.entity';
import { AccountOrmEntity } from './entities/account.orm-entity';
import { ActivityOrmEntity } from './entities/activity.orm-entity';

export class AccountMapper {
  static mapToDomain(
    account: AccountOrmEntity,
    activities: ActivityOrmEntity[],
  ): AccountEntity {
    const activityWindow = this.mapToActivityWindow(activities);
    const balance = activityWindow.calculateBalance(account.userId);

    return new AccountEntity(account.userId, balance, activityWindow);
  }

  static mapToActivityWindow(
    activities: ActivityOrmEntity[],
  ): ActivityWindowEntity {
    const activityWindowEntity = new ActivityWindowEntity();

    activities.forEach((activity) => {
      const activityEntity = new ActivityEntity(
        activity.ownerAccountId,
        activity.sourceAccountId,
        activity.targetAccountId,
        new Date(activity.timestamp),
        MoneyEntity.of(activity.amount),
        activity._id,
      );

      activityWindowEntity.addActivity(activityEntity);
    });

    return activityWindowEntity;
  }

  static mapToActivityOrmEntity(activity: ActivityEntity): ActivityOrmEntity {
    const activityOrmEntity: ActivityOrmEntity = {
      timestamp: activity.timestamp,
      ownerAccountId: activity.ownerAccountId,
      sourceAccountId: activity.sourceAccountId,
      targetAccountId: activity.targetAccountId,
      amount: activity.money.amount.toNumber(),
    };
    if (activity.id !== null) {
      activityOrmEntity._id = activity.id;
    }
    return activityOrmEntity;
  }
}
