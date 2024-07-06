import * as dotenv from 'dotenv';
dotenv.config();
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

export const mysqlConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User],
  synchronize: true,
};

export default null;
