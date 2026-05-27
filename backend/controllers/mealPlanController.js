const MealPlan = require('../models/MealPlan');

// Get current week's meal plan
exports.getMealPlan = async (req, res) => {
    try {
        const mealPlan = await MealPlan.find({ user: req.user.id })
            .sort({ weekOf: -1 });
        res.json(mealPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new meal plan
exports.createMealPlan = async (req, res) => {
    try {
        const { weekOf, meals } = req.body;
        const mealPlan = new MealPlan({
            user: req.user.id,
            weekOf,
            meals
        });
        const savedMealPlan = await mealPlan.save();
        res.status(201).json(savedMealPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a meal to existing meal plan
exports.addMeal = async (req, res) => {
    try {
        const mealPlan = await MealPlan.findOne({ 
            _id: req.params.id, 
            user: req.user.id 
        });
        if (!mealPlan) return res.status(404).json({ message: 'Meal plan not found' });
        mealPlan.meals.push(req.body);
        const updatedMealPlan = await mealPlan.save();
        res.json(updatedMealPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a meal in meal plan
exports.updateMeal = async (req, res) => {
    try {
        const mealPlan = await MealPlan.findOne({ 
            _id: req.params.id, 
            user: req.user.id 
        });
        if (!mealPlan) return res.status(404).json({ message: 'Meal plan not found' });
        const meal = mealPlan.meals.id(req.params.mealId);
        if (!meal) return res.status(404).json({ message: 'Meal not found' });
        Object.assign(meal, req.body);
        const updatedMealPlan = await mealPlan.save();
        res.json(updatedMealPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a meal from meal plan
exports.deleteMeal = async (req, res) => {
    try {
        const mealPlan = await MealPlan.findOne({ 
            _id: req.params.id, 
            user: req.user.id 
        });
        if (!mealPlan) return res.status(404).json({ message: 'Meal plan not found' });
        mealPlan.meals = mealPlan.meals.filter(
            meal => meal._id.toString() !== req.params.mealId
        );
        const updatedMealPlan = await mealPlan.save();
        res.json(updatedMealPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
