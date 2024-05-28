import { Router } from 'express';
import { TripController } from './controller';
import { newTrip } from './schemas';
import { validateBody } from '../../middlewares/validate';
import cors from 'cors';

class TripRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.use(cors());
    this.router.get('/allTrips', TripController.getAllTrips);
    this.router.post(
      '/newTrip',
      validateBody(newTrip),
      TripController.addNewTrip,
    );
    this.router.options('*', cors());
  }
}

export default new TripRoutes().router;
