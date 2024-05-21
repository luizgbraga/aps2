import { Application } from 'express';
import userRoutes from './entities/user/routes';
import adminRoutes from './entities/admin/routes';
import occurrenceRoutes from './entities/occurrence/routes';

export class Routes {
  constructor(app: Application) {
    app.use('/api/user', userRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/occurrence', occurrenceRoutes);
  }
}
