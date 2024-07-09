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

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(mysqlConfig),
    MailerModule.forRoot(nodemailerConfig),
    JwtModule.register(jwtConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
