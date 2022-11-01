import { FastifyPluginAsync, FastifyRequest } from "fastify";
import { SendMoneyCommand } from "../../../domains/ports/in/send-money.command";
import { MoneyEntity } from "../../../domains/entities/money.entity";
import { container, TOKENS } from "../../tokens";

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
    const getAccountBalanceQuery = container.get(TOKENS.getAccountBalanceQuery);
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

    const sendMoneyUseCase = container.get(TOKENS.sendMoneyUseCase);

    const result = await sendMoneyUseCase.sendMoney(command);
    return result;
  });
}

export default account;