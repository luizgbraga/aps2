import { Router } from 'express';
import { SensorController } from './controller';
import { validateQuery } from '../../middlewares/validate';
import { coordinateSchema } from './schemas';

class SensorRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.get('/status', validateQuery(coordinateSchema), SensorController.getStatus);
  }
}

export default new SensorRoutes().router;
