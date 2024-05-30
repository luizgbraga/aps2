import { OccurenceType, occurences } from './schema';
import { db } from '../../database';
import { and, eq } from 'drizzle-orm';
import { SubscriptionRepository } from '../../entities/subscription/repository';
import { subscriptions } from '../../database/schemas';

export class OccurrenceRepository {
  static add = async (
    type: OccurenceType,
    description: string,
    neighborhoodId: string,
    latitude: string,
    longitude: string,
  ) => {
    try {
      return await db
        .insert(occurences)
        .values({ type, description, neighborhoodId, latitude, longitude });
    } catch (error) {
      throw error;
    }
  };

  static list = async (userId: string) => {
    try {
      return await db
        .select()
        .from(subscriptions)
        .innerJoin(
          occurences,
          eq(subscriptions.neighborhoodId, occurences.neighborhoodId),
        )
        .where(
          and(eq(subscriptions.userId, userId), eq(occurences.confirmed, true)),
        );
    } catch (error) {
      throw error;
    }
  };

  static confirm = async (id: string) => {
    try {
      const updated = await db
        .update(occurences)
        .set({ confirmed: true })
        .where(eq(occurences.id, id))
        .returning();
      updated.forEach((occurence) => {
        SubscriptionRepository.incrementUnread(occurence.neighborhoodId);
      });
    } catch (error) {
      throw error;
    }
  };
}
