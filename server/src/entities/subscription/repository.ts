import { Subscriptions, subscriptions } from './schema';
import { db } from '../../database';
import { eq, sql } from 'drizzle-orm';
import { neighborhood } from '../../database/schemas';

export interface ISubscriptionRepository {
  subscribe(userId: string, neighborhoodId: string): Promise<Subscriptions[]>;
  incrementUnread(neighborhoodId: string): Promise<Subscriptions[]>;
}

export class SubscriptionRepository implements ISubscriptionRepository {
  subscribe = async (userId: string, neighborhoodId: string) => {
    try {
      return await db
        .insert(subscriptions)
        .values({ userId, neighborhoodId })
        .returning();
    } catch (error) {
      throw error;
    }
  };

  incrementUnread = async (neighborhoodId: string) => {
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

export class FakeSubscriptionRepository implements ISubscriptionRepository {
  fakeSubscriptions: Subscriptions[];

  constructor(initialFakeSubscription: Subscriptions[]) {
    this.fakeSubscriptions = initialFakeSubscription;
  }

  subscribe = async (userId: string, neighborhoodId: string) => {
    const subscription = {
      userId,
      neighborhoodId,
      unread: 0,
      createdAt: new Date(),
    };
    this.fakeSubscriptions.push(subscription);
    return [subscription];
  };

  incrementUnread = async (neighborhoodId: string) => {
    const updatedSubscriptionss = [] as Subscriptions[];

    this.fakeSubscriptions.forEach((element) => {
      if (element.neighborhoodId === neighborhoodId) {
        element.unread++;
        updatedSubscriptionss.push(element);
      }
    });

    return updatedSubscriptionss;
  };
}
