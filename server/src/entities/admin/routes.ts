import { Router } from 'express';
import { AdminController } from './controller';
import { validateBody } from '../../middlewares/validate';
import { login } from './schemas';

class AdminRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.post('/login', validateBody(login), AdminController.login);
  }
}

export default new AdminRoutes().router;
