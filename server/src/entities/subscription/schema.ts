import { pgTable, uuid, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';
import { neighborhood } from '../../entities/neighborhood/schema';

export const subscriptions = pgTable(
  'subscriptions',
  {
    userId: uuid('user_id').notNull(),
    neighborhoodId: uuid('bairro_id')
      .references(() => neighborhood.id)
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.neighborhoodId] }),
  }),
);

export type Subscriptions = InferSelectModel<typeof subscriptions>;
