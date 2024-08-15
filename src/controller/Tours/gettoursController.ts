import { NextFunction, Request, Response } from 'express';
import { Repository, SelectQueryBuilder } from 'typeorm';
import Tours from '../../Entites/Tours';
import AppdataSource from '../../database';
import { createFieldsObj, createOrderObj, createWherObject } from '../../utils/toursutils';
import AppError, { catchAsync } from '../../utils/appError';
import { catchAsyncInterface } from '../../interface/ToursInterface';

const getAllTours: catchAsyncInterface = catchAsync(async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  const ToursRepo: Repository<Tours> = AppdataSource.getRepository(Tours);

  const tours: Tours[] = await ToursRepo.find({
    where: createWherObject(req),
    order: createOrderObj(req),
    select: createFieldsObj(req),
    take: 3,
    skip: req?.query?.page ? (+req.query.page - 1) * 3 : 0,
    relations: {
      Dates: createFieldsObj(req) ? Object.keys(createFieldsObj(req)!).includes('Dates') : false,
      Images: createFieldsObj(req) ? Object.keys(createFieldsObj(req)!).includes('Images') : false,
    },
  });

  return res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

const topFiveCheapTours: catchAsyncInterface = catchAsync(async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  const cheapTours: Tours[] = await AppdataSource.getRepository(Tours).find({
    order: {
      price: 'ASC',
    },
    take: 5,
    select: ['TOUR_NAME', 'price', 'ratingsAverage', 'summary', 'difficulty', 'ratingsAverage', 'id'],
    relations: {
      Dates: true,
      Images: true,
    },
  });
  return res.status(400).json({
    status: 'success',
    results: cheapTours.length,
    data: {
      cheapTours,
    },
  });
});

const tourStats: catchAsyncInterface = catchAsync(async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  const tourQuery: SelectQueryBuilder<Tours> = AppdataSource.createQueryBuilder()
    .select('difficulty')
    .addSelect('SUM(price)', 'TOTAL_PRICE')
    .addSelect('AVG(price)', 'AVG_PRICE')
    .addSelect('MAX(price)', 'MAX_PRICE')
    .addSelect('MIN(price)', 'MIN_PRICE')
    .addSelect('COUNT(*)', 'NUM_TOURS')
    .addSelect('SUM(ratingsQuantity)', 'NUM_RATINGS')
    .addSelect('AVG(ratingsAverage)', 'AVG_RATINGS')
    .from(Tours, 'tour')
    .groupBy('difficulty')
    .orderBy('AVG_PRICE');

  const results: any[] = await tourQuery.getRawMany();

  return res.status(200).json({
    status: 'success',
    results: results.length,
    data: {
      results,
    },
  });
});

const getToursByID: catchAsyncInterface = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> => {
    const { id }: string | any = req.params;
    if (!id || Number.isNaN(+id)) next(new AppError(`Invalid ID`, 404));
    const tours: Tours[] = await AppdataSource.getRepository(Tours).find({
      where: {
        id: +id,
      },
      relations: {
        Images: true,
        Dates: true,
      },
    });
    return res.status(200).json({
      status: 'success',
      data: {
        tours,
      },
    });
  }
);

export { getAllTours, topFiveCheapTours, tourStats, getToursByID };
