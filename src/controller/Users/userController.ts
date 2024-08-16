import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { promisify } from 'util';
import UserDTO from '../../DTO/UserDTO';
import { constructResponse, Signintoken } from '../../utils/helper';
import AppdataSource from '../../database';
import User from '../../Entites/User';
import AppError, { catchAsync } from '../../utils/appError';
import { catchAsyncInterface } from '../../interface/ToursInterface';

const createUser: catchAsyncInterface = catchAsync(async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  const userReqBody: UserDTO = req.body;

  const UserRepo: Repository<User> = await AppdataSource.getRepository(User);

  const createUserReq: User = await UserRepo.create({
    lastName: userReqBody.LAST_NAME,
    firstName: userReqBody.FIRST_NAME,
    password: userReqBody.PASSWORD,
    email: userReqBody.EMAIL,
    address: userReqBody.ADDRESS,
  });

  const newUser: User = await UserRepo.save(createUserReq);

  return constructResponse(res, 'user created successfully', 'token', Signintoken(+newUser.id));
});

const login: catchAsyncInterface = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userReqBody: UserDTO = req.body;

  const UserRepo: Repository<User> = await AppdataSource.getRepository(User);

  const findUser: User | null = await UserRepo.findOneBy({ email: userReqBody.EMAIL });

  if (!findUser) return next(new AppError('InValid Email or Password', 400));

  const findPassword: boolean = await bcrypt.compare(userReqBody.PASSWORD, findUser.password);

  if (!findPassword) return next(new AppError('InValid Email or Password', 400));

  return constructResponse(res, 'Loggin Successfull!', 'token', Signintoken(+findUser.id));
});

const protect: catchAsyncInterface = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    let token: string = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return next(new AppError('No Token Found', 400));

    const decoded: void = await promisify<string, string>(jwt.verify)(token, process.env.JWT_SECREAT!);
    console.log(decoded, ': jwt.SigningKeyCallback');
    next();
  } catch (error: any) {
    return res.status(400).json({ status: 'failed', statusCode: 401, message: error.message });
  }
});

export { createUser, login, protect };
