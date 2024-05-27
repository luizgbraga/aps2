import { neighborhood } from './schema';
import { db } from '../../database';
import { eq, ne, sql } from 'drizzle-orm';
import { neighborhoods } from './all';

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
}
