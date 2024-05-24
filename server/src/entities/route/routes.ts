import { Router } from 'express';
import { RouteController } from './controller';
import { newRoute } from './schemas';
import { validateBody } from '../../middlewares/validate';

class RouteRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.get('/', RouteController.getAllRoutes);
    this.router.post('/', validateBody(newRoute), RouteController.addNewRoute);
  }
}

export default new RouteRoutes().router;
