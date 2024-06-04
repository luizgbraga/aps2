import { messages } from './schema';
import { db } from '../../database';
import { eq } from 'drizzle-orm';

export class MessagesRepository {
  list = async (routeId: string) => {
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

  add = async (routeId: string, text: string) => {
    try {
      return await db.insert(messages).values({ routeId, text }).returning();
    } catch (error) {
      throw error;
    }
  };
}
