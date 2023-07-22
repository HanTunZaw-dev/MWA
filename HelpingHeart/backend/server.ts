import express, {NextFunction, Request, Response, json} from 'express';
import morgan from 'morgan';
import {join} from 'path';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import connectToDatabase from './db';
import authRouter from './auth/auth.router';
import { parseToken, verifyRequireToken } from './auth/auth.middleware';
import desiresRouter from './desires/desires.router';
import usersRouter from './users/users.router';
import { ErrorResponse } from './types/ErrorResponse';
import * as dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
dotenv.config();

app.disable('x-powered-by');

const logsFolderPath = join(__dirname, 'logs');
if (!existsSync(logsFolderPath)) { mkdirSync(logsFolderPath) };
const accessLogStream = createWriteStream(join(logsFolderPath, 'access.log'), {flags: 'a'});
app.use(morgan('combined', {stream: accessLogStream}));

app.use(json());
app.use(cors());

connectToDatabase();

app.use('/auth', authRouter);
app.use('/desires', parseToken, desiresRouter);
app.use('/users', parseToken, verifyRequireToken, usersRouter);

app.all('*', (req, res, next) => {
    next(new ErrorResponse("404 not found", 404))
});

app.use((error: ErrorResponse, req: Request, res: Response, next:NextFunction) => {
    res.json({success: false, data: error.message})
});

app.listen(process.env.PORT, () => console.log('Helping Heart server is listening on port: '+ process.env.PORT));

process.on('exit', ()=>{
    console.log('Disconnected MongoDB');
    mongoose.disconnect();
  })