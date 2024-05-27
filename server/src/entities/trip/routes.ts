import { Router } from 'express';
import { TripController } from './controller';
import { newTrip } from './schemas';
import { validateBody } from '../../middlewares/validate';

class TripRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.get('/allTrips', TripController.getAllTrips);
    this.router.post(
      '/newTrip',
      validateBody(newTrip),
      TripController.addNewTrip,
    );
  }
}

export default new TripRoutes().router;
