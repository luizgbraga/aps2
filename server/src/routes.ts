import { Application } from 'express';
import userRoutes from './entities/user/routes';
import notificationRoutes from './entities/notification/routes';
import adminRoutes from './entities/admin/routes';
import routeRoutes from './entities/route/routes';
import tripRoutes from './entities/trip/routes';
import shapeRoutes from './entities/shape/routes';

export class Routes {
  constructor(app: Application) {
    app.use('/api/user', userRoutes);
    app.use('/api/notification', notificationRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/route', routeRoutes);
    app.use('/api/trip', tripRoutes);
    app.use('/api/shape', shapeRoutes);
  }
}
