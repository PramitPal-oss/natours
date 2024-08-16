import express, { Router } from 'express';
import { getAllTours, getToursByID, topFiveCheapTours, tourStats } from '../controller/Tours/gettoursController';
import { createTours, updateTours } from '../controller/Tours/toursController';
import { protect } from '../controller/Users/userController';
import { validateDTO } from '../utils/helper';
import QueryDTO from '../DTO/QueryDTO';
import InfoDTO from '../DTO/InfoDTO';

const tourRouter: Router = express.Router();

tourRouter.route('/').get(protect, validateDTO(QueryDTO, 'query'), getAllTours).post(protect, validateDTO(InfoDTO, 'body'), createTours);

tourRouter.route('/tours-stats').get(protect, tourStats);

tourRouter.route('/top-5-cheap').get(protect, topFiveCheapTours);

tourRouter.route('/:id').get(protect, getToursByID).post(protect, validateDTO(InfoDTO, 'body'), updateTours);

export default tourRouter;
