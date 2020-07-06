const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const generateJwt = require('../utils/generateJwt');
const pool = require('../db');

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: 'Invalid inputs passed, please check your data.' });
  }

  const { email, name, password } = req.body;

  try {
    // check if user exists already
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).json({ message: 'User already exists.' });
    }

    // Bcrypt user password
    const SALT_ROUNDS = 10;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // enter the user into the database
    const newUser = await pool.query(
      'INSERT INTO users (user_email, user_name, user_password) VALUES ($1, $2, $3) RETURNING *',
      [email, name, bcryptPassword]
    );

    // generate jwt token
    const { user_email, user_id, user_name } = newUser.rows[0];
    const token = generateJwt(user_email, user_id, user_name);
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error.');
  }
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: 'Invalid inputs passed, please check your data.' });
  }

  const { email, password } = req.body;

  try {
    // check if user exists
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Email or password is invalid.' });
    }

    // check if incoming password matches password in db
    const isValidPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email or password is invalid.' });
    }

    // return jwt token
    const token = generateJwt(user.rows[0].user_id);
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error.');
  }
};
