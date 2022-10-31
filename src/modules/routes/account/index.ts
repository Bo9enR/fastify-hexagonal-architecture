import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { GetAccountBalanceService } from "../../../domains/services/get-account-balance.service";
import { LoadAccountAdapter } from "../../account-persistence/adapters/load-account.adapter";
import { models } from "mongoose";

type GetBalanceRequest = FastifyRequest<{
  Querystring: { accountId: string }
}>

const getAccountBalance: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

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
  })
}

export default getAccountBalance;