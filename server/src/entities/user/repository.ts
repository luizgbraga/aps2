import { users } from './schema';
import { db } from '../../database';
import { and, eq } from 'drizzle-orm';
import { FindError, LoginError } from './errors';

export class UserRepository {
  static me = async (userId: string) => {
    try {
      const result = await db.select().from(users).where(eq(users.id, userId));
      if (result.length === 0) {
        throw new FindError('USER_NOT_FOUND');
      }
      return result[0];
    } catch (error) {
      throw error;
    }
  };

  static register = async (cpf: string, password: string) => {
    try {
      return await db.insert(users).values({ cpf, password });
    } catch (error) {
      throw error;
    }
  };

  static login = async (cpf: string, password: string) => {
    try {
      const result = await db
        .select()
        .from(users)
        .where(and(eq(users.cpf, cpf), eq(users.password, password)));
      if (result.length === 0) {
        throw new LoginError('FAILED_TO_LOGIN');
      }
      return result[0];
    } catch (error) {
      throw error;
    }
  };
}
