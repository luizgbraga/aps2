import { Router } from 'express';
import { NeighborhoodController } from './controller';

class NeighborhoodRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.post('/', NeighborhoodController.fill);
    this.router.get('/', NeighborhoodController.list);
  }
}

export default new NeighborhoodRoutes().router;