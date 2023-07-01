import { Injectable } from '@nestjs/common';
import { LoadAccountPort } from '../../domains/ports/out/load-account.port';
import { UpdateAccountStatePort } from '../../domains/ports/out/update-account-state.port';
import {
  AccountEntity,
  AccountId,
} from '../../domains/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountOrmEntity } from './account.orm-entity';
import { ActivityOrmEntity } from './activity.orm-entity';
import { AccountMapper } from './account.mapper';

@Injectable()
export class AccountPersistenceAdapter
  implements LoadAccountPort, UpdateAccountStatePort
{
  constructor(
    @InjectRepository(AccountOrmEntity)
    private readonly _accountRepository: Repository<AccountOrmEntity>,
    @InjectRepository(ActivityOrmEntity)
    private readonly _activityRepository: Repository<ActivityOrmEntity>,
  ) {}
  async loadAccount(accountId: AccountId): Promise<AccountEntity> {
    const account = await this._accountRepository.findOne({
      where: { userId: accountId },
    });

    if (!account) {
      throw new Error('Account not found'); // TODO: Make it without throwing error
    }

    const activities = await this._activityRepository.find({
      where: { ownerAccountId: accountId },
    });
    return AccountMapper.mapToDomain(account, activities);
  }

  async updateActivities(account: AccountEntity) {
    for (const activity of account.activityWindow.activities) {
      if (activity.id === null) {
        await this._activityRepository.save(
          AccountMapper.mapToActivityOrmEntity(activity),
        );
      }
    }
  }
}
