import dotenv from 'dotenv';

dotenv.config();

export const jwtSecret = process.env.JWT_SECRET;
export const isProduction = process.env.NODE_ENV === 'production';
