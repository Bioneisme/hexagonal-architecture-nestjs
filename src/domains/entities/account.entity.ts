import { ActivityWindowEntity } from './activity-window.entity';
import { MoneyEntity } from './money.entity';
import { ActivityEntity } from './activity.entity';

export type AccountId = string;

export class AccountEntity {
  constructor(
    private readonly _id: AccountId,
    private readonly _baseLineBalance: MoneyEntity,
    private readonly _activityWindow: ActivityWindowEntity,
  ) {}

  get id(): AccountId {
    return this._id;
  }

  get baseLineBalance(): MoneyEntity {
    return this._baseLineBalance;
  }

  get activityWindow(): ActivityWindowEntity {
    return this._activityWindow;
  }

  public calculateBalance(): MoneyEntity {
    return MoneyEntity.add(
      this.baseLineBalance,
      this.activityWindow.calculateBalance(this.id),
    );
  }

  private canWithdraw(money: MoneyEntity): boolean {
    return this.calculateBalance().amount.isGreaterThanOrEqualTo(money.amount);
  }

  public withdraw(money: MoneyEntity, targetAccountId: AccountId): boolean {
    if (!this.canWithdraw(money)) {
      return false;
    }
    const withdrawal = new ActivityEntity(
      this.id,
      this.id,
      targetAccountId,
      new Date(),
      money,
    );
    this.activityWindow.addActivity(withdrawal);
    return true;
  }

  public deposit(money: MoneyEntity, sourceAccountId: AccountId): boolean {
    const deposit = new ActivityEntity(
      this.id,
      sourceAccountId,
      this.id,
      new Date(),
      money,
    );
    this.activityWindow.addActivity(deposit);
    return true;
  }
}
