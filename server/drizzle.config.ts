import type { Config } from 'drizzle-kit';

const config: Config = {
  schema: 'src/database/schemas.ts',
  out: 'src/database/migrations',
};

export default config;
