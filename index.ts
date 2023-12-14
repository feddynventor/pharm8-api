import { createServer } from "./src/implementation/server";
import dotenv from 'dotenv'; 
dotenv.config();  // Load environment variables from .env file 

process.env['APP_ROOT'] = __dirname;

(async ()=>{
    console.log({
        port: process.env.API_PORT,
        database: process.env.PG_HOST+':'+process.env.PG_PORT+'/'+process.env.PG_DATABASE,
        basePath: process.env.BASEPATH
    })
    if (process.env.API_PORT)
        (await createServer(process.env.BASEPATH || '/')).listen({port: parseInt(process.env.API_PORT), host: "0.0.0.0"})
    else
        (await createServer(process.env.BASEPATH || '/')).listen({port: 80, host: "0.0.0.0"})
})()