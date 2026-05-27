const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
	getAllUsers,
	deleteUser,
	getAllMealPlans,
	deactivateUser,
} = require('../controllers/adminController');

router.get('/users', protect, getAllUsers);
router.delete('/users/:id', protect, deleteUser);
router.get('/mealplans', protect, getAllMealPlans);
router.put('/users/:id/deactivate', protect, deactivateUser);

module.exports = router;


