import { ValidationError, validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { plainToInstance } from 'class-transformer';
import { ErrorInterface } from '../interface/ToursInterface';
import AppError from './appError';

const STATUS: { success: 'SUCCESS'; failed: 'FAILED' } = { success: 'SUCCESS', failed: 'FAILED' };

const constructResponse = (res: Response, message: string, type?: string, resData?: unknown): Response<any, Record<string, any>> => {
  return res.status(200).json({
    status: STATUS.success,
    message,
    data: {
      [type || 'response']: resData,
    },
  });
};

const extractErrors = (errors: ValidationError[]): ErrorInterface[] | [] => {
  const result: ErrorInterface[] = [];

  const traverse = (error: ValidationError): void => {
    if (error.constraints) {
      result.push({
        property: error.property,
        constraints: error.constraints,
      });
    }
    if (error.children) {
      error.children.forEach((child: ValidationError) => traverse(child));
    }
  };

  errors.forEach((error: ValidationError) => traverse(error));
  return result;
};

type DTOClass<T> = new () => T;

const validateDTO = <T extends object>(dtoClass: DTOClass<T>, type: 'query' | 'body', group?: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dtoInstance: T = plainToInstance(dtoClass, req?.[type]);
    const errors: ValidationError[] = await validate(dtoInstance, {
      whitelist: true,
      forbidNonWhitelisted: true,
      groups: group ? [group] : [],
    });

    if (errors.length > 0) {
      return next(new AppError('Validation Failed', 400, extractErrors(errors)));
    }

    next();
  };
};

const Signintoken = (id: number): string =>
  jwt.sign({ id }, process.env.JWT_SECREAT!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });

const requiredField: string[] = [
  'asc-price',
  'dsc-rating',
  'dsc-price',
  'dsc-duration',
  'asc-duration',
  'asc-maxGroupSize',
  'dsc-maxGroupSize',
  'asc-ratingsQuantity',
  'dsc-ratingsQuantity',
  'asc-ratingsAverage',
  'dsc-ratingsAverage',
  'asc-priceDiscount',
  'dsc-priceDiscount',
];

const fields: string[] = ['TOUR_NAME', 'price', 'rating', 'duration', 'difficulty', 'Images', 'Dates'];

export { constructResponse, extractErrors, Signintoken, STATUS, requiredField, fields, validateDTO };
