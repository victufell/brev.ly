import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';

config();

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, {
  max: process.env.NODE_ENV === 'production' ? 20 : 5,
  idle_timeout: 20,
  connect_timeout: 60,
  
  prepare: false,
  transform: postgres.camel,
  
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
  
  onnotice: process.env.NODE_ENV === 'development' ? console.log : () => {},
  debug: process.env.NODE_ENV === 'development',
  
  connection: {
    options: `--application_name=brev.ly`,
  },
});

export const db = drizzle(client); 