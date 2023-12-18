import { createServer } from "./src/implementation/server";
import dotenv from 'dotenv'; 
dotenv.config();  // Load environment variables from .env file 

process.env['APP_ROOT'] = __dirname.substring(0, __dirname.length-4);

(async ()=>{
    console.log({
        port: process.env.API_PORT || 80,
        database: process.env.PG_HOST+':5432/'+process.env.PG_DBNAME,
        basePath: process.env.BASEPATH
    })
    if (process.env.API_PORT)
        (await createServer(process.env.BASEPATH || '/')).listen({port: parseInt(process.env.API_PORT), host: "0.0.0.0"})
    else
        (await createServer(process.env.BASEPATH || '/')).listen({port: 80, host: "0.0.0.0"})
})()
