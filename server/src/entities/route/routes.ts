import { Router } from 'express';
import { RouteController } from './controller';
import { validateBody } from '../../middlewares/validate';
import cors from 'cors';

class RouteRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.use(cors());
    this.router.get('/allRoutes', RouteController.getAllRoutes);
    this.router.options('*', cors());
  }
}

export default new RouteRoutes().router;
