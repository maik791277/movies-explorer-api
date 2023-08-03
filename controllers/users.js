const http2 = require('node:http2');
const user = require('../models/user');
const ResourceNotFoundError = require('../class/ResourceNotFoundError');
const BadRequestError = require('../class/BadRequestError');
const ConflictError = require('../class/ConflictError');

const {
  HTTP_STATUS_OK,
} = http2.constants;

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  user.findById(userId)
    .then((getUserId) => {
      if (!getUserId) {
        throw new ResourceNotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(HTTP_STATUS_OK).json(getUserId);
    })
    .catch((err) => {
      next(err);
    });
};

const updateCurrentUser = (req, res, next) => {
  const { name, email } = req.body;

  user.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((updateUser) => {
      if (updateUser) {
        res.status(HTTP_STATUS_OK).json(updateUser);
      } else {
        throw new ResourceNotFoundError('Пользователь по указанному _id не найден');
      }
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCurrentUser, updateCurrentUser,
};
