import express, { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { IncomingMessage, Server, ServerResponse } from 'http';
import AppdataSource from './database';
import UserRouter from './routes/UserRoute';
import tourRouter from './routes/toursRoute';
import AppError, { globalErrorHandler } from './utils/appError';

dotenv.config({ path: './.env' });

process.on('uncaughtException', (err: Error) => {
  console.log('UNHANDLED EXCEPTION! 💥 Shutting Down!..', err.name, err.message);
  process.exit(1);
});

const app: Express = express();

app.use(helmet());

app.use(express.json());

app.use(morgan('dev'));

AppdataSource.initialize()
  .then(() => {
    console.log('DataSource Connected Successfully! 😀');
  })
  .catch((err: Error) => {
    console.log('Error during Data Source initialization 😢', err.message);
  });

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', UserRouter);

// Error Handler for wrong Route
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const PORT: number = Number(process.env.LOCALHOST_PORT!);

const server: Server<typeof IncomingMessage, typeof ServerResponse> = app.listen(PORT, () => {
  console.log(`server is running at port http://127.0.0.1:${process.env.LOCALHOST_PORT!} 🟢`);
});

/*Unhandled Rejection Events for Async*/
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting Down!..', err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

export default app;
