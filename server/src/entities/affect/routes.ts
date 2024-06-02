import { Router } from 'express';
import { RouteController } from './controller';
import { affectNewRoute} from './schemas';
import { validateBody } from '../../middlewares/validate';
import cors from 'cors';

class AffectRoutes {
  router = Router();

  constructor() {
    this.init();
  }

  init() {
    this.router.use(cors());
    this.router.get('/affectedRoutes',RouteController.getAffectedRoutes);
    this.router.options('*', cors());
  }
}

export default new AffectRoutes().router;
