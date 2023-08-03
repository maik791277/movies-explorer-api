const http2 = require('node:http2');
const movie = require('../models/movie');
const ResourceNotFoundError = require('../class/ResourceNotFoundError');
const BadRequestError = require('../class/BadRequestError');
const ForbiddenError = require('../class/ForbiddenError');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = http2.constants;

const getMovies = (req, res, next) => {
  const userId = req.user._id;

  movie.find({ owner: userId })
    .then((movies) => {
      if (movies.length === 0) {
        return res.status(HTTP_STATUS_OK).json({ message: 'У вас пока нет фильмов' });
      }

      return res.status(HTTP_STATUS_OK).json(movies);
    })
    .catch((err) => {
      next(err);
    });
};

const createMovie = async (req, res, next) => {
  const {
    country, director,
    duration, year,
    description, image,
    trailerLink, thumbnail,
    movieId, nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;

  movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((addCard) => res.status(HTTP_STATUS_CREATED).json(addCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;

    const foundCard = await movie.findById(cardId);
    if (!foundCard) {
      throw new ResourceNotFoundError('Фильм с указанным _id не найден');
    }

    if (foundCard.owner.toString() !== userId) {
      throw new ForbiddenError('Вы не можете удалить чужой фильм');
    }

    await movie.deleteOne({ _id: cardId });

    res.status(HTTP_STATUS_OK).json({ message: 'Фильм удален' });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ResourceNotFoundError('Передан несуществующий _id фильма'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
