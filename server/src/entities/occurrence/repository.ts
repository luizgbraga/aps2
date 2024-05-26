import { OccurenceType, occurences } from './schema';
import { db } from '../../database';

export class OccurrenceRepository {
  static add = async (
    type: OccurenceType,
    description: string,
    neighborhoodId: string,
    latitude: string,
    longitude: string,
  ) => {
    try {
      return await db
        .insert(occurences)
        .values({ type, description, neighborhoodId, latitude, longitude });
    } catch (error) {
      throw error;
    }
  };

  static list = async () => {
    try {
      return await db.select().from(occurences);
    } catch (error) {
      throw error;
    }
  };
}
