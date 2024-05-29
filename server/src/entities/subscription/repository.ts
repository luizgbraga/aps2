import { subscriptions } from './schema';
import { db } from '../../database';
import { eq, sql } from 'drizzle-orm';

export class SubscriptionRepository {
  static subscribe = async (userId: string, neighborhoodId: string) => {
    try {
      return await db.insert(subscriptions).values({ userId, neighborhoodId });
    } catch (error) {
      throw error;
    }
  };

  static incrementUnread = async (neighborhoodId: string) => {
    try {
      return await db
        .update(subscriptions)
        .set({ unread: sql`${subscriptions.unread} + 1` })
        .where(eq(subscriptions.neighborhoodId, neighborhoodId))
        .returning();
    } catch (error) {
      throw error;
    }
  };
}
