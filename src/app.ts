/** @format */

import express, { Express, Request, Response } from 'express';
import {
  FindOperator,
  MoreThan,
  LessThan,
  SelectQueryBuilder,
  Repository,
  FindOptionsWhere,
  FindOptionsOrder,
  FindOptionsSelect,
  FindOptionsSelectByString,
  ObjectLiteral,
  EntityManager,
} from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import AppdataSource from './database';
import Tours from './Entites/Tours';

import { DifficultyType } from './validator/validator';
import Dates from './Entites/Date';
// import { TourWithDates } from './RequestInterface';
import TourDTO from './DTO/ToursDTO';
import DatesDTO from './DTO/DatesDTO';
import InfoDTO from './DTO/InfoDTO';

const app: Express = express();

interface QueryParams {
  duration?: string | string[];
  difficulty?: string | string[];
  price?: string | string[];
}

interface QueryObject {
  duration?: number | FindOperator<number> | undefined;
  difficulty?: string;
  price?: number | FindOperator<number> | undefined;
}

app.use(express.json());

AppdataSource.initialize()
  .then(() => {
    console.log('DataSource Successfully Connected ith the database!!');
  })
  .catch((err: Error) => {
    console.log('Error during Data Source initialization', err.message);
  });

app.get('/', (_req: Request, res: Response) => {
  res.send('Hellow From Server');
});

app.get('/api/v1/tours', async (req: Request, res: Response) => {
  try {
    const ToursRepo: Repository<Tours> = AppdataSource.getRepository(Tours);

    const objectHandler = (value: string | object | undefined): FindOperator<number> | undefined | number => {
      if (typeof value === 'object') {
        const values: [string, any] = Object.entries(value)[0];
        return values[0] === 'more' ? MoreThan(+values[1]) : LessThan(+values[1]);
      }
      return Number(value);
    };

    const createWherObject = (): FindOptionsWhere<Tours> | FindOptionsWhere<Tours>[] | undefined => {
      const obj: QueryObject | any = {};
      const keys: string[] = Object.keys(req.query);
      keys.forEach((key: string) => {
        if (key === 'duration') {
          obj.duration = objectHandler(req.query.duration) && objectHandler(req.query.duration);
        } else if (key === 'difficulty') {
          const { difficulty }: QueryParams = req.query;
          if (typeof difficulty === 'string') {
            obj.difficulty = difficulty as DifficultyType;
          }
        } else if (key === 'price') {
          obj.price = objectHandler(req.query.price) && objectHandler(req.query.price);
        }
      });
      return obj;
    };

    const createOrderObj = (): FindOptionsOrder<Tours> | undefined => {
      const { sort }: string | string[] | any = req.query;
      let obj: { [key: string]: string } = {};
      const sorrteddata: string[] = sort?.split(',');
      sorrteddata?.forEach((el: string) => {
        const splitEl: string[] = el.split('-');
        const property: string = splitEl[1];
        const order: string = splitEl[0] === 'asc' ? 'ASC' : 'DESC';
        obj = { ...obj, [property]: order };
      });
      return obj;
    };

    const createFieldsObj = (): FindOptionsSelect<Tours> | FindOptionsSelectByString<Tours> | undefined => {
      const { fields }: string | any = req.query;
      if (fields) {
        const fieldsArray: string[] = fields.split(',');
        const selectObject: FindOptionsSelectByString<Tours> | { [key: string]: string | boolean } = { id: true };
        fieldsArray.forEach((field: string) => {
          selectObject[field] = true;
        });
        return selectObject;
      }
      return undefined;
    };

    const tours: Tours[] = await ToursRepo.find({
      where: createWherObject(),
      order: createOrderObj(),
      select: createFieldsObj(),
      take: 3,
      skip: req?.query?.page ? (+req.query.page - 1) * 3 : 0,
      relations: {
        Dates: createFieldsObj() ? Object.keys(createFieldsObj()!).includes('Dates') : false,
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
});

app.get('/api/v1/top-5-cheap', async (req: Request, res: Response) => {
  try {
    const cheapTours: Tours[] = await AppdataSource.getRepository(Tours).find({
      order: {
        price: 'ASC',
      },
      take: 5,
      select: ['name', 'price', 'ratingsAverage', 'summary', 'difficulty', 'ratingsAverage', 'id'],
      relations: {
        Dates: true,
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
});

app.get('/api/v1/tours-stats', async (req: Request, res: Response) => {
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
});

//app.get('/api/v1/tours-business', async (req: Request, res: Response) => { });

app.post('/api/v1/tours', async (req: Request, res: Response) => {
  try {
    const infoDTO: InfoDTO = plainToInstance(InfoDTO, req.body);

    const tourDTO: TourDTO = plainToInstance(TourDTO, infoDTO.tour);
    const dateDTO: DatesDTO[] = plainToInstance(DatesDTO, infoDTO.dates);

    const toursError: ValidationError[] = await validate(tourDTO, {
      skipMissingProperties: true,
      forbidUnknownValues: true,
    });

    const datesError: ValidationError[][] = await Promise.all(
      dateDTO.map(async (el: DatesDTO) => {
        return await validate(el, {
          skipMissingProperties: true,
          forbidUnknownValues: true,
        });
      })
    );

    if (toursError.length > 0 || datesError.some((errors: ValidationError[]) => errors.length > 0)) {
      return res.status(400).json({
        status: 'failed',
        statusCode: 400,
        error: 'Validation failed.',
        TourErrors: toursError.map((error: ValidationError) => ({
          property: error.property,
          constraints: error.constraints,
        })),
        DateErrors: datesError.map((error: ValidationError[]) => {
          return error.map((el: ValidationError) => {
            return {
              property: el.property,
              constraints: el.constraints,
            };
          });
        }),
      });
    }

    const tourRepository: Repository<Tours> = await AppdataSource.getRepository(Tours);
    const startDateRepository: Repository<ObjectLiteral> = await AppdataSource.getRepository(Dates);

    // Start a transaction
    await AppdataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      const tour: Tours = tourRepository.create(tourDTO);
      await transactionalEntityManager.save(tour);

      // Create and save start dates associated with the tour
      await Promise.all(
        dateDTO.map(async (startDateDTO: DatesDTO) => {
          const startDate: ObjectLiteral = startDateRepository.create({ startDate: startDateDTO.startDate, tour });
          await transactionalEntityManager.save(startDate);
        })
      );
    });

    return res.status(201).json({ status: 'success', statusCode: 400, message: 'Tour and StartDates created successfully' });
  } catch (error: any) {
    return res.status(400).json({ status: 'failed', statusCode: 400, message: error.message });
  }
});

app.listen(3000, () => {
  console.log('server is running adn Database is connected');
});

export default app;
