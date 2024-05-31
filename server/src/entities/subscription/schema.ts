import {
  pgTable,
  uuid,
  timestamp,
  primaryKey,
  integer,
} from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';
import { neighborhood } from '../../entities/neighborhood/schema';

export const subscriptions = pgTable(
  'subscriptions',
  {
    userId: uuid('user_id').notNull(),
    neighborhoodId: uuid('neighborhood_id')
      .references(() => neighborhood.id)
      .notNull(),
    unread: integer('unread').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.neighborhoodId] }),
  }),
);

export type Subscriptions = InferSelectModel<typeof subscriptions>;
