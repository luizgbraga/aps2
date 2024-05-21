import { Application } from 'express';
import userRoutes from './entities/user/routes';
import notificationRoutes from './entities/notification/routes';
import adminRoutes from './entities/admin/routes';

export class Routes {
  constructor(app: Application) {
    app.use('/api/user', userRoutes);
    app.use('/api/notification', notificationRoutes);
    app.use('/api/admin', adminRoutes);
  }
}
