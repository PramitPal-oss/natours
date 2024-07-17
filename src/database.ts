import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import Tours from './Entites/Tours';
import Dates from './Entites/Date';
import Images from './Entites/Image';

dotenv.config({ path: './.env' });

const AppdataSource: DataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: 'natours',
  //logging: true,
  synchronize: true,
  entities: [Tours, Dates, Images],
});

export default AppdataSource;
