import { routes } from './schema';
import { db } from '../../database';
import { AddNewRouteError, GetAllRoutesError } from './errors';

export class RouteRepository {
  static getAllRoutes = async () => {
    try {
      const result = await db.select().from(routes);
      if (result.length === 0) {
        throw new GetAllRoutesError('NO ROUTES REGISTERED');
      }
      return result;
    } catch (error) {
      throw error;
    }
  };
  static addNewRoute = async (
    id: string,
    short_name: string,
    long_name: string,
    desc: string,
    type: number,
    color: string,
    text_color: string,
  ) => {
    try {
      const result = await db
        .insert(routes)
        .values({
          id: id,
          short_name: short_name,
          long_name: long_name,
          desc: desc,
          type: type,
          color: color,
          text_color: text_color,
        })
        .returning();
      if (result.length === 0) {
        throw new AddNewRouteError('ROUTE NOT ADDED');
      }
      return result;
    } catch (error) {
      throw error;
    }
  };
}
