import express, { Router } from 'express';
import { createUser, login } from '../controller/Users/userController';
import { validateDTO } from '../utils/helper';
import UserDTO from '../DTO/UserDTO';
import { forgotPassoword, resetPassoword } from '../controller/Users/authController';

const UserRouter: Router = express.Router();

UserRouter.route('/').post(validateDTO(UserDTO, 'body', 'create'), createUser);
UserRouter.route('/login').post(validateDTO(UserDTO, 'body', 'login'), login);
UserRouter.post('/forgotPassword', validateDTO(UserDTO, 'body', 'reset'), forgotPassoword);
UserRouter.post('/resetPassword', resetPassoword);

export default UserRouter;
