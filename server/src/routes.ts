import { Application } from 'express';
import userRoutes from './entities/user/routes';
import adminRoutes from './entities/admin/routes';
import routeRoutes from './entities/route/routes';
import tripRoutes from './entities/trip/routes';
import shapeRoutes from './entities/shape/routes';
import occurrenceRoutes from './entities/occurrence/routes';
import subscriptionRoutes from './entities/subscription/routes';
import neighborhoodRoutes from './entities/neighborhood/routes';
import sensorRoutes from './entities/sensor/routes';

export class Routes {
  constructor(app: Application) {
    app.use('/api/user', userRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/route', routeRoutes);
    app.use('/api/trip', tripRoutes);
    app.use('/api/shape', shapeRoutes);
    app.use('/api/occurrence', occurrenceRoutes);
    app.use('/api/subscription', subscriptionRoutes);
    app.use('/api/neighborhood', neighborhoodRoutes);
    app.use('/api/sensor', sensorRoutes);
  }
}
