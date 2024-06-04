import { trips, Trip } from './schema';
import { db } from '../../database';
import { AddNewTripError, GetAllTripsError } from './errors';
import { eq } from 'drizzle-orm';

export class TripRepository {
  getTrips = async (route_id: string) => {
    try {
      let result = null;
      if (route_id == '*') {
        result = await db.select().from(trips);
      } else {
        result = await db
          .select()
          .from(trips)
          .where(eq(trips.route_id, route_id));
      }
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
