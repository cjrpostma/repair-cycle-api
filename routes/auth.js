const router = require('express').Router();
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const jwtGenerator = require('../utils/jwtGenerator');
const pool = require('../db');
const authorization = require('../middleware/authorization');

// POST => /api/v0/auth/register
router.post(
  '/register',
  [
    check('email').isEmail().normalizeEmail(),
    check('name').not().isEmpty().trim().escape(),
    check('password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ message: 'Invalid inputs passed, please check your data.' });
    }

    const { email, name, password } = req.body;

    try {
      // check if user exists already
      const user = await pool.query(
        'SELECT * FROM users WHERE user_email = $1',
        [email]
      );

      if (user.rows.length !== 0) {
        return res.status(401).json({ message: 'User already exists.' });
      }
      // Bcrypt user password
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const bcryptPassword = await bcrypt.hash(password, salt);

      // enter the user into the database
      const newUser = await pool.query(
        'INSERT INTO users (user_email, user_name, user_password) VALUES ($1, $2, $3) RETURNING *',
        [email, name, bcryptPassword]
      );

      // generate jwt token
      const token = jwtGenerator(newUser.rows[0].user_id);
      res.json({ token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error.');
    }
  }
);

// POST => /api/v0/auth/login
router.post(
  '/login',
  [check('email').isEmail().normalizeEmail()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ message: 'Invalid inputs passed, please check your data.' });
    }

    const { email, password } = req.body;

    try {
      // check if user exists
      const user = await pool.query(
        'SELECT * FROM users WHERE user_email = $1',
        [email]
      );

      if (user.rows.length === 0) {
        return res
          .status(401)
          .json({ message: 'Email or password is invalid.' });
      }
      // check if incoming password matches password in db
      const isValidPassword = await bcrypt.compare(
        password,
        user.rows[0].user_password
      );

      if (!isValidPassword) {
        return res
          .status(401)
          .json({ message: 'Email or password is invalid.' });
      }

      // return jwt token
      const token = jwtGenerator(user.rows[0].user_id);
      res.json({ token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error.');
    }
  }
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
