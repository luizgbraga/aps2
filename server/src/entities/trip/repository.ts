import { trips } from './schema';
import { db } from '../../database';
import { AddNewTripError, GetAllTripsError } from './errors';

export class TripRepository {
  static getAllTrips = async () => {
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
  static addNewTrip = async (
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
