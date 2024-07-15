/** @format */

import { DataSource } from 'typeorm';
import Tours from './Entites/Tours';
import Dates from './Entites/Date';

const AppdataSource: DataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'pramit@123',
  database: 'natours',
  //logging: true,
  synchronize: true,
  entities: [Tours, Dates],
});

export default AppdataSource;
