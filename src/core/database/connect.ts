import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "../database/schema"

import dotenv from 'dotenv'; 
dotenv.config();  // Load environment variables from .env file 

// https://orm.drizzle.team/docs/quick-postgresql/node-postgres
const client = new Client({
  host: process.env.API_PORT?process.env.PG_HOST:"database.deploy",
  port: 5432,
  user: "admin",
  password: "admin",
  database: process.env.PG_DBNAME,
});
 
client.connect();
export const db = drizzle(client, { schema });