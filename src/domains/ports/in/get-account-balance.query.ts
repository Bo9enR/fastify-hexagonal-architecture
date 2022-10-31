import { AccountId } from '../../entities/account.entity';
import { MoneyEntity } from '../../entities/money.entity';

export const GetAccountBalanceQuerySymbol = Symbol('GetAccountBalanceQuery');

export interface GetAccountBalanceQuery {
  getAccountBalance(accountId: AccountId): Promise<MoneyEntity>;
}
