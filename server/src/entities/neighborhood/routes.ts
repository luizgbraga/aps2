import { Router } from 'express';
import { NeighborhoodController } from './controller';
import { validateQuery } from '../../middlewares/validate';
import { getFromName } from './schemas';

class NeighborhoodRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.post('/', NeighborhoodController.fill);
    this.router.get('/', NeighborhoodController.list);
    this.router.get(
      '/from-name',
      validateQuery(getFromName),
      NeighborhoodController.getFromName,
    );
  }
}

export default new NeighborhoodRoutes().router;
