const User = require('../models/User');
const MealPlan = require('../models/MealPlan');

// Get all users
exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find().select('-password');
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Delete a user
exports.deleteUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ message: 'User not found' });
		await MealPlan.deleteMany({ user: req.params.id });
		await User.findByIdAndDelete(req.params.id);
		res.json({ message: 'User deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get all meal plans
exports.getAllMealPlans = async (req, res) => {
	try {
		const mealPlans = await MealPlanfind()
			.populate('user', 'name email');
		res.json(mealPlans);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Deactivate a user
exports.deactivateUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) return res.status(404).json({ message: 'User not found' });
		user.isActive = false;
		await user.save();
		res.json({ message: 'User deactivated successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

