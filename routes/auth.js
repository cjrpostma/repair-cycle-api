const router = require('express').Router();
const { check } = require('express-validator');
const authorization = require('../middleware/authorization');

// POST => /api/v0/auth/register
router.post(
  '/register',
  [
    check('email').isEmail().normalizeEmail(),
    check('name').not().isEmpty().trim().escape(),
    check('password').isLength({ min: 6 }),
  ],
  require('../controllers/auth').registerUser
);

// POST => /api/v0/auth/login
router.post(
  '/login',
  [check('email').isEmail().normalizeEmail()],
  require('../controllers/auth').loginUser
);

// GET => /auth/private
router.get('/private', authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error.');
  }
});

module.exports = router;
