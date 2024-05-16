import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';

export const admins = pgTable('admins', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('cpf', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
});

export type Admin = InferSelectModel<typeof admins>;
