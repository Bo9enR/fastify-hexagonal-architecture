import { FastifyPluginAsync, FastifyRequest } from "fastify";

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
            _id: { type: 'string' },
            userId: { type: 'string' }
          }
        }
      }
    }
  }, async function (req: GetBalanceRequest, reply) {
    const accounts = this.mongo.db?.collection('accounts')
    return await accounts?.findOne({ userId: req.query.accountId })
  })
}

export default getAccountBalance;