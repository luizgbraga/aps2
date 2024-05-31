import { subscriptions } from './schema';
import { db } from '../../database';
import { eq, sql } from 'drizzle-orm';
import { neighborhood } from '../../database/schemas';

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

  static setUnreadToZero = async (userId: string) => {
    try {
      return await db
        .update(subscriptions)
        .set({ unread: 0 })
        .where(eq(subscriptions.userId, userId))
        .returning();
    } catch (error) {
      throw error;
    }
  };

  static list = async (userId: string) => {
    try {
      const result = await db
        .select()
        .from(subscriptions)
        .innerJoin(
          neighborhood,
          eq(subscriptions.neighborhoodId, neighborhood.id),
        )
        .where(eq(subscriptions.userId, userId));
      return result.map((sub) => sub.neighborhood);
    } catch (error) {
      throw error;
    }
  };
}
