const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'Authentication failed.' });
    }
    const payload = jwt.verify(token, process.env.jwtSecret);
    console.log('verify', payload);

    req.user = payload.user;
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(403).json({ message: 'Authentication failed.' });
  }
};
