const http2 = require('node:http2');
const logger = require('../utils/logger');

const {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || HTTP_STATUS_INTERNAL_SERVER_ERROR;

  if (statusCode === 500) {
    logger.error(`Error occurred: ${err}`);
  }
  const message = statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
};
module.exports = errorMiddleware;
