import { Application } from 'express';
import userRoutes from './entities/user/routes';
import notificationRoutes from './entities/notification/routes';
export class Routes {
  constructor(app: Application) {
    app.use('/api/user', userRoutes);
    app.use('/api/notification', notificationRoutes);
  }
}
