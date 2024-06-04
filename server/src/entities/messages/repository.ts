import { messages } from './schema';
import { db } from '../../database';
import { eq, sql } from 'drizzle-orm';
import { routes } from '../../database/schemas';

export class MessagesRepository {
  static list = async (routeId: string) => {
    try {
      const result = await db
        .select()
        .from(messages)
        .where(eq(messages.routeId, routeId));
      return result;
    } catch (error) {
      throw error;
    }
  };

  static all = async () => {
    try {
      const result = await db
        .select()
        .from(messages)
        .innerJoin(
          routes,
          eq(routes.id, messages.routeId),
        );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static add = async (routeId: string, text: string) => {
    try {
      return await db.insert(messages).values({ routeId, text }).returning();
    } catch (error) {
      throw error;
    }
  };
}
