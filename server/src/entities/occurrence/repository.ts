import { OccurrenceType, occurrences } from './schema';
import { db } from '../../database';
import { and, eq, sql } from 'drizzle-orm';
import { SubscriptionRepository } from '../../entities/subscription/repository';
import { neighborhood, subscriptions } from '../../database/schemas';
import { SensorStatus } from '../../entities/sensor/schema';
import { FakeSensorRepository } from '../../entities/sensor/repository';
import { AffectRepository } from '../../entities/affect/repository';
import { MessagesRepository } from '../../entities/messages/repository';

const EARTH_RADIUS = 6371000;
const sensorRepository = new FakeSensorRepository();

export class OccurrenceRepository {
  static findNearOccurrences = async (
    type: OccurrenceType,
    latitude: string,
    longitude: string,
    distance: number,
  ) => {
    try {
      const allOccurrences = await db.select().from(occurrences);
      return allOccurrences.filter((occurrence) => {
        if (occurrence.type !== type) {
          return false;
        }
        const distanceBetween = Math.acos(
          Math.sin(parseFloat(latitude)) *
            Math.sin(Number(occurrence.latitude)) +
            Math.cos(parseFloat(latitude)) *
              Math.cos(Number(occurrence.latitude)) *
              Math.cos(parseFloat(longitude) - Number(occurrence.longitude)),
        );
        return distanceBetween * EARTH_RADIUS < distance;
      });
    } catch (error) {
      throw error;
    }
  };

  static create = async (
    type: OccurrenceType,
    description: string,
    neighborhoodId: string,
    latitude: string,
    longitude: string,
    radius: number,
    confirmed: boolean,
  ) => {
    try {
      let isConfirmed = false;
      const find = await OccurrenceRepository.findNearOccurrences(
        type,
        latitude,
        longitude,
        100,
      );
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
      const result = await db
        .insert(occurrences)
        .values({
          type,
          description,
          neighborhoodId,
          latitude,
          longitude,
          confirmed: isConfirmed,
          radius,
        })
        .returning();
      if (confirmed) {
        SubscriptionRepository.incrementUnread(neighborhoodId);
      }
      if (result[0].confirmed) {
        const affectedRoutedIds = await AffectRepository.updateAffectedRoutes(
          result[0].id,
          Number(result[0].latitude),
          Number(result[0].longitude),
          result[0].radius,
        );
        affectedRoutedIds.forEach(async (route) => {
          await MessagesRepository.add(route.route_id, 'TODO2');
        });
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
        .from(occurrences)
        .where(eq(occurrences.confirmed, true));
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
          occurrences,
          eq(subscriptions.neighborhoodId, occurrences.neighborhoodId),
        )
        .innerJoin(
          neighborhood,
          eq(subscriptions.neighborhoodId, neighborhood.id),
        )
        .where(
          and(
            eq(subscriptions.userId, userId),
            eq(occurrences.confirmed, true),
          ),
        )
        .orderBy(occurrences.createdAt);
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
        .from(occurrences)
        .innerJoin(
          neighborhood,
          eq(occurrences.neighborhoodId, neighborhood.id),
        )
        .where(eq(occurrences.confirmed, false));
    } catch (error) {
      throw error;
    }
  };

  static listApproved = async () => {
    try {
      const result = await db
        .select()
        .from(occurrences)
        .innerJoin(neighborhood, eq(occurrences.neighborhoodId, neighborhood.id))
        .where(eq(occurrences.confirmed, true));
      return result.map((occ) => ({
        occurence: occ.occurrences,
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
          count: sql<number>`cast(count(${occurrences.id}) as int)`,
        })
        .from(occurrences)
        .innerJoin(neighborhood, eq(occurrences.neighborhoodId, neighborhood.id))
        .where(eq(occurrences.confirmed, true))
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
          count: sql<number>`cast(count(${occurrences.id}) as int)`,
        })
        .from(occurrences)
        .innerJoin(neighborhood, eq(occurrences.neighborhoodId, neighborhood.id))
        .where(eq(occurrences.confirmed, true))
        .groupBy(neighborhood.name);
    } catch (error) {
      throw error;
    }
  };

  static countPerType = async () => {
    try {
      return await db
        .select({
          type: occurrences.type,
          count: sql<number>`cast(count(${occurrences.id}) as int)`,
        })
        .from(occurrences)
        .where(eq(occurrences.confirmed, true))
        .groupBy(occurrences.type);
    } catch (error) {
      throw error;
    }
  };

  static confirm = async (id: string) => {
    try {
      const updated = await db
        .update(occurrences)
        .set({ confirmed: true })
        .where(eq(occurrences.id, id))
        .returning();
      updated.forEach(async (occurrence) => {
        SubscriptionRepository.incrementUnread(occurrence.neighborhoodId);
        const affectedRoutedIds = await AffectRepository.updateAffectedRoutes(
          occurrence.id,
          Number(occurrence.latitude),
          Number(occurrence.longitude),
          occurrence.radius,
        );
        affectedRoutedIds.forEach(async (route) => {
          await MessagesRepository.add(route.route_id, 'TODO');
        });
      });
    } catch (error) {
      throw error;
    }
  };

  static delete = async (id: string) => {
    try {
      return await db
        .delete(occurrences)
        .where(eq(occurrences.id, id))
        .returning();
    } catch (error) {
      throw error;
    }
  };

  static stopOccurrence = async (id: string) => {
    try {
      return await db
        .update(occurrences)
        .set({ active: false })
        .where(eq(occurrences.id, id))
        .returning();
    } catch (error) {
      throw error;
    }
  };

  static updateOccurrencesFromSensorStatuses = async (
    statuses: SensorStatus[],
  ) => {
    for (const status of statuses) {
      const alreadyHasFlooding = await OccurrenceRepository.findNearOccurrences(
        'flooding',
        status.sensor.latitude.toString(),
        status.sensor.longitude.toString(),
        status.sensor.radius,
      );
      const alreadyHasLandslide =
        await OccurrenceRepository.findNearOccurrences(
          'landslide',
          status.sensor.latitude.toString(),
          status.sensor.longitude.toString(),
          status.sensor.radius,
        );
      const alreadyHasCongestion =
        await OccurrenceRepository.findNearOccurrences(
          'congestion',
          status.sensor.latitude.toString(),
          status.sensor.longitude.toString(),
          status.sensor.radius,
        );
      if (status.state.flooding > 0 && !alreadyHasFlooding.length) {
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
      if (status.state.flooding === 0 && alreadyHasFlooding.length) {
        for (const occurrence of alreadyHasFlooding) {
          await OccurrenceRepository.stopOccurrence(occurrence.id);
          const affectedRoutedIds = await AffectRepository.getAffectedRoutes(
            occurrence.id,
          );
          affectedRoutedIds.forEach(async (route) => {
            await MessagesRepository.add(route.route_id, 'TODO3');
          });
        }
      }
      if (status.state.landslide > 0 && !alreadyHasLandslide.length) {
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
      if (status.state.landslide === 0 && alreadyHasLandslide.length) {
        for (const occurrence of alreadyHasLandslide) {
          await OccurrenceRepository.stopOccurrence(occurrence.id);
          const affectedRoutedIds = await AffectRepository.getAffectedRoutes(
            occurrence.id,
          );
          affectedRoutedIds.forEach(async (route) => {
            await MessagesRepository.add(route.route_id, 'TODO3');
          });
        }
      }
      if (status.state.congestion > 0 && !alreadyHasCongestion.length) {
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
      if (status.state.congestion === 0 && alreadyHasCongestion.length) {
        for (const occurrence of alreadyHasCongestion) {
          await OccurrenceRepository.stopOccurrence(occurrence.id);
          const affectedRoutedIds = await AffectRepository.getAffectedRoutes(
            occurrence.id,
          );
          affectedRoutedIds.forEach(async (route) => {
            await MessagesRepository.add(route.route_id, 'TODO3');
          });
        }
      }
    }
  };
}
