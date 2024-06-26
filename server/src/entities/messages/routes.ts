import { Router } from 'express';
import { validateBody } from '../../middlewares/validate';
import { list } from './schemas';
import { MessagesController } from './controller';

class MessageRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.get('/', validateBody(list), MessagesController.list);
    this.router.get('/all', MessagesController.all);
  }
}

export default new MessageRoutes().router;
