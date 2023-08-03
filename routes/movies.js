const express = require('express');

const router = express.Router();
const moviesController = require('../controllers/movies');
const createMovieValidator = require('../validators/validatorsRoute/movieValidatorRoutes');

router.post('/', createMovieValidator, moviesController.createMovie);
router.get('/', moviesController.getMovies);
router.delete('/:cardId', moviesController.deleteMovie);

module.exports = router;
