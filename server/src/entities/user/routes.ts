import { Router } from 'express';
import { UserController } from './controller';
import { logged } from '../../middlewares/logged';

class UserRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.get('/me', logged, UserController.me);
  }
}

export default new UserRoutes().router;
