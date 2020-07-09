import { Router } from 'express';
import { check } from 'express-validator';
import { loginUser, registerUser } from '../controllers/users';

const router = Router();

// Register new user
// POST /api/v1/users/register
router.post(
  '/register',
  [
    check('email').isEmail().normalizeEmail(),
    check('name').not().isEmpty().trim().escape(),
    check('password').isLength({ min: 6 }),
  ],
  registerUser
);

// Log in current user
// POST /api/v1/users/login
router.post('/login', [check('email').isEmail().normalizeEmail()], loginUser);

export default router;
