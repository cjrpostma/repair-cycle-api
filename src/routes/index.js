import { Router } from 'express';
import userRouter from './users';

const router = Router();

router.use('/users', userRouter);

router.get('/', (req, res) =>
  res.status(200).json({ message: 'Hello World!' })
);

export default router;
