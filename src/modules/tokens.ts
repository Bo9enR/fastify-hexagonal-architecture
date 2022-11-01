import { Container, token } from 'brandi';
import { models } from "mongoose";
import { GetAccountBalanceService } from '../domains/services/get-account-balance.service';
import { SendMoneyService } from '../domains/services/send-money.service';
import { LoadAccountAdapter } from './account-persistence/adapters/load-account.adapter';
import { UpdateAccountActivitiesAdapter } from './account-persistence/adapters/update-account-activities.adapter';

export const TOKENS = {
  loadAccountAdapter: token<LoadAccountAdapter>('loadAccountAdapter'),
  updateAccountActivitiesAdapter: token<UpdateAccountActivitiesAdapter>('updateAccountActivitiesAdapter'),
  getAccountBalanceQuery: token<GetAccountBalanceService>('getAccountBalanceQuery'),
  sendMoneyUseCase: token<SendMoneyService>('sendMoneyUseCase'),
}

export const container = new Container();

container
  .bind(TOKENS.loadAccountAdapter)
  .toInstance(() => new LoadAccountAdapter(models.Account, models.Activity))
  .inSingletonScope();

container
  .bind(TOKENS.updateAccountActivitiesAdapter)
  .toInstance(() => new UpdateAccountActivitiesAdapter(models.Activity))
  .inSingletonScope();

container
  .bind(TOKENS.getAccountBalanceQuery)
  .toInstance(() => new GetAccountBalanceService(container.get(TOKENS.loadAccountAdapter)))
  .inSingletonScope();

container
  .bind(TOKENS.sendMoneyUseCase)
  .toInstance(() => new SendMoneyService(container.get(TOKENS.loadAccountAdapter), container.get(TOKENS.updateAccountActivitiesAdapter)))
  .inSingletonScope();