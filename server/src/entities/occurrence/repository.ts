import { OccurenceType, Occurences as Occurrences, occurences } from './schema';
import { db } from '../../database';
import { and, eq } from 'drizzle-orm';
import { SubscriptionRepository, FakeSubscriptionRepository } from '../../entities/subscription/repository';
import { Neighborhood, Subscriptions, neighborhood, subscriptions } from '../../database/schemas';
import { SensorStatus } from '../../entities/sensor/schema';
import { FakeSensorRepository } from '../../entities/sensor/repository';


const sensorRepository = new FakeSensorRepository();

export interface IOccurrenceRepository {
  find(
    type: OccurenceType,
    latitude: string,
    longitude: string
  ): Promise<Occurrences[]>;
  create(
    type: OccurenceType,
    description: string,
    neighborhoodId: string,
    latitude: string,
    longitude: string,
    radius: number,
    confirmed: boolean
  ): Promise<Occurrences[]>;
  all(): Promise<Occurrences[]>;
  list(
    userId: string,
  ): Promise<{ subscriptions: Subscriptions; occurences: Occurrences }[]>;
  confirm(id: string): Promise<void>;
  listToApprove(): Promise<{neighborhood: Neighborhood; occurences: Occurrences}[]>;
  delete(id: string): Promise<Occurrences[]>;
  addOccurrencesFromSensorsStatuses(statuses: SensorStatus[]): Promise<void>;
}

export class OccurrenceRepository implements IOccurrenceRepository {
  subscriptionRepository = new SubscriptionRepository();

  find = async (
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

  create = async (
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
      const find = await this.find(type, latitude, longitude);
      if (find.length > 0) {
        return find;
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
      }).returning();
      if (confirmed) {
        this.subscriptionRepository.incrementUnread(neighborhoodId);
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
        .from(occurences)
        .where(eq(occurences.confirmed, true));
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

  listToApprove = async () => {
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

  confirm = async (id: string) => {
    try {
      const updated = await db
        .update(occurences)
        .set({ confirmed: true })
        .where(eq(occurences.id, id))
        .returning();
      updated.forEach((occurence) => {
        this.subscriptionRepository.incrementUnread(occurence.neighborhoodId);
      });
    } catch (error) {
      throw error;
    }
  };

  delete = async (id: string) => {
    try {
      return await db
        .delete(occurences)
        .where(eq(occurences.id, id))
        .returning();
    } catch (error) {
      throw error;
    }
  };

  addOccurrencesFromSensorsStatuses = async (
    statuses: SensorStatus[],
  ) => {
    for (const status of statuses) {
      if (status.state.flood > 0) {
        await this.create(
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
        await this.create(
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
        await this.create(
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

export class FakeOccurrenceRepository implements IOccurrenceRepository {
  fakeOccurrences: Occurrences[];
  fakeSubscriptions: Subscriptions[];

  constructor(
    initialFakeOccurrences: Occurrences[],
    initialFakeSubscriptions: Subscriptions[],
  ) {
    this.fakeOccurrences = initialFakeOccurrences;
    this.fakeSubscriptions = initialFakeSubscriptions;
  }

  create = async (
    type: OccurenceType,
    description: string,
    neighborhoodId: string,
    latitude: string,
    longitude: string,
    radius: number,
    isConfirmed: boolean
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
        isConfirmed: isConfirmed
      };
      this.fakeOccurrences.push(occurrence);
      return [occurrence];
    } catch (error) {
      throw error;
    }
  };

  list = async (userId: string) => {
    const joinResult: {
      subscriptions: Subscriptions;
      occurences: Occurrences;
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
            occurences: occurrenceElement,
          });
        }
      });
    });
    return joinResult;
  };

  confirm = async (id: string) => {
    const modifiedOccurrences = [] as Occurrences[];
    this.fakeOccurrences.forEach((element) => {
      if (element.id === id) {
        element.confirmed = true;
        modifiedOccurrences.push(element);
      }
    });
    const initialFakeSubscription = new FakeSubscriptionRepository(
      this.fakeSubscriptions,
    );
    modifiedOccurrences.forEach((element) => {
      initialFakeSubscription.incrementUnread(element.neighborhoodId);
    });
  };

  async all(): Promise<Occurrences[]> {
    throw new Error("Not Implemented");
  }

  async listToApprove(): Promise<{neighborhood: Neighborhood; occurences: Occurrences}[]> {
    throw new Error("Not Implemented");
  }

  async delete(id: string): Promise<Occurrences[]> {
    throw new Error("Not Implemented");
  }

  async addOccurrencesFromSensorsStatuses(statuses: SensorStatus[]): Promise<void> {
    throw new Error("Not Implemented");
  }

  async find(type: OccurenceType, latitude: string, longitude: string): Promise<Occurrences[]> {
    throw new Error("Not Implemented");
  }
}
