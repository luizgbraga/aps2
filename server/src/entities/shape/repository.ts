import { shapes, alt_shapes } from './schema';
import { db } from '../../database';
import { eq, count } from 'drizzle-orm';
import { AddNewShapeError, GetShapeError } from './errors';

export class ShapeRepository {
  static getShape = async (trip_id: string) => {
    try {
      const result_alt = await db
        .select()
        .from(alt_shapes)
        .where(eq(shapes.trip_id, trip_id))
        .orderBy(shapes.pt_sequence);
      if (result_alt.length === 0) {
        const result = await db
        .select()
        .from(shapes)
        .where(eq(shapes.trip_id, trip_id))
        .orderBy(shapes.pt_sequence);
        if (result_alt.length === 0){
          throw new GetShapeError('NO SHAPES REGISTERED');
        }
        return result;
      }
      return result_alt;
    } catch (error) {
      throw error;
    }
  };
  static addNewShape = async (
    trip_id: string,
    pt_sequence: number,
    pt_lat: number,
    pt_lon: number,
    dist_traveled: number,
    alt : boolean
  ) => {
    try {
      const table = alt ? alt_shapes : shapes;
      const result = await db
        .insert(table)
        .values({
          trip_id: trip_id,
          pt_sequence: pt_sequence,
          pt_lat: pt_lat,
          pt_lon: pt_lon,
          dist_traveled: dist_traveled,
        })
        .returning();
      if (result.length === 0) {
        throw new AddNewShapeError('SHAPE NOT ADDED');
      }
      return result;
    } catch (error) {
      throw error;
    }
  };
}
