import { Router } from 'express';
import { validateBody } from '../../middlewares/validate';
import { list } from './schemas';
import { MessagesController } from './controller';

class SubscriptionRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.get('/', validateBody(list), MessagesController.list);
  }
}

export default new SubscriptionRoutes().router;
