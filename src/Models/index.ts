import mongoose from 'mongoose';
import { dbConnectionString } from '../../utils/envValues';
import { BggUser } from './BggUser';
import { BggBoardgameItem } from './BggBoardgameItem';

const connectDb = () => {
    return mongoose.connect(dbConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
};

const models = { BggUser, BggBoardgameItem };

export { connectDb };

export default models;
