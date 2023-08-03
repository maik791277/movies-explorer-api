const { celebrate, Joi } = require('celebrate');
const { urlConstants } = require('../validatorsConstants');

const createMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(urlConstants),
    trailerLink: Joi.string().required().regex(urlConstants),
    thumbnail: Joi.string().required().regex(urlConstants),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports = createMovieValidator;
