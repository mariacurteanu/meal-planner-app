const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
	getMealPlan,
	createMealPlan,
	addMeal,
	updateMeal,
	deleteMeal
} = require('../controllers/mealPlanController');

router.get('/', protect, getMealPlan);
router.post('/', protect, createMealPlan);
router.post('/:id/meals', protect, addMeal);
router.put('/:id/meals/:mealId', protect, updateMeal);
router.delete('/:id/meals/:mealId', protect, deleteMeal);

module.exports = router;

