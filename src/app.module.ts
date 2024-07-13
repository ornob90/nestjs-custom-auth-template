import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mysqlConfig } from './config/database.config';
import { DataSource } from 'typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { nodemailerConfig } from './config/nodemailer.config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './config/jwt.config';
import { CacheModule } from '@nestjs/cache-manager';
import { cacheConfig } from './config/cache.config';
import type { RedisClientOptions } from 'redis';
import { UserModule } from './user/user.module';
import * as redisStore from 'cache-manager-redis-store';

import * as dotenv from 'dotenv';
import { VerifyMiddleware } from './middlewares/verfiy.middleware';
dotenv.config();

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(mysqlConfig),
    MailerModule.forRoot(nodemailerConfig),
    JwtModule.register(jwtConfig),
    // CacheModule.register<RedisClientOptions>(cacheConfig),
    CacheModule.register(cacheConfig),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyMiddleware).forRoutes('user/:id');
  }
}
