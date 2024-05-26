import { Router } from 'express';
import { OccurrenceController } from './controller';
import { logged } from '../../middlewares/logged';
import { validateBody } from '../../middlewares/validate';
import { add } from './schemas';

class OccurenceRoutes {
  router = Router();
  baseRoute = '/occurrence';

  constructor() {
    this.init();
  }

  init() {
    this.router.post(
      '/add',
      logged,
      validateBody(add),
      OccurrenceController.add,
    );
    this.router.get('/list', OccurrenceController.list); // list all
    this.router.put(
      // update confirmed
      '/confirm',
      logged,
    );
  }
}

export default new OccurenceRoutes().router;
