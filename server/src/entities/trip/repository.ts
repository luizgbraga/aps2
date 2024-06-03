import { trips, Trips } from './schema';
import { db } from '../../database';
import { AddNewTripError, GetAllTripsError } from './errors';

export interface ITripRepository {
  getAllTrips: () => Promise<any>;
  addNewTrip: (id: string, route_id: string, headsign: string, direction: number) => Promise<any>;
}

export class TripRepository implements ITripRepository {
  getAllTrips = async () => {
    try {
      const result = await db.select().from(trips);
      if (result.length === 0) {
        throw new GetAllTripsError('NO TRIPS REGISTERED');
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  addNewTrip = async (
    id: string,
    route_id: string,
    headsign: string,
    direction: number,
  ) => {
    try {
      const result = await db
        .insert(trips)
        .values({
          id: id,
          route_id: route_id,
          headsign: headsign,
          direction: direction,
        })
        .returning();
      if (result.length === 0) {
        throw new AddNewTripError('TRIP NOT ADDED');
      }
      return result;
    } catch (error) {
      throw error;
    }
  };
}

export class FakeTripRepository implements ITripRepository {
  trips: Trips[] = [];

  getAllTrips = async () => {
    if (this.trips.length === 0) {
      throw new GetAllTripsError('NO TRIPS REGISTERED');
    }
    return this.trips;
  };

  addNewTrip = async (
    id: string,
    route_id: string,
    headsign: string,
    direction: number,
  ) => {
    const newTrip = { id, route_id, headsign, direction };
    this.trips.push(newTrip);
    if (this.trips.find(trip => trip.id === id)) {
      return [newTrip];
    } else {
      throw new AddNewTripError('TRIP NOT ADDED');
    }
  };
}
