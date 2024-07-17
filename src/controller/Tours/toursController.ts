import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { validate, ValidationError } from 'class-validator';
import { EntityManager, ObjectLiteral, Repository } from 'typeorm';
import InfoDTO from '../../DTO/InfoDTO';
import Tours from '../../Entites/Tours';
import AppdataSource from '../../database';
import Images from '../../Entites/Image';
import Dates from '../../Entites/Date';
import DatesDTO from '../../DTO/DatesDTO';
import ImageDTO from '../../DTO/ImageDTO';
import { extractErrors } from '../../utils/toursutils';

const createTours = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try {
    const infoDTO: InfoDTO = plainToInstance(InfoDTO, req.body);

    const infoErrors: ValidationError[] = await validate(infoDTO, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (infoErrors.length > 0) {
      return res.status(400).json({ status: 'failed', statusCode: 400, message: extractErrors(infoErrors) });
    }

    const tourRepository: Repository<Tours> = await AppdataSource.getRepository(Tours);
    const startDateRepository: Repository<ObjectLiteral> = await AppdataSource.getRepository(Dates);
    const imageRepository: Repository<ObjectLiteral> = await AppdataSource.getRepository(Images);

    // Start a transaction
    await AppdataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      const tour: Tours = tourRepository.create(infoDTO.tour);
      await transactionalEntityManager.save(tour);

      // Create and save start dates associated with the tour
      await Promise.all(
        infoDTO.dates.map(async (startDateDTO: DatesDTO) => {
          const startDate: ObjectLiteral = startDateRepository.create({ startDate: startDateDTO.startDate, tour });
          await transactionalEntityManager.save(startDate);
        })
      );

      await Promise.all(
        infoDTO.images.map(async (image: ImageDTO) => {
          const imageRepo: ObjectLiteral = imageRepository.create({ imageCover: image.imageCover, images: JSON.stringify(image.images), tour });
          await transactionalEntityManager.save(imageRepo);
        })
      );
    });

    return res.status(201).json({ status: 'success', statusCode: 400, message: 'Tour created successfully' });
  } catch (error: any) {
    return res.status(400).json({ status: 'failed', statusCode: 400, message: error.message });
  }
};

const updateTours = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try {
    const { id }: string | any = req.params;
    const user: Tours | null = await AppdataSource.getRepository(Tours).findOneBy({
      id: id,
    });
    if (!user) throw new Error('dww');
    AppdataSource.getRepository(Tours).merge(user, req.body);
    await AppdataSource.getRepository(Tours).save(user);
    return res.status(201).json({ status: 'success', statusCode: 400, message: 'Tour created successfully' });
  } catch (error: any) {
    return res.status(400).json({ status: 'failed', statusCode: 400, message: error.message });
  }
};

export { createTours, updateTours };
