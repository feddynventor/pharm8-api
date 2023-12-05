import type { Config } from "drizzle-kit"
import dotenv from 'dotenv'; 
dotenv.config();  // Load environment variables from .env file 

// https://orm.drizzle.team/kit-docs/conf

export default {
  schema: './src/core/database/schema.ts',
  out: './migrations',
  dbCredentials: {
    //drizzle-toolkit entrypoint
    // connectionString: "postgres://admin:admin@database.deploy:5432/fastify",
    connectionString: 
      "postgres://admin:admin@"
      +(process.env.API_PORT?process.env.PG_HOST:"database.deploy")  //if set, working outside of docker
      +":5432/"+(process.env.PG_DBNAME?process.env.PG_DBNAME:"fastify"),
  },
  driver: "pg",
} satisfies Config;