import { Module } from '@nestjs/common';
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

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(mysqlConfig),
    MailerModule.forRoot(nodemailerConfig),
    JwtModule.register(jwtConfig),
    CacheModule.register<RedisClientOptions>(cacheConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
