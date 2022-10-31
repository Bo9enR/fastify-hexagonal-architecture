import fp from "fastify-plugin";
import mongodb, { FastifyMongodbOptions } from '@fastify/mongodb'

export default fp<FastifyMongodbOptions>(async (fastify) => {
  fastify.register(mongodb, {
    forceClose: true,
    url: 'mongodb://localhost/nest-hexagonal'
  })
})