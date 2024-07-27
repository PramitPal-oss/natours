import express, { Router } from 'express';
import { getAllTours, getToursByID, topFiveCheapTours, tourStats } from '../controller/Tours/gettoursController';
import { createTours, updateTours } from '../controller/Tours/toursController';

const tourRouter: Router = express.Router();

tourRouter.route('/').get(getAllTours).post(createTours);

tourRouter.route('/tours-stats').get(tourStats);

tourRouter.route('/top-5-cheap').get(topFiveCheapTours);

tourRouter.route('/:id').get(getToursByID).post(updateTours);

export default tourRouter;
