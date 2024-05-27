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
    this.router.get('/', RouteController.getShape);
    this.router.post(
      '/newShape',
      validateBody(newShape),
      RouteController.addNewShape,
    );
  }
}

export default new ShapeRoutes().router;
