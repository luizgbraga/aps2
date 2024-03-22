import { Application } from 'express';
import userRoutes from './entities/user/routes';

export class Routes {
  constructor(app: Application) {
    app.use('/api/user', userRoutes);
  }
}
