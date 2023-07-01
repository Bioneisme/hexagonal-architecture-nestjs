import { Global, Module } from '@nestjs/common';
import { AccountPersistenceAdapter } from './account-persistence.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountOrmEntity } from './account.orm-entity';
import { ActivityOrmEntity } from './activity.orm-entity';
import { SendMoneyUseCaseSymbol } from '../../domains/ports/in/send-money.use-case';
import { SendMoneyService } from '../../domains/services/send-money.service';

@Global()
@Module({
  providers: [
    AccountPersistenceAdapter,
    {
      provide: SendMoneyUseCaseSymbol,
      inject: [AccountPersistenceAdapter],
      useFactory: (adapter: AccountPersistenceAdapter) => {
        return new SendMoneyService(adapter, adapter);
      },
    },
  ],
  imports: [TypeOrmModule.forFeature([AccountOrmEntity, ActivityOrmEntity])],
  exports: [SendMoneyUseCaseSymbol],
})
export class AccountPersistenceModule {}
