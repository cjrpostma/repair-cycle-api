const router = require('express').Router();
const { check } = require('express-validator');

// POST => /api/v0/auth/register
router.post(
  '/register',
  [
    check('email').isEmail().normalizeEmail(),
    check('name').not().isEmpty().trim().escape(),
    check('password').isLength({ min: 6 }),
  ],
  require('../controllers/user').registerUser
);

// POST => /api/v0/auth/login
router.post(
  '/login',
  [check('email').isEmail().normalizeEmail()],
  require('../controllers/user').loginUser
);

module.exports = router;
