import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';
import { routes } from '../../entities/route/schema';

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  text: varchar('text', { length: 255 }).notNull(),
  routeId: uuid('route_id')
    .references(() => routes.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Message = InferSelectModel<typeof messages>;
