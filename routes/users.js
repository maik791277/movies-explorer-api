const express = require('express');

const router = express.Router();
const usersController = require('../controllers/users');
const updateUserValidator = require('../validators/validatorsRoute/userValidatorRoutes');

router.get('/me', usersController.getCurrentUser);
router.patch('/me', updateUserValidator, usersController.updateCurrentUser);

module.exports = router;
