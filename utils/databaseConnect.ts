import { join } from 'path';
import 'reflect-metadata';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { dbUrl } from './envValues';
const parentDir = join(__dirname, '..');

const connectionOpts: ConnectionOptions = {
    type: 'mongodb',
    url: dbUrl,
    entities: [`${parentDir}/**/*.entity.ts`],
    synchronize: true,
};

console.log('\x1b[42m%s \x1b[0m', '[matt] connectionOpts', connectionOpts);

export const databaseConnection: Promise<Connection> = createConnection(connectionOpts);
