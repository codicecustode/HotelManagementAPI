import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import connectMongoDB from '../database/connect.mongo.db';
import { authRouter } from '../routes/auth.route';
dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//connecti to database
try{
    connectMongoDB();
}catch(error){
  console.error('MongoDB connection failed', error);
  process.exit(1);
}


//set API routes
app.use('/api/v1', authRouter);











export default app;