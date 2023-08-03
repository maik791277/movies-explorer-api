const express = require('express');

const router = express.Router();
const authRouter = require('./auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const authMiddleware = require('../middlewares/auth');

// Роуты авторизации
router.use('/', authRouter);

// Роуты пользователей
router.use('/users', authMiddleware, usersRouter);

// Роуты фильмов
router.use('/movies', authMiddleware, moviesRouter);

module.exports = router;
