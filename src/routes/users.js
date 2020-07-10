import { Router } from 'express';
import { check } from 'express-validator';
import verifyJwt from '../middleware/verifyJwt';
import { getUsers, loginUser, registerUser } from '../controllers/users';

const router = Router();

// Get all users
// GET /api/v1/users
router.get('/', verifyJwt, getUsers);

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
