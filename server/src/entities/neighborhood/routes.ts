import { Router } from 'express';
import { NeighborhoodController } from './controller';

class NeighborhoodRoutes {
  router = Router();
  baseRoute = '/occurrence';

  constructor() {
    this.init();
  }

  init() {
    this.router.post('/', NeighborhoodController.fill);
  }
}

export default new NeighborhoodRoutes().router;
