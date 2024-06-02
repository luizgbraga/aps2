import { affect } from './schema';
import { db } from '../../database';
import { AddNewAffectError, GetAffectRoutesError} from './errors';
import { eq } from 'drizzle-orm';

export class RouteRepository {
  static getAffectedRoutes = async (
    occurence_id : string
  ) => {
    try {
      const result = await db.select(
        {route_id : affect.route_id}
      ).from(affect).
      where(eq(affect.occurence_id, occurence_id));
      if (result.length === 0) {
        throw new GetAffectRoutesError('NO ROUTES AFFECTED');
      }
      return result;
    } catch (error) {
      throw error;
    }
  };
  static affectNewRoute = async (
    occurence_id: string,
    route_id: string,
  ) => {
    try {
      const result = await db
        .insert(affect)
        .values({
          occurence_id: occurence_id,
          route_id: route_id,
        })
        .returning();
      if (result.length === 0) {
        throw new AddNewAffectError('AFFECT NOT ADDED');
      }
      return result;
    } catch (error) {
      throw error;
    }
  };
}
