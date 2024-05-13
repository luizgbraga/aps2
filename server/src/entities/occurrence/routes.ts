import { Router } from 'express';
import { OccurrenceController } from './controller';
import { logged } from '../../middlewares/logged';
import { validateBody } from '../../middlewares/validate';
import { add } from './schemas';

class OccurenceRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.post('/', logged, validateBody(add), OccurrenceController.add);
  }
}

export default new OccurenceRoutes().router;
