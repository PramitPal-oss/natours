import express, { Express, Request, Response } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import AppdataSource from './database';
import { getAllTours, topFiveCheapTours, tourStats } from './controller/Tours/gettoursController';
import CreateTours from './controller/Tours/toursController';

dotenv.config({ path: './.env' });

const app: Express = express();

app.use(express.json());

app.use(morgan('dev'));

AppdataSource.initialize()
  .then(() => {
    console.log('DataSource Connected Successfully! 😀');
  })
  .catch((err: Error) => {
    console.log('Error during Data Source initialization', err.message);
  });

app.get('/', (_req: Request, res: Response) => {
  res.send('Hellow From Server');
});

app.get('/api/v1/tours', getAllTours);

app.get('/api/v1/top-5-cheap', topFiveCheapTours);

app.get('/api/v1/tours-stats', tourStats);

app.post('/api/v1/tours', CreateTours);

const PORT: number = Number(process.env.LOCALHOST_PORT) || 8000;

app.listen(PORT, () => {
  console.log('server is running adn Database is connected');
});

export default app;
