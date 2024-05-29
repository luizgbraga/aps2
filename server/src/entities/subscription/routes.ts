import { Router } from 'express';
import { SubscriptionController } from './controller';
import { logged } from '../../middlewares/logged';
import { validateBody } from '../../middlewares/validate';
import { subscribe } from './schemas';

class SubscriptionRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.post(
      '/',
      logged,
      validateBody(subscribe),
      SubscriptionController.subscribe,
    );
  }
}

export default new SubscriptionRoutes().router;
