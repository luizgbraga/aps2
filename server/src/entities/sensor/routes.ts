import { Router } from 'express';
import { SensorController } from './controller';
import { logged } from '../../middlewares/logged';
import { validateBody } from '../../middlewares/validate';
import { check } from './schemas';

class SensorRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.get('/', logged, validateBody(check), SensorController.check);
  }
}

export default new SensorRoutes().router;
