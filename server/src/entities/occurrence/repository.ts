import { OccurenceType, occurences } from './schema';
import { db } from '../../database';
import { and, eq } from 'drizzle-orm';
import { SubscriptionRepository } from '../../entities/subscription/repository';
import { subscriptions } from '../../database/schemas';
import { SensorStatus } from '../../entities/sensor/schema';

export class OccurrenceRepository {
  static find = async (
    type: OccurenceType,
    latitude: string,
    longitude: string,
  ) => {
    try {
      return await db
        .select()
        .from(occurences)
        .where(
          and(
            eq(occurences.type, type),
            eq(occurences.latitude, latitude),
            eq(occurences.longitude, longitude),
          ),
        );
    } catch (error) {
      throw error;
    }
  };
  static create = async (
    type: OccurenceType,
    description: string,
    neighborhoodId: string,
    latitude: string,
    longitude: string,
    radius: number,
    confirmed: boolean,
  ) => {
    try {
      const find = await OccurrenceRepository.find(type, latitude, longitude);
      if (find.length > 0) {
        return find[0];
      }
      const result = await db.insert(occurences).values({
        type,
        description,
        neighborhoodId,
        latitude,
        longitude,
        confirmed,
        radius,
      });
      if (confirmed) {
        SubscriptionRepository.incrementUnread(neighborhoodId);
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  static all = async () => {
    try {
      return await db
        .select()
        .from(occurences)
        .where(eq(occurences.confirmed, true));
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
          occurences,
          eq(subscriptions.neighborhoodId, occurences.neighborhoodId),
        )
        .where(
          and(eq(subscriptions.userId, userId), eq(occurences.confirmed, true)),
        );
      SubscriptionRepository.setUnreadToZero(userId);
      return result;
    } catch (error) {
      throw error;
    }
  };

  static listToApprove = async () => {
    try {
      return await db
        .select()
        .from(occurences)
        .where(eq(occurences.confirmed, false));
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

  static addOccurrencesFromSensorsStatuses = async (
    statuses: SensorStatus[],
  ) => {
    for (const status of statuses) {
      if (status.state.flood > 0) {
        await OccurrenceRepository.create(
          'flooding',
          `Alagamento detectado pelo sensor ${status.sensor.id}`,
          status.sensor.neighborhoodId,
          status.sensor.latitude.toString(),
          status.sensor.longitude.toString(),
          status.sensor.radius,
          true,
        );
      }
      if (status.state.landslide > 0) {
        await OccurrenceRepository.create(
          'landslide',
          `Deslizamento detectado pelo sensor ${status.sensor.id}`,
          status.sensor.neighborhoodId,
          status.sensor.latitude.toString(),
          status.sensor.longitude.toString(),
          status.sensor.radius,
          true,
        );
      }
      if (status.state.congestion > 0) {
        await OccurrenceRepository.create(
          'congestion',
          `Congestionamento detectado pelo sensor ${status.sensor.id}`,
          status.sensor.neighborhoodId,
          status.sensor.latitude.toString(),
          status.sensor.longitude.toString(),
          status.sensor.radius,
          true,
        );
      }
    }
  };
}
