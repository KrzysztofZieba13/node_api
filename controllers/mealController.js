const Meal = require('../models/mealModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopMeals = function (req, res, next) {
  req.query.limit = '5';
  req.query.sort = '-rating,price';
  req.query.fields = 'name,price,rating';
  next();
};

exports.getAllMeals = catchAsync(async function (req, res) {
  const features = new APIFeatures(Meal.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const meals = await features.query;

  res.status(200).json({
    status: 'success',
    results: meals.length,
    data: {
      meals,
    },
  });
});

exports.createMeal = catchAsync(async function (req, res) {
  const newMeal = await Meal.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { meal: newMeal },
  });
});

exports.getMeal = catchAsync(async function (req, res, next) {
  const meal = await Meal.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      meal,
    },
  });
});

exports.updateMeal = catchAsync(async function (req, res) {
  const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      meal,
    },
  });
});

exports.deleteMeal = catchAsync(async function (req, res, next) {
  const tour = await Meal.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//AGGREGATION
exports.getCountBestMeals = catchAsync(async function (req, res) {
  const number = await Meal.aggregate([
    { $match: { rating: { $gte: 4.5 } } },
    { $count: 'Liczba_najlepszych_posilkow' },
  ]);
  res.status(200).json({
    status: 'success',
    data: { number },
  });
});

//AGGREGATION
exports.getTotalPriceBestPizzas = catchAsync(async function (req, res) {
  const totalPizzas = await Meal.aggregate([
    {
      $match: { category: 'pizza', rating: { $gte: 4.4 } },
    },
    {
      $group: {
        _id: '$rating',
        numPizzas: { $sum: 1 },
        totalPrice: { $sum: '$price' },
        avgPrice: { $avg: '$price' },
      },
    },
    {
      $sort: {
        avg: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: totalPizzas.length,
    data: { totalPizzas },
  });
});
