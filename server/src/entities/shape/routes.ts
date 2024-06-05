import cors from 'cors';
import { Router } from 'express';
import { RouteController } from './controller';
import { newShape } from './schemas';
import { validateBody } from '../../middlewares/validate';

class ShapeRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.use(cors());
    this.router.get('/get-shape', RouteController.getShape);
    this.router.post(
      '/newShape',
      validateBody(newShape),
      RouteController.addNewShape,
    );
    this.router.options('*', cors());
  }
}

export default new ShapeRoutes().router;
