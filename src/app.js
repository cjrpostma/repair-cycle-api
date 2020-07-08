import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import BaseRouter from './routes';

const app = express();

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// routes
app.use('/api/v1', BaseRouter);

module.exports = app;
