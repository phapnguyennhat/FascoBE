
import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';

@Global()
@Module({
  controllers: [],
  providers: [{
    provide: 'REDIS_MANAGER',
    useFactory: () => (new Redis(process.env.REDIS_CONNECT)),
  }],
  exports: ['REDIS_MANAGER']
})
export class RedisModule {}
