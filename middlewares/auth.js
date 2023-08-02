const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require('../class/UnauthorizedError');

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  let payload;

  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
