import { Router } from 'express';
import { OccurrenceController } from './controller';
import { logged } from '../../middlewares/logged';
import { validateBody } from '../../middlewares/validate';
import { confirm, del, propose } from './schemas';

class OccurenceRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.post(
      '/propose',
      validateBody(propose),
      OccurrenceController.propose,
    );
    this.router.get('/all', OccurrenceController.all);
    this.router.get('/list', logged, OccurrenceController.list);
    this.router.get('/to-approve', OccurrenceController.listToApprove);
    this.router.get('/approved', OccurrenceController.listApproved);
    this.router.put(
      '/confirm',
      validateBody(confirm),
      OccurrenceController.confirm,
    );
    this.router.delete('/', validateBody(del), OccurrenceController.delete);
  }
}

export default new OccurenceRoutes().router;
