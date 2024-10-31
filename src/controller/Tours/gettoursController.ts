import { NextFunction, Request, Response } from 'express';
import { SelectQueryBuilder } from 'typeorm';
import Tours from '../../Entites/Tours';
import AppdataSource, { REPOS } from '../../database';
import { createFieldsObj, createOrderObj, createWherObject } from '../../utils/toursutils';
import AppError, { catchAsync } from '../../utils/appError';
import { catchAsyncInterface } from '../../interface/ToursInterface';
import { constructResponse } from '../../utils/helper';

const getAllTours: catchAsyncInterface = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const tours: Tours[] = await REPOS.TOURREPO.find({
    where: createWherObject(req),
    order: createOrderObj(req),
    select: createFieldsObj(req),
    take: req?.query?.take && !Number.isNaN(+req.query.take) ? +req.query.take : 3,
    skip: req?.query?.page ? (+req.query.page - 1) * 3 : 0,
    relations: {
      Dates: createFieldsObj(req) ? Object.keys(createFieldsObj(req)!).includes('Dates') : false,
      Images: createFieldsObj(req) ? Object.keys(createFieldsObj(req)!).includes('Images') : false,
    },
  });

  return constructResponse(res, 'Tours successfully found!', 'allTours', tours);
});

const topFiveCheapTours: catchAsyncInterface = catchAsync(async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  const cheapTours: Tours[] = await REPOS.TOURREPO.find({
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
  return constructResponse(res, 'Tours successfully found!', 'cheapTours', cheapTours);
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
  return constructResponse(res, 'Tours successfully found!', 'TourStats', results);
});

const getToursByID: catchAsyncInterface = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined> => {
    const { id }: string | any = req.params;

    if (!id || Number.isNaN(+id)) next(new AppError(`Invalid ID`, 404));

    const tours: Tours[] = await REPOS.TOURREPO.find({
      where: {
        id: +id,
      },
      relations: {
        Images: true,
        Dates: true,
      },
    });

    return constructResponse(res, 'Tours successfully found!', 'ToursByID', tours);
  }
);

export { getAllTours, topFiveCheapTours, tourStats, getToursByID };
