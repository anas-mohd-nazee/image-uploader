import * as dotenv from 'dotenv';
dotenv.config();

/**
 * @const Process
 */
declare const process : {
    env: {
        APP_HOSTNAME: string,
        APP_PORT: number,
        APP_DEBUG_MODE: boolean
    }
}

/**
 * @export Application
 */
export default {
    hostname: process.env.APP_HOSTNAME,
    port: process.env.APP_PORT,
    debugMode: !!+process.env.APP_DEBUG_MODE
}