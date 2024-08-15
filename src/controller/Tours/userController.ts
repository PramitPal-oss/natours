import { NextFunction, Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Repository } from 'typeorm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { promisify } from 'util';
import UserDTO from '../../DTO/UserDTO';
import { extractErrors, STATUS } from '../../utils/toursutils';
import AppdataSource from '../../database';
import User from '../../Entites/User';

const createUser = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try {
    const userReqBody: UserDTO = plainToInstance(UserDTO, req.body);

    const userErrors: ValidationError[] = await validate(userReqBody, {
      whitelist: true,
      forbidNonWhitelisted: true,
      groups: ['create'],
    });

    if (userErrors.length > 0) {
      return res.status(400).json({ status: 'failed', statusCode: 200, message: extractErrors(userErrors) });
    }

    const UserRepo: Repository<User> = await AppdataSource.getRepository(User);

    const createUserReq: User = await UserRepo.create({
      lastName: userReqBody.LAST_NAME,
      firstName: userReqBody.FIRST_NAME,
      password: userReqBody.PASSWORD,
      email: userReqBody.EMAIL,
      address: userReqBody.ADDRESS,
    });

    const newUser: User = await UserRepo.save(createUserReq);

    const token: string = jwt.sign({ id: +newUser.id }, process.env.JWT_SECREAT!, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(400).json({ status: 'SUCCESS', statusCode: 400, message: 'user created successfully', token });
  } catch (error: any) {
    return res.status(400).json({ status: 'failed', statusCode: 400, message: error.message });
  }
};

const login = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  try {
    const userReqBody: UserDTO = plainToInstance(UserDTO, req.body);

    const userErrors: ValidationError[] = await validate(userReqBody, {
      whitelist: true,
      forbidNonWhitelisted: true,
      groups: ['login'],
    });

    if (userErrors.length > 0) {
      return res.status(400).json({ status: 'failed', statusCode: 200, message: extractErrors(userErrors) });
    }

    const UserRepo: Repository<User> = await AppdataSource.getRepository(User);

    const findUser: User | null = await UserRepo.findOneBy({ email: userReqBody.EMAIL });

    if (!findUser) throw new Error('InValid Email or Password');

    const findPassword: boolean = await bcrypt.compare(userReqBody.PASSWORD, findUser.password);

    if (!findPassword) throw new Error('InValid Email or Password');

    const token: string = jwt.sign({ id: +findUser.id }, process.env.JWT_SECREAT!, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(200).json({ status: 'SUCCESS', statusCode: 200, message: 'user has successfully', token });
  } catch (error: any) {
    return res.status(400).json({ status: STATUS.success, statusCode: 400, message: error.message });
  }
};

const protect = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    let token: string = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(400).json({ status: 'failed', statusCode: 200, message: 'No Token Found' });
    }
    const decoded: void = await promisify<string, string>(jwt.verify)(token, process.env.JWT_SECREAT!);
    console.log(decoded, ': jwt.SigningKeyCallback');
    next();
  } catch (error: any) {
    return res.status(400).json({ status: 'failed', statusCode: 401, message: error.message });
  }
};

export { createUser, login, protect };
