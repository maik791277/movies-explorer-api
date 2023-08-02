require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorMiddleware = require('./middlewares/error');
const notFoundMiddleware = require('./middlewares/notFound');
const routes = require('./routes');

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1:27017',
} = process.env;

const allowedOrigins = [
  'https://v-porulitsun.nomoredomains.xyz',
  'http://v-porulitsun.nomoredomains.xyz',
];

const app = express();
app.use(express.json());
app.use(requestLogger);

mongoose.connect(`${MONGO_URL}/bitfilmsdb`, { useUnifiedTopology: true });

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(cookieParser());
app.use('/', routes);
app.use(notFoundMiddleware);
app.use(errorLogger);
app.use(errors());
app.use(errorMiddleware);

app.listen(PORT);
