import * as dotenv from 'dotenv';
dotenv.config();

/**
 * @const Process
 */
declare const process : {
    env: {
        DB_HOST: string,
        DB_PORT: number,
        DB_DATABASE: string,
        DB_USER: string,
        DB_PASSWORD: string,
    }
}

/**
 * @export Database
 */
export default {
    hostname: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
}