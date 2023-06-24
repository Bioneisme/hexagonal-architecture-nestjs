import { AccountId } from '../../entities/account.entity';

export interface LoadAccountPort {
  loadAccount(accountId: AccountId);
}
