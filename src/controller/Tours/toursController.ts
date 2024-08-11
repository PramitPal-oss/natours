import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { validate, ValidationError } from 'class-validator';
import { QueryRunner, Repository } from 'typeorm';
import InfoDTO from '../../DTO/InfoDTO';
import Tours from '../../Entites/Tours';
import AppdataSource from '../../database';
import Images from '../../Entites/Image';
import Dates from '../../Entites/Date';
import DatesDTO from '../../DTO/DatesDTO';
import ImageDTO from '../../DTO/ImageDTO';
import { extractErrors } from '../../utils/toursutils';

// async function processTourInfo(queryRunner: QueryRunner, infoDTO: InfoDTO, existingTour?: Tours): Promise<Tours> {
//   const tourRepository: Repository<Tours> = queryRunner.manager.getRepository(Tours);
//   const imageRepository: Repository<Images> = queryRunner.manager.getRepository(Images);
//   const dateRepository: Repository<Dates> = queryRunner.manager.getRepository(Dates);

//   let tour: Tours;
//   if (existingTour) {
//     await tourRepository.update(existingTour.id, infoDTO.tour);
//     tour = existingTour;
//   } else {
//     tour = tourRepository.create(infoDTO.tour);
//     tour = await tourRepository.save(tour);
//   }

//   await Promise.all(
//     infoDTO.dates.map(async (startDateDTO: DatesDTO) => {
//       if (startDateDTO.id) {
//         await dateRepository.update(startDateDTO.id, startDateDTO);
//       } else {
//         const startDate: Dates = dateRepository.create({ startDate: startDateDTO.startDate, tour });
//         await dateRepository.save(startDate);
//       }
//     })
//   );

//   await Promise.all(
//     infoDTO.images.map(async (image: ImageDTO) => {
//       if (image.id) {
//         await imageRepository.update(image.id, { imageCover: image.imageCover, images: JSON.stringify(image.images) });
//       } else {
//         const imageRepo: Images = imageRepository.create({ imageCover: image.imageCover, images: JSON.stringify(image.images), tour });
//         await imageRepository.save(imageRepo);
//       }
//     })
//   );

//   return tour;
// }

// const createTours = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
//   const queryRunner: QueryRunner = AppdataSource.createQueryRunner();

//   try {
//     const infoDTO: InfoDTO = plainToInstance(InfoDTO, req.body);

//     const infoErrors: ValidationError[] = await validate(infoDTO, {
//       whitelist: true,
//       forbidNonWhitelisted: true,
//     });

//     if (infoErrors.length > 0) {
//       return res.status(400).json({ status: 'failed', statusCode: 400, message: extractErrors(infoErrors) });
//     }

//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     await processTourInfo(queryRunner, infoDTO);

//     await queryRunner.commitTransaction();

//     return res.status(201).json({ status: 'success', statusCode: 201, message: 'Tour created successfully' });
//   } catch (error: any) {
//     await queryRunner.rollbackTransaction();
//     return res.status(400).json({ status: 'failed', statusCode: 400, message: error.message });
//   } finally {
//     await queryRunner.release();
//   }
// };

// const updateTours = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
//   const queryRunner: QueryRunner = AppdataSource.createQueryRunner();

//   try {
//     const { id }: string | any = req.params;

//     const infoDTO: InfoDTO = plainToInstance(InfoDTO, req.body);

//     const infoErrors: ValidationError[] = await validate(infoDTO, {
//       whitelist: true,
//       forbidNonWhitelisted: true,
//     });

//     if (infoErrors.length > 0) {
//       return res.status(400).json({ status: 'failed', statusCode: 400, message: extractErrors(infoErrors) });
//     }

//     const existingTour: Tours | null = await AppdataSource.getRepository(Tours).findOne({
//       where: {
//         id: +id,
//       },
//     });

//     if (!existingTour) {
//       return res.status(404).json({ status: 'failed', statusCode: 404, message: 'No tours found with this ID' });
//     }

//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     await processTourInfo(queryRunner, infoDTO, existingTour);

//     await queryRunner.commitTransaction();
//     return res.status(200).json({ status: 'success', statusCode: 200, message: 'Tour updated successfully' });
//   } catch (error: any) {
//     await queryRunner.rollbackTransaction();
//     return res.status(400).json({ status: 'failed', statusCode: 400, message: error.message });
//   } finally {
//     await queryRunner.release();
//   }
// };

const createTours = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  const queryRunner: QueryRunner = AppdataSource.createQueryRunner();

  try {
    const infoDTO: InfoDTO = plainToInstance(InfoDTO, req.body);

    const infoErrors: ValidationError[] = await validate(infoDTO, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (infoErrors.length > 0) {
      return res.status(400).json({ status: 'failed', statusCode: 400, message: extractErrors(infoErrors) });
    }

    await queryRunner.connect();

    await queryRunner.startTransaction();

    const tourRepository: Repository<Tours> = queryRunner.manager.getRepository(Tours);
    const imageRepository: Repository<Images> = queryRunner.manager.getRepository(Images);
    const dateRepository: Repository<Dates> = queryRunner.manager.getRepository(Dates);

    const tour: Tours = tourRepository.create(infoDTO.tour);
    const savedTour: Tours = await tourRepository.save(tour);

    await Promise.all(
      infoDTO.dates.map(async (startDateDTO: DatesDTO) => {
        const startDate: Dates = dateRepository.create({ startDate: startDateDTO.startDate, tour: savedTour });
        await dateRepository.save(startDate);
      })
    );

    await Promise.all(
      infoDTO.images.map(async (image: ImageDTO) => {
        const imageRepo: Images = imageRepository.create({ imageCover: image.imageCover, images: JSON.stringify(image.images), tour: savedTour });
        await imageRepository.save(imageRepo);
      })
    );
    await queryRunner.commitTransaction();

    return res.status(201).json({ status: 'success', statusCode: 200, message: 'Tour created successfully' });
  } catch (error: any) {
    await queryRunner.rollbackTransaction();
    return res.status(400).json({ status: 'failed', statusCode: 400, message: error.message });
  } finally {
    await queryRunner.release();
  }
};

const updateTours = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  const queryRunner: QueryRunner = AppdataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const tourRepository: Repository<Tours> = queryRunner.manager.getRepository(Tours);
    const imageRepository: Repository<Images> = queryRunner.manager.getRepository(Images);
    const dateRepository: Repository<Dates> = queryRunner.manager.getRepository(Dates);

    const { id }: string | any = req.params;

    const infoDTO: InfoDTO = plainToInstance(InfoDTO, req.body);

    const infoErrors: ValidationError[] = await validate(infoDTO, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (infoErrors.length > 0) {
      return res.status(400).json({ status: 'failed', statusCode: 400, message: extractErrors(infoErrors) });
    }

    const tours: Tours | null = await AppdataSource.getRepository(Tours).findOne({
      where: {
        id: +id,
      },
    });

    if (!tours) {
      throw new Error('No tours found in this ID');
    }

    await tourRepository.update(id, infoDTO.tour);

    await Promise.all(
      infoDTO.dates.map(async (startDateDTO: DatesDTO) => {
        if (startDateDTO.id) {
          await dateRepository.update(startDateDTO.id, startDateDTO);
        } else {
          const startDate: Dates = dateRepository.create({ startDate: startDateDTO.startDate, tour: tours });
          await dateRepository.save(startDate);
        }
      })
    );

    await Promise.all(
      infoDTO.images.map(async (image: ImageDTO) => {
        if (image.id) {
          await imageRepository.update(1, { imageCover: image.imageCover, images: JSON.stringify(image.images) });
        } else {
          const imageRepo: Images = imageRepository.create({ imageCover: image.imageCover, images: JSON.stringify(image.images), tour: tours });
          await imageRepository.save(imageRepo);
        }
      })
    );
    await queryRunner.commitTransaction();
    return res.status(201).json({ status: 'success', statusCode: 400, message: 'Tour Updated successfully' });
  } catch (error: any) {
    await queryRunner.rollbackTransaction();
    return res.status(400).json({ status: 'failed', statusCode: 400, message: error.message });
  } finally {
    await queryRunner.release();
  }
};

export { createTours, updateTours };
