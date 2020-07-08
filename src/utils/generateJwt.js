import jwt from 'jsonwebtoken';
import { jwtSecret } from '../settings';

const generateJwt = (email, userId, name) => {
  const user = {
    email,
    id: userId,
    name,
  };

  return jwt.sign({ user }, jwtSecret, { expiresIn: '1hr' });
};

export default generateJwt;
