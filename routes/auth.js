const bcrypt = require('bcrypt');
const router = require('express').Router();
const pool = require('../db');

// POST => /register
router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // check if user exists already
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).send('User already exists.');
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
    res.json(newUser.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error.');
  }
});

module.exports = router;
