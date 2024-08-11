import express, { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import AppdataSource from './database';
import { UserRouter, tourRouter } from './routes/toursRoute';

dotenv.config({ path: './.env' });

const app: Express = express();

app.use(helmet());

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

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', UserRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  return res.status(400).json({
    status: false,
    message: `${req.url} is not exists`,
  });
});

const PORT: number = Number(process.env.LOCALHOST_PORT) || 8000;

app.listen(PORT, () => {
  console.log('server is running adn Database is connected');
});

export default app;
