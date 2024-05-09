import { notifications } from './schema';
import { db } from '../../database';

export class NotificationRepository {
  static add = async (description: string, neighborhoodId: string) => {
    try {
      return await db
        .insert(notifications)
        .values({ description, neighborhoodId });
    } catch (error) {
      throw error;
    }
  };
}
