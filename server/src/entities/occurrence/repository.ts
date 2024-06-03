import { OccurenceType, Occurences, occurences } from './schema';
import { db } from '../../database';
import { and, eq } from 'drizzle-orm';
import {
  FakeSubscriptionRepository,
  SubscriptionRepository,
} from '../../entities/subscription/repository';
import { Subscriptions, subscriptions } from '../../database/schemas';

export interface IOccurrenceRepository {
  add(
    type: OccurenceType,
    description: string,
    neighborhoodId: string,
    latitude: string,
    longitude: string,
  ): Promise<Occurences[]>;
  list(
    userId: string,
  ): Promise<{ subscriptions: Subscriptions; occurences: Occurences }[]>;
  confirm(id: string): Promise<void>;
}

export class OccurrenceRepository implements IOccurrenceRepository {
  subscriptionRepository = new SubscriptionRepository();

  add = async (
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
        .insert(occurences)
        .values({ type, description, neighborhoodId, latitude, longitude })
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

export class FakeOccurrenceRepository implements IOccurrenceRepository {
  fakeOccurrences: Occurences[];
  fakeSubscriptions: Subscriptions[];

  constructor(
    initialFakeOccurrences: Occurences[],
    initialFakeSubscriptions: Subscriptions[],
  ) {
    this.fakeOccurrences = initialFakeOccurrences;
    this.fakeSubscriptions = initialFakeSubscriptions;
  }

  add = async (
    type: OccurenceType,
    description: string,
    neighborhoodId: string,
    latitude: string,
    longitude: string,
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
      occurences: Occurences;
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
    const modifiedOccurrences = [] as Occurences[];
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
}
