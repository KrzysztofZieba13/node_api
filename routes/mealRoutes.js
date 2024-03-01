const express = require('express');
const mealController = require('../controllers/mealController');

const router = express.Router(); // sub-app

router
  .route('/top-5-cheap')
  .get(mealController.aliasTopMeals, mealController.getAllMeals);

router.route('/best-meal-count').get(mealController.getCountBestMeals);
router
  .route('/total-price-best-pizzas')
  .get(mealController.getTotalPriceBestPizzas);

router
  .route('/')
  .get(mealController.getAllMeals)
  .post(mealController.createMeal);

router
  .route('/:id')
  .get(mealController.getMeal)
  .patch(mealController.updateMeal)
  .delete(mealController.deleteMeal);

module.exports = router;
