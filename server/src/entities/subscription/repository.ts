import { subscriptions } from './schema';
import { db } from '../../database';

export class SubscriptionRepository {
  static subscribe = async (userId: string, neighborhoodId: string) => {
    try {
      return await db.insert(subscriptions).values({ userId, neighborhoodId });
    } catch (error) {
      throw error;
    }
  };
}
