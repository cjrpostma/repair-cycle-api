import { Router } from 'express';
import pool from '../db';
import verifyJwt from '../middleware/verifyJwt';

const router = Router();

router.get('/', verifyJwt, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT user_email, user_id, user_name FROM users WHERE user_id = $1',
      [req.user.id]
    );

    res.json(user.rows[0]);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
