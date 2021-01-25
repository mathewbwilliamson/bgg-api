import mongoose from 'mongoose';
import { dbConnectionString } from '../utils/envValues';
import { BggUser } from './BggUser';
 
const connectDb = () => {
  return mongoose.connect(dbConnectionString, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
};
 
const models = { BggUser };
 
export { connectDb };
 
export default models;