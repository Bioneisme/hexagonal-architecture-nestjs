import { ActivityEntity } from './activity.entity';
import { AccountId } from './account.entity';
import { MoneyEntity } from './money.entity';

export class ActivityWindowEntity {
  private readonly _activities: ActivityEntity[] = [];
  get activities() {
    return this._activities;
  }

  addActivity(activity) {
    this.activities.push(activity);
    return this;
  }

  public calculateBalance(accountId: AccountId): MoneyEntity {
    const depositBalance = this.activities
      .filter((activity) => activity.targetAccountId === accountId)
      .map((activity) => activity.money)
      .reduce(MoneyEntity.add, MoneyEntity.ZERO());

    const withdrawalBalance = this.activities
      .filter((activity) => activity.sourceAccountId === accountId)
      .map((activity) => activity.money)
      .reduce(MoneyEntity.add, MoneyEntity.ZERO());

    return MoneyEntity.add(depositBalance, withdrawalBalance.negate());
  }

  findActivitiesSince(date) {
    return this._activities.filter((activity) => activity.timestamp >= date);
  }
}
