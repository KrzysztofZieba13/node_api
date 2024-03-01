const express = require('express');
const morgan = require('morgan');

const mealRouter = require('./routes/mealRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); //parse to JSON
app.use((req, res, next) => {
  console.log('Hello from the middleware! 😀');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/meals', mealRouter);

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404);
});

app.use(globalErrorHandler);

module.exports = app;
