import { subscriptions, Subscription } from './schema';
import { db } from '../../database';
import { and, eq, sql } from 'drizzle-orm';
import { Neighborhood, neighborhood } from '../../database/schemas';

interface ISubscriptionRepository {
  subscribe: (
    userId: string,
    neighborhoodId: string,
  ) => Promise<Subscription[]>;
  unsubscribe: (
    userId: string,
    neighborhoodId: string,
  ) => Promise<Subscription[]>;
  incrementUnread: (neighborhoodId: string) => Promise<Subscription[]>;
  setUnreadToZero: (userId: string) => Promise<Subscription[]>;
  list: (userId: string) => Promise<Neighborhood[]>;
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

  unsubscribe = async (userId: string, neighborhoodId: string) => {
    try {
      return await db
        .delete(subscriptions)
        .where(
          and(
            eq(subscriptions.userId, userId),
            eq(subscriptions.neighborhoodId, neighborhoodId),
          ),
        )
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

  setUnreadToZero = async (userId: string) => {
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

  list = async (userId: string) => {
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
  subscriptions: Subscription[];
  neighborhoods: Neighborhood[];

  constructor(
    initialSubscriptions: Subscription[],
    initialNeighborhoods: Neighborhood[],
  ) {
    this.subscriptions = initialSubscriptions;
    this.neighborhoods = initialNeighborhoods;
  }

  subscribe = async (userId: string, neighborhoodId: string) => {
    this.subscriptions.push({
      userId,
      neighborhoodId,
      unread: 0,
      createdAt: new Date(),
    });
    return this.subscriptions;
  };

  unsubscribe = async (userId: string, neighborhoodId: string) => {
    this.subscriptions = this.subscriptions.filter(
      (sub) => sub.userId !== userId && sub.neighborhoodId !== neighborhoodId,
    );
    return this.subscriptions;
  };

  incrementUnread = async (neighborhoodId: string) => {
    this.subscriptions = this.subscriptions.map((sub) => {
      if (sub.neighborhoodId === neighborhoodId) {
        sub.unread += 1;
      }
      return sub;
    });
    return this.subscriptions;
  };

  setUnreadToZero = async (userId: string) => {
    this.subscriptions = this.subscriptions.map((sub) => {
      if (sub.userId === userId) {
        sub.unread = 0;
      }
      return sub;
    });
    return this.subscriptions;
  };

  list = async (userId: string) => {
    return this.subscriptions
      .filter((sub) => sub.userId === userId)
      .map((sub) =>
        this.neighborhoods.find(
          (neighborhood) => neighborhood.id === sub.neighborhoodId,
        ),
      );
  };
}
