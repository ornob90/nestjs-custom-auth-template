import * as dotenv from 'dotenv';
dotenv.config();
import * as redisStore from 'cache-manager-redis-store';
import { CacheModuleOptions } from '@nestjs/cache-manager';

export const cacheConfig = {
  isGlobal: true,
  useFactory: async () => ({
    store: redisStore,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    // ttl: 1000,
  }),
};
