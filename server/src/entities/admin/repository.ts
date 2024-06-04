import { admins } from './schema';
import { db } from '../../database';
import { and, eq } from 'drizzle-orm';
import { LoginError } from './errors';
import { generate } from '../../utils/token';
import { compare, hash } from '../../utils/hash';

export class AdminRepository {
  login = async (username: string, password: string) => {
    try {
      const result = await db
        .select()
        .from(admins)
        .where(and(eq(admins.username, username)));
      if (result.length === 0) {
        throw new LoginError('ADMIN_NOT_REGISTERD');
      }
      const correctPassword = await compare(password, result[0].password);
      if (!correctPassword) {
        throw new LoginError('WRONG_PASSWORD');
      }
      const token = generate(result[0].id);
      return token;
    } catch (error) {
      throw error;
    }
  };

  me = async (userId: string) => {
    try {
      return await db.select().from(admins).where(eq(admins.id, userId));
    } catch (error) {
      throw error;
    }
  };
}
