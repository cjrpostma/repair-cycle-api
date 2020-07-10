import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import generateJwt from '../utils/generateJwt';
import pool from '../db';

export const getUsers = async (req, res) => {
  try {
    const users = await pool.query(
      'SELECT user_email, user_id, user_name FROM users'
    );
    res.json({ users: users.rows });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .send('Server error. Unable to fetch users. Please try again later.');
  }
};

export const registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Input is invalid.' });
  }

  const { email, name, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).json({ message: 'User already exists.' });
    }

    const SALT_ROUNDS = 10;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO users (user_email, user_name, user_password) VALUES ($1, $2, $3) RETURNING *',
      [email, name, hashedPassword]
    );

    const { user_email, user_id, user_name } = newUser.rows[0];
    const token = generateJwt(user_email, user_id, user_name);
    res.status(201).json({
      email,
      name,
      token,
      userId: user_id,
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .send('Server error. Registration failed. Please try again later.');
  }
};

export const loginUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Input is invalid.' });
  }

  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Email or password is invalid.' });
    }

    const { user_email, user_id, user_name, user_password } = user.rows[0];

    const isValidPassword = await bcrypt.compare(password, user_password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email or password is invalid.' });
    }

    const token = generateJwt(user_id);

    res.status(200).json({
      email: user_email,
      name: user_name,
      token,
      userId: user_id,
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .send('Server error. Logging in failed. Please try again later.');
  }
};
