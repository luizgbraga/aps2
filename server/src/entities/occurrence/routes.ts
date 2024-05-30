import { Router } from 'express';
import { OccurrenceController } from './controller';
import { logged } from '../../middlewares/logged';
import { validateBody } from '../../middlewares/validate';
import { add, confirm } from './schemas';

class OccurenceRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.post('/add', validateBody(add), OccurrenceController.add);
    this.router.get('/list', OccurrenceController.list);
    this.router.put(
      '/confirm',
      logged,
      validateBody(confirm),
      OccurrenceController.confirm,
    );
  }
}

export default new OccurenceRoutes().router;
