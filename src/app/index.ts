import express from 'express';
import dotenv from 'dotenv';


import connectMongoDB from '../database/connect.mongo.db';

dotenv.config();
const app = express();

//connecti to database
try{
    connectMongoDB();
}catch(error){
  console.error('MongoDB connection failed', error);
  process.exit(1);
}











export default app;