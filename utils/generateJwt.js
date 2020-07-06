const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateJwt = (email, userId, name) => {
  const user = {
    email,
    id: userId,
    name,
  };

  return jwt.sign({ user }, process.env.jwtSecret, { expiresIn: '1hr' });
};

module.exports = generateJwt;
