import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import UserDTO from '../../DTO/UserDTO';
import { constructResponse, Signintoken } from '../../utils/helper';
import { REPOS } from '../../database';
import User from '../../Entites/User';
import AppError, { catchAsync } from '../../utils/appError';
import { catchAsyncInterface } from '../../interface/ToursInterface';

const createUser: catchAsyncInterface = catchAsync(async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  const userReqBody: UserDTO = req.body;

  const createUserReq: User = await REPOS.USERREPO.create({
    lastName: userReqBody.LAST_NAME,
    firstName: userReqBody.FIRST_NAME,
    password: userReqBody.PASSWORD,
    email: userReqBody.EMAIL,
    address: userReqBody.ADDRESS,
  });

  const newUser: User = await REPOS.USERREPO.save(createUserReq);

  return constructResponse(res, 'user created successfully', 'token', Signintoken(+newUser.id));
});

const login: catchAsyncInterface = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userReqBody: UserDTO = req.body;

  const findUser: User | null = await REPOS.USERREPO.findOneBy({ email: userReqBody.EMAIL });

  if (!findUser) return next(new AppError('InValid Email or Password', 404));

  const findPassword: boolean = await bcrypt.compare(userReqBody.PASSWORD, findUser.password);

  if (!findPassword) return next(new AppError('InValid Email or Password', 404));

  return constructResponse(res, 'Loggin Successfull!', 'token', Signintoken(+findUser.id));
});

export { createUser, login };
