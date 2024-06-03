import { OccurenceType, occurences } from './schema';
import { db } from '../../database';
import { and, eq, sql } from 'drizzle-orm';
import { SubscriptionRepository } from '../../entities/subscription/repository';
import { neighborhood, subscriptions } from '../../database/schemas';
import { SensorStatus } from '../../entities/sensor/schema';
import { FakeSensorRepository } from '../../entities/sensor/repository';

const sensorRepository = new FakeSensorRepository();

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
      let isConfirmed = false;
      const find = await OccurrenceRepository.find(type, latitude, longitude);
      if (find.length > 0) {
        return find[0];
      }
      if (!confirmed) {
        const check = await sensorRepository.check(
          Number(latitude),
          Number(longitude),
        );
        if (check) {
          isConfirmed = true;
        }
      } else {
        isConfirmed = true;
      }
      const result = await db.insert(occurences).values({
        type,
        description,
        neighborhoodId,
        latitude,
        longitude,
        confirmed: isConfirmed,
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
        .innerJoin(
          neighborhood,
          eq(subscriptions.neighborhoodId, neighborhood.id),
        )
        .where(
          and(eq(subscriptions.userId, userId), eq(occurences.confirmed, true)),
        )
        .orderBy(occurences.createdAt);
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
        .innerJoin(neighborhood, eq(occurences.neighborhoodId, neighborhood.id))
        .where(eq(occurences.confirmed, false));
    } catch (error) {
      throw error;
    }
  };

  static listApproved = async () => {
    try {
      const result = await db
        .select()
        .from(occurences)
        .innerJoin(neighborhood, eq(occurences.neighborhoodId, neighborhood.id))
        .where(eq(occurences.confirmed, true));
      return result.map((occ) => ({
        occurence: occ.occurences,
        neighborhood: occ.neighborhood,
        sensor: sensorRepository.getSensorData(occ.neighborhood.id),
      }));
    } catch (error) {
      throw error;
    }
  };

  static countPerZone = async () => {
    try {
      return await db
        .select({
          zone: neighborhood.zone,
          count: sql<number>`cast(count(${occurences.id}) as int)`,
        })
        .from(occurences)
        .innerJoin(neighborhood, eq(occurences.neighborhoodId, neighborhood.id))
        .where(eq(occurences.confirmed, true))
        .groupBy(neighborhood.zone);
    } catch (error) {
      throw error;
    }
  };

  static countPerNeighborhood = async () => {
    try {
      return await db
        .select({
          neighborhood: neighborhood.name,
          count: sql<number>`cast(count(${occurences.id}) as int)`,
        })
        .from(occurences)
        .innerJoin(neighborhood, eq(occurences.neighborhoodId, neighborhood.id))
        .where(eq(occurences.confirmed, true))
        .groupBy(neighborhood.name);
    } catch (error) {
      throw error;
    }
  };

  static countPerType = async () => {
    try {
      return await db
        .select({
          type: occurences.type,
          count: sql<number>`cast(count(${occurences.id}) as int)`,
        })
        .from(occurences)
        .where(eq(occurences.confirmed, true))
        .groupBy(occurences.type);
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

  static delete = async (id: string) => {
    try {
      return await db
        .delete(occurences)
        .where(eq(occurences.id, id))
        .returning();
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
