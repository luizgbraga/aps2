import { occurences } from './schema';
import { db } from '../../database';

export class OccurrenceRepository {
  static add = async (
    description: string,
    neighborhoodId: string,
    latitude: string,
    longitude: string,
  ) => {
    try {
      return await db
        .insert(occurences)
        .values({ description, neighborhoodId, latitude, longitude });
    } catch (error) {
      throw error;
    }
  };
}
