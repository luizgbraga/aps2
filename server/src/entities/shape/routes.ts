import cors from 'cors';
import { Router } from 'express';
import { RouteController } from './controller';

class ShapeRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.use(cors());
    this.router.get('/get-shape', RouteController.getShape);
    this.router.options('*', cors());
  }
}

export default new ShapeRoutes().router;
