const http2 = require('node:http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

const {
  NODE_ENV,
  JWT_SECRET,
} = process.env;
const ConflictError = require('../class/ConflictError');
const BadRequestError = require('../class/BadRequestError');
const UnauthorizedError = require('../class/UnauthorizedError');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = http2.constants;

const signout = (req, res) => {
  res.clearCookie('token').send({ message: 'Выход' });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => user.create({
      name,
      email,
      password: hash,
    }))
    .then((addUser) => {
      const userWithoutPassword = {
        _id: addUser._id,
        name: addUser.name,
        email: addUser.email,
      };
      res.status(HTTP_STATUS_CREATED).json(userWithoutPassword);
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

const login = (req, res, next) => {
  const { email, password } = req.body;

  user.findOne({ email }).select('+password')
    .then((users) => {
      if (!users) {
        throw new UnauthorizedError('Неправильная почта или пароль');
      }

      return bcrypt.compare(password, users.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильная почта или пароль');
          }

          const tokenPayload = { _id: users._id };
          const token = jwt.sign(tokenPayload, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          res.cookie('token', token, {
            maxAge: 604800000,
            httpOnly: true,
            sameSite: 'None',
            secure: true,
          });

          return res.status(HTTP_STATUS_OK).json({ message: 'Успешный вход' });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  signout,
};
