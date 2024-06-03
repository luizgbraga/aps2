import { Router } from 'express';
import { SensorController } from './controller';

class SensorRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.get('/', SensorController.getAllStatuses);
  }
}

export default new SensorRoutes().router;
