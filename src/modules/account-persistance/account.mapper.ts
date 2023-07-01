import { AccountOrmEntity } from './account.orm-entity';
import { ActivityOrmEntity } from './activity.orm-entity';
import { AccountEntity } from '../../domains/entities/account.entity';
import { ActivityWindowEntity } from '../../domains/entities/activity-window.entity';
import { ActivityEntity } from '../../domains/entities/activity.entity';
import { MoneyEntity } from '../../domains/entities/money.entity';

export class AccountMapper {
  static mapToDomain(
    account: AccountOrmEntity,
    activities: ActivityOrmEntity[],
  ): AccountEntity {
    const activityWindowEntity = this.mapToActivityWindow(activities);
    const balance = activityWindowEntity.calculateBalance(account.userId);
    return new AccountEntity(account.userId, balance, activityWindowEntity);
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
        activity.id,
      );
      activityWindowEntity.addActivity(activityEntity);
    });
    return activityWindowEntity;
  }

  static mapToActivityOrmEntity(activity: ActivityEntity): ActivityOrmEntity {
    const activityOrmEntity = new ActivityOrmEntity();
    activityOrmEntity.amount = activity.money.amount.toNumber();
    activityOrmEntity.ownerAccountId = activity.ownerAccountId;
    activityOrmEntity.sourceAccountId = activity.sourceAccountId;
    activityOrmEntity.targetAccountId = activity.targetAccountId;
    activityOrmEntity.timestamp = activity.timestamp.getTime();
    if (activity.id) {
      activityOrmEntity.id = activity.id;
    }
    return activityOrmEntity;
  }
}
