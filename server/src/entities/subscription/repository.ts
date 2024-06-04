import { Subscriptions, subscriptions } from './schema';
import { db } from '../../database';
import { eq, sql } from 'drizzle-orm';
import { Neighborhood, neighborhood } from '../../database/schemas';

export interface ISubscriptionRepository {
  subscribe(userId: string, neighborhoodId: string): Promise<Subscriptions[]>;
  incrementUnread(neighborhoodId: string): Promise<Subscriptions[]>;
  unsubscribe(userId: string, neighborhoodId: string): Promise<Subscriptions[]>;
  setUnreadToZero(userId: string): Promise<Subscriptions[]>;
  list(userId: string): Promise<Neighborhood[]>;
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
        .where(eq(subscriptions.neighborhoodId, neighborhoodId)).returning();
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

  unsubscribe = async (userId: string, neighborhoodId: string) => {
    const newSubscriptionsArray = [] as Subscriptions[];
    const deletedSubscriptions = [] as Subscriptions[];
    this.fakeSubscriptions.forEach(subscription => {
      if(subscription.userId === userId && subscription.neighborhoodId === neighborhoodId) {
        deletedSubscriptions.push(subscription);
      }
      else {
        newSubscriptionsArray.push(subscription)
      }
    });
    this.fakeSubscriptions = newSubscriptionsArray;
    return deletedSubscriptions;
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

  setUnreadToZero = async (userId: string) => {
    const updatedSubscriptionss = [] as Subscriptions[];

    this.fakeSubscriptions.forEach((element) => {
      if (element.userId === userId) {
        element.unread = 0;
        updatedSubscriptionss.push(element);
      }
    });

    return updatedSubscriptionss;
  };
  
  list = async (userId: string) => {
    throw new Error("Not implemented");
  }
}
