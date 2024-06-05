import { OccurrenceType, Occurrence, occurrences } from './schema';
import { db } from '../../database';
import { and, eq, sql } from 'drizzle-orm';
import { FakeSubscriptionRepository } from '../../entities/subscription/repository';
import {
  Neighborhood,
  Subscription,
  neighborhood,
  subscriptions,
} from '../../database/schemas';
import { FakeSensorRepository } from '../../entities/sensor/repository';
import { SensorStatus } from '../../entities/sensor/schema';
import { repositories } from '../../entities/factory';

const EARTH_RADIUS = 6371000;
const sensorRepository = new FakeSensorRepository();

export interface IOccurrenceRepository {
  findNearOccurrences(
    type: OccurrenceType,
    latitude: string,
    longitude: string,
    distance: number,
  ): Promise<Occurrence[]>;
  add(
    type: OccurrenceType,
    description: string,
    neighborhoodId: string,
    latitude: string,
    longitude: string,
    radius: number,
    confirmed: boolean,
  ): Promise<Occurrence[]>;
  list(
    userId: string,
  ): Promise<{ subscriptions: Subscription; occurrences: Occurrence }[]>;
  confirm(id: string): Promise<void>;
  listToApprove(): Promise<
    { neighborhood: Neighborhood; occurrences: Occurrence }[]
  >;
  delete(id: string): Promise<Occurrence[]>;
  updateOccurrencesFromSensorsStatuses(statuses: SensorStatus[]): Promise<void>;
}

export class OccurrenceRepository implements IOccurrenceRepository {
  findNearOccurrences = async (
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

  add = async (
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
      const find = await this.findNearOccurrences(
        type,
        latitude,
        longitude,
        100,
      );
      if (find.length > 0) {
        return find;
      }
      console.log(confirmed);
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
        repositories.subscription.incrementUnread(neighborhoodId);
      }
      if (result[0].confirmed) {
        const affectedRoutedIds =
          await repositories.affect.updateAffectedRoutes(
            result[0].id,
            Number(result[0].latitude),
            Number(result[0].longitude),
            result[0].radius,
          );
        affectedRoutedIds.forEach(async (route) => {
          await repositories.messages.add(route.route_id, 'TODO2');
        });
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  all = async () => {
    try {
      return await db
        .select()
        .from(occurrences)
        .where(eq(occurrences.confirmed, true));
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
      repositories.subscription.setUnreadToZero(userId);
      return result;
    } catch (error) {
      throw error;
    }
  };

  listToApprove = async () => {
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
        .innerJoin(
          neighborhood,
          eq(occurrences.neighborhoodId, neighborhood.id),
        )
        .where(and(
          eq(occurrences.confirmed, true),
          eq(occurrences.active, true)
        ));
      return result.map((occ) => ({
        occurrence: occ.occurrences,
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
        .innerJoin(
          neighborhood,
          eq(occurrences.neighborhoodId, neighborhood.id),
        )
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
        .innerJoin(
          neighborhood,
          eq(occurrences.neighborhoodId, neighborhood.id),
        )
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

  confirm = async (id: string) => {
    try {
      const updated = await db
        .update(occurrences)
        .set({ confirmed: true })
        .where(eq(occurrences.id, id))
        .returning();
      updated.forEach(async (occurrence) => {
        repositories.subscription.incrementUnread(occurrence.neighborhoodId);
        const affectedRoutedIds =
          await repositories.affect.updateAffectedRoutes(
            occurrence.id,
            Number(occurrence.latitude),
            Number(occurrence.longitude),
            occurrence.radius,
          );
        affectedRoutedIds.forEach(async (route) => {
          await repositories.messages.add(route.route_id, 'TODO');
        });
      });
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: string) => {
    try {
      return await db
        .delete(occurrences)
        .where(eq(occurrences.id, id))
        .returning();
    } catch (error) {
      throw error;
    }
  };

  stopOccurrence = async (id: string) => {
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

  updateOccurrencesFromSensorsStatuses = async (statuses: SensorStatus[]) => {
    for (const status of statuses) {
      const alreadyHasFlooding = await this.findNearOccurrences(
        'flooding',
        status.sensor.latitude.toString(),
        status.sensor.longitude.toString(),
        status.sensor.radius,
      );
      const alreadyHasLandslide = await this.findNearOccurrences(
        'landslide',
        status.sensor.latitude.toString(),
        status.sensor.longitude.toString(),
        status.sensor.radius,
      );
      const alreadyHasCongestion = await this.findNearOccurrences(
        'congestion',
        status.sensor.latitude.toString(),
        status.sensor.longitude.toString(),
        status.sensor.radius,
      );
      if (status.state.flooding > 0 && !alreadyHasFlooding.length) {
        await this.add(
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
          await this.stopOccurrence(occurrence.id);
          const affectedRoutedIds = await repositories.affect.getAffectedRoutes(
            occurrence.id,
          );
          affectedRoutedIds.forEach(async (route) => {
            await repositories.messages.add(route.route_id, 'TODO3');
          });
        }
      }
      if (status.state.landslide > 0 && !alreadyHasLandslide.length) {
        await this.add(
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
          await this.stopOccurrence(occurrence.id);
          const affectedRoutedIds = await repositories.affect.getAffectedRoutes(
            occurrence.id,
          );
          affectedRoutedIds.forEach(async (route) => {
            await repositories.messages.add(route.route_id, 'TODO3');
          });
        }
      }
      if (status.state.congestion > 0 && !alreadyHasCongestion.length) {
        await this.add(
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
          await this.stopOccurrence(occurrence.id);
          const affectedRoutedIds = await repositories.affect.getAffectedRoutes(
            occurrence.id,
          );
          affectedRoutedIds.forEach(async (route) => {
            await repositories.messages.add(route.route_id, 'TODO3');
          });
        }
      }
    }
  };
}

export class FakeOccurrenceRepository implements IOccurrenceRepository {
  fakeOccurrences: Occurrence[];
  fakeSubscriptions: Subscription[];

  constructor(
    initialFakeOccurrences: Occurrence[],
    initialFakeSubscriptions: Subscription[],
  ) {
    this.fakeOccurrences = initialFakeOccurrences;
    this.fakeSubscriptions = initialFakeSubscriptions;
  }

  findNearOccurrences = async (
    type: OccurrenceType,
    latitude: string,
    longitude: string,
    distance: number,
  ) => {
    return this.fakeOccurrences.filter((occurrence) => {
      if (occurrence.type !== type) {
        return false;
      }
      const distanceBetween = Math.acos(
        Math.sin(parseFloat(latitude)) * Math.sin(Number(occurrence.latitude)) +
          Math.cos(parseFloat(latitude)) *
            Math.cos(Number(occurrence.latitude)) *
            Math.cos(parseFloat(longitude) - Number(occurrence.longitude)),
      );
      return distanceBetween * EARTH_RADIUS < distance;
    });
  };

  add = async (
    type: OccurrenceType,
    description: string,
    neighborhoodId: string,
    latitude: string,
    longitude: string,
    radius: number,
    confirmed: boolean,
  ) => {
    try {
      const occurrence = {
        id: '1234',
        neighborhoodId: neighborhoodId,
        createdAt: new Date(),
        description: description,
        type: type,
        latitude: latitude,
        longitude: longitude,
        confirmed: false,
        updatedAt: new Date(),
        radius: radius,
        active: true,
      };
      this.fakeOccurrences.push(occurrence);
      return [occurrence];
    } catch (error) {
      throw error;
    }
  };

  list = async (userId: string) => {
    const joinResult: {
      subscriptions: Subscription;
      occurrences: Occurrence;
    }[] = [];
    this.fakeSubscriptions.forEach((subscriptionElement) => {
      this.fakeOccurrences.forEach((occurrenceElement) => {
        if (
          subscriptionElement.userId === userId &&
          occurrenceElement.id === userId &&
          occurrenceElement.confirmed === true
        ) {
          joinResult.push({
            subscriptions: subscriptionElement,
            occurrences: occurrenceElement,
          });
        }
      });
    });
    return joinResult;
  };

  confirm = async (id: string) => {
    const modifiedOccurrences = [] as Occurrence[];
    this.fakeOccurrences.forEach((element) => {
      if (element.id === id) {
        element.confirmed = true;
        modifiedOccurrences.push(element);
      }
    });
    const initialFakeSubscription = new FakeSubscriptionRepository(
      this.fakeSubscriptions,
      [],
    );
    modifiedOccurrences.forEach((element) => {
      initialFakeSubscription.incrementUnread(element.neighborhoodId);
    });
  };

  async all(): Promise<Occurrence[]> {
    throw new Error('Not Implemented');
  }

  async listToApprove(): Promise<
    { neighborhood: Neighborhood; occurrences: Occurrence }[]
  > {
    throw new Error('Not Implemented');
  }

  async delete(id: string): Promise<Occurrence[]> {
    throw new Error('Not Implemented');
  }

  async updateOccurrencesFromSensorsStatuses(
    statuses: SensorStatus[],
  ): Promise<void> {
    throw new Error('Not Implemented');
  }

  async find(
    type: OccurrenceType,
    latitude: string,
    longitude: string,
  ): Promise<Occurrence[]> {
    throw new Error('Not Implemented');
  }
}
