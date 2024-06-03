import { neighborhood } from './schema';
import { db } from '../../database';
import { neighborhoods } from './all';
import { FindError } from './errors';

export class NeighborhoodRepository {
  static fill = async () => {
    try {
      const all = neighborhoods.map((neighborhood) => ({
        name: neighborhood.name,
        zone: neighborhood.zone,
      }));
      return await db.insert(neighborhood).values(all);
    } catch (error) {
      throw error;
    }
  };

  static list = async () => {
    try {
      return await db.select().from(neighborhood);
    } catch (error) {
      throw error;
    }
  };

  static getFromName = async (name: string) => {
    try {
      const result = await db
        .select()
        .from(neighborhood)
        .where(eq(neighborhood.name, name));
      if (result.length === 0) {
        throw new FindError('NEIGHBORHOOD_NOT_FOUND');
      }
      return result[0];
    } catch (error) {
      throw error;
    }
  };
}
