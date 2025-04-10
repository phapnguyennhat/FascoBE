import { ClassSerializerInterceptor, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from '../env';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from 'all-exception.filter';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { ProductModule } from './module/product/product.module';
import { FirebaseStorageModule } from './module/firebase-storage/firebase-storage.module';
import { GoogleAuthModule } from './module/google-auth/google-auth.module';
import { ImageModule } from './module/image/image.module';
import { FacebookAuthModule } from './module/facebook-auth/facebook-auth.module';
import { BrandModule } from './module/brand/brand.module';
import { TagModule } from './module/tag/tag.module';
import { CartModule } from './module/cart/cart.module';
import { ProvinceModule } from './module/province/province.module';
import { DistrictModule } from './module/district/district.module';
import { CommuneModule } from './module/commune/commune.module';
import LogsMiddleware from './util/log.middleware';
import { AddressModule } from './module/address/address.module';
import { OrderModule } from './module/order/order.module';
import { FavoriteModule } from './module/favorite/favorite.module';
import { CategoryModule } from './module/category/category.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from './module/email/email.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CACHE_TTL } from './common/constant';
import { createKeyv } from '@keyv/redis';
import { HttpCacheInterceptor } from './common/http-cache.interceptor';
import { RedisModule } from './module/redis/redis.module';
import { LogModule } from './module/log/log.module';
import { SocketModule } from './module/socket/socket.module';
import { MomoModule } from './module/momo/momo.module';



@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      validationSchema: validationSchema,
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    ProductModule,
    FirebaseStorageModule,
    GoogleAuthModule,
    ImageModule,
    FacebookAuthModule,
    BrandModule,
    TagModule,
    CartModule,
    ProvinceModule,
    DistrictModule,
    CommuneModule,
    AddressModule,
    OrderModule,
    FavoriteModule,
    CategoryModule,
    ScheduleModule.forRoot(),
    EmailModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        stores: [
          createKeyv(configService.get('REDIS_CONNECT')),
        ],
        ttl: CACHE_TTL
      }),
      
      inject: [ConfigService]
    }),
    RedisModule,
    LogModule,
    SocketModule,
    MomoModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass :AllExceptionsFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
   
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: HttpCacheInterceptor
    // }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
