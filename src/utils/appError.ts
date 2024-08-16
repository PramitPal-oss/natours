import { NextFunction, Request, Response } from 'express';
import { CustomError, ErrorInterface } from '../interface/ToursInterface';
import { STATUS } from './helper';

export const globalErrorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  res.status(err.statusCode || 500).json({
    status: err.status || STATUS.failed,
    message: err.message,
    errors: err.errors || [],
  });
};

class AppError extends Error {
  statusCode: number;

  errors?: ErrorInterface[] | [];

  status: string;

  constructor(message: string, statusCode: number, errors?: ErrorInterface[] | []) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? STATUS.failed : STATUS.success;
    this.errors = errors;
  }
}

export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction): Promise<any> | void => {
    fn(req, res, next).catch(next);
  };
};

export default AppError;
