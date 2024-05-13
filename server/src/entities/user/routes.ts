import { Router } from 'express';
import { UserController } from './controller';
import { logged } from '../../middlewares/logged';
import { validateBody } from '../../middlewares/validate';
import { login, register } from './schemas';

class UserRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.get('/me', logged, UserController.me);
    this.router.post('/login', validateBody(register), UserController.login);
    this.router.post('/register', validateBody(login), UserController.register);
  }
}

export default new UserRoutes().router;
