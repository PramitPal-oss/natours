import express, { Router } from 'express';
import { createUser, login } from '../controller/Tours/userController';

const UserRouter: Router = express.Router();

UserRouter.route('/').post(createUser);
UserRouter.route('/login').post(login);

export default UserRouter;
