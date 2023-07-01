import { mock, when, anything, anyString, instance } from 'ts-mockito';
import { LoadAccountPort } from '../ports/out/load-account.port';
import { UpdateAccountStatePort } from '../ports/out/update-account-state.port';
import { AccountEntity, AccountId } from '../entities/account.entity';
import { SendMoneyCommand } from '../ports/in/send-money.command';
import { MoneyEntity } from '../entities/money.entity';
import { SendMoneyService } from './send-money.service';

describe('SendMoneyService', () => {
  it('should transaction success', async () => {
    const loadAccountPort = mock<LoadAccountPort>();
    const updateAccountStatePort = mock<UpdateAccountStatePort>();

    function givenSourceAccountWithId(accountId: AccountId) {
      const mockedAccountEntity = mock(AccountEntity);
      when(mockedAccountEntity.id).thenReturn(accountId);
      when(mockedAccountEntity.withdraw(anything(), anyString())).thenReturn(
        true,
      );
      when(mockedAccountEntity.deposit(anything(), anyString())).thenReturn(
        true,
      );
      const account = instance(mockedAccountEntity);
      when(loadAccountPort.loadAccount(accountId)).thenReturn(
        Promise.resolve(account),
      );
      return account;
    }

    const sourceAccount = givenSourceAccountWithId('1');
    const targetAccount = givenSourceAccountWithId('2');

    const command = new SendMoneyCommand(
      sourceAccount.id,
      targetAccount.id,
      MoneyEntity.of(100),
    );

    const sendMoneyService = new SendMoneyService(
      instance(updateAccountStatePort),
      instance(loadAccountPort),
    );

    const result = sendMoneyService.sendMoney(command);
    expect(result).toBeTruthy();
  });
});
