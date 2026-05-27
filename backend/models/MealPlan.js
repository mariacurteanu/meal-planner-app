const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
	name: { type: String, required: true },
	mealType: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner'], required: true },
	dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
	method: { type: String },
	ingredients: { type: String},
	nutritionalInfo: { type: String },
	linkToRecipe: { type: String },
});

const mealPlanSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectID, ref: 'User', required: true },
	weekOf: { type: Date, required: true },
	meals: [mealSchema],
}, { timestamps: true });

module.exports = mongoose.model('MealPlan', mealPlanSchema);

