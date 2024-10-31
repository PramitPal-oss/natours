import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import bcrypt from 'bcryptjs';
import { catchAsyncInterface } from '../../interface/ToursInterface';
import AppError, { catchAsync } from '../../utils/appError';
import { REPOS } from '../../database';
import User from '../../Entites/User';
import UserDTO from '../../DTO/UserDTO';
import sendMail from '../../utils/email';
import { constructResponse } from '../../utils/helper';

const protect: catchAsyncInterface = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  let token: string = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next(new AppError('No Token Found', 400));

  await promisify<string, string>(jwt.verify)(token, process.env.JWT_SECREAT!);
  next();
});

const forgotPassoword: catchAsyncInterface = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userEmail: UserDTO = req.body;

  const findUser: User | null = await REPOS.USERREPO.findOneBy({ email: userEmail.EMAIL });

  if (!findUser) return next(new AppError('There is no user with this email address', 404));

  const resetToken: string = `${Math.floor(1000 + Math.random() * 9000)}`;

  const PasswordResetToken: string = await bcrypt.hash(resetToken, 12);

  await REPOS.USERREPO.update(findUser.id, { PasswordReset: PasswordResetToken, expairesIn: Date.now() + 600 * 1000 });

  const message: string = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${PasswordResetToken}.\nIf you didn't forget your password, please ignore this email.`;

  await sendMail({
    email: findUser.email,
    subject: 'Your password reset token (valid for 10 min)',
    message,
  });

  return constructResponse(res, 'Your Email Has been sent');

  console.log(PasswordResetToken);
});

const resetPassoword = async (req: Request, res: Response, next: NextFunction) => { };

export { protect, forgotPassoword, resetPassoword };
