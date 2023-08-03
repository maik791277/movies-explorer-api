const express = require('express');

const router = express.Router();
const authController = require('../controllers/auth');
const { userSignupValidator, userSigninValidator } = require('../validators/validatorsRoute/authValidatorRoutes');

// Роуты авторизации
router.post('/signup', userSignupValidator, authController.createUser);
router.post('/signin', userSigninValidator, authController.login);
router.get('/signout', authController.signout);

module.exports = router;
