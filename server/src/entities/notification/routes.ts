import { Router } from 'express';
import { NotificationController } from './controller';
import { logged } from '../../middlewares/logged';
import { validateBody } from '../../middlewares/validate';
import { add } from './schemas';

class NotificationRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.post('/', logged, validateBody(add), NotificationController.add);
  }
}

export default new NotificationRoutes().router;
