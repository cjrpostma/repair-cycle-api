import { Router } from 'express';
import UserRouter from './users';

const router = Router();

router.use('/users', UserRouter);

export default router;
