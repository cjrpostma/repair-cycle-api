const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtGenerator = (user_id) => {
  const payload = {
    user: user_id,
  };
  jwt.sign(payload, process.env.jwtSecret, { expiresIn: '1hr' });
};

module.exports = jwtGenerator;
