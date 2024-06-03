import { trips, Trips } from './schema';
import { db } from '../../database';
import { AddNewTripError, GetAllTripsError } from './errors';

export interface ITripRepository {
  getAllTrips: () => Promise<any>;
  addNewTrip: (
    id: string,
    route_id: string,
    headsign: string,
    direction: number,
  ) => Promise<any>;
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
