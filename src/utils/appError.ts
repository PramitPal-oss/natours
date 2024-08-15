import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../interface/ToursInterface';
import { STATUS } from './toursutils';

export const globalErrorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

class AppError extends Error {
  statusCode: number;

  status: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? STATUS.failed : STATUS.success;
  }
}

export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction): Promise<any> | void => {
    fn(req, res, next).catch(next);
  };
};

export default AppError;
