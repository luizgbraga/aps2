import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import path from 'path';

export const migration = async (): Promise<void> => {
  await migrate(db, {
    migrationsFolder: path.join(__dirname, 'migrations'),
  });
};

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('Missing DATABASE_URL environment variable');
}

const pool = new Pool({ connectionString });
export const db = drizzle(pool);
migration();
