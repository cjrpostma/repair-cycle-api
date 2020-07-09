import logger from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import indexRouter from './routes';
import { isProduction } from './settings';

const app = express();

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const origin = {
  origin: isProduction
    ? 'https://dashboard.heroku.com/apps/repair-cycle-api'
    : '*',
};
app.use(cors(origin));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 5 requests,
});
app.use(limiter);

// routes
app.use('/api/v1', indexRouter);

export default app;
