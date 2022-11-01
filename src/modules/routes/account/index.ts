import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { GetAccountBalanceService } from "../../../domains/services/get-account-balance.service";
import { LoadAccountAdapter } from "../../account-persistence/adapters/load-account.adapter";
import { models } from "mongoose";
import { SendMoneyCommand } from "../../../domains/ports/in/send-money.command";
import { MoneyEntity } from "../../../domains/entities/money.entity";
import { SendMoneyService } from "../../../domains/services/send-money.service";
import { UpdateAccountActivitiesAdapter } from "../../account-persistence/adapters/update-account-activities.adapter";

type GetBalanceRequest = FastifyRequest<{
  Querystring: { accountId: string }
}>;

type SendMoneyRequest = FastifyRequest<{
  Querystring: {
    sourceAccountId: string,
    targetAccountId: string,
    amount: number,
  }
}>;

const account: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  fastify.get('/balance', {
    schema: {
      querystring: {
        accountId: { type: 'string' },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            _amount: { type: 'string' },
          }
        }
      }
    }
  }, async function (req: GetBalanceRequest, reply) {
    const loadAccountAdapter = new LoadAccountAdapter(models.Account, models.Activity);
    const getAccountBalanceQuery = new GetAccountBalanceService(loadAccountAdapter);
  
    const result = await getAccountBalanceQuery.getAccountBalance(req.query.accountId);
    return result;
  });

  fastify.get('/send', {
    schema: {
      querystring: {
        sourceAccountId: { type: 'string' },
        targetAccountId: { type: 'string' },
        amount: { type: 'number' },
      },
      response: {
        200: {
          type: 'boolean',
        }
      }
    }
  }, async function (req: SendMoneyRequest, reply) {
    const command = new SendMoneyCommand(
      req.query.sourceAccountId,
      req.query.targetAccountId,
      MoneyEntity.of(req.query.amount)
    );

    const loadAccountAdapter = new LoadAccountAdapter(models.Account, models.Activity);
    const updateAccountActivitiesAdapter = new UpdateAccountActivitiesAdapter(models.Activity);
    const sendMoneyUseCase = new SendMoneyService(loadAccountAdapter, updateAccountActivitiesAdapter);

    const result = await sendMoneyUseCase.sendMoney(command);
    return result;
  });
}

export default account;