import 'reflect-metadata'; // this shim is required
import bodyParser from 'body-parser';
import { NextFunction } from 'express';
import { createExpressServer } from 'routing-controllers';
import { CollectionController } from './src/Controllers/CollectionController';
import dotenv from 'dotenv';
import { databaseConnection } from './utils/databaseConnect';
import { CollectionRepo } from './src/Repositories/CollectionRepo';

dotenv.config();

const port = process.env.PORT || '8000';

// creates express app, registers all controller routes and returns you express app instance
const app = createExpressServer({
    cors: true,
    controllers: [CollectionController], // we specify controllers we want to use
});

export const collectionRepo = new CollectionRepo();

app.use(bodyParser.urlencoded({ extended: true }));

app.use((err: Error, req: Express.Request, res: any, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    console.log('\x1b[43m%s \x1b[0m', 'ERROR', err);
});

databaseConnection
    .then(() => app.listen(port, () => console.log(`App listening on port ${port}!`)))
    .catch((err) => {
        console.error('\x1b[41m%s \x1b[0m', '[matt] err', err);
    });
