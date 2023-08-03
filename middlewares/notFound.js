const ResourceNotFoundError = require('../class/ResourceNotFoundError');

const notFoundMiddleware = (req, res, next) => {
  next(new ResourceNotFoundError('Страница не найдена'));
};

module.exports = notFoundMiddleware;
