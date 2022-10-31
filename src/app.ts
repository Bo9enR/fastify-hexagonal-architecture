import { join } from 'path';
import AutoLoad, {AutoloadPluginOptions} from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';
import { connect } from 'mongoose';

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;


// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
}

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {

  await connect('mongodb://localhost/nest-hexagonal');

  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'modules'),
    options: opts
  })

};

export default app;
export { app, options }
