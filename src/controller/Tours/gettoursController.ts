import { Request, Response } from 'express';
import { Repository, SelectQueryBuilder } from 'typeorm';
import Tours from '../../Entites/Tours';
import AppdataSource from '../../database';
import { createFieldsObj, createOrderObj, createWherObject } from '../../utils/toursutils';

const getAllTours = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try {
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
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

const topFiveCheapTours = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try {
    const cheapTours: Tours[] = await AppdataSource.getRepository(Tours).find({
      order: {
        price: 'ASC',
      },
      take: 5,
      select: ['name', 'price', 'ratingsAverage', 'summary', 'difficulty', 'ratingsAverage', 'id'],
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
  } catch (error: any) {
    return res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

const tourStats = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try {
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
  } catch (error: any) {
    return res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

export { getAllTours, topFiveCheapTours, tourStats };
