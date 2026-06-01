import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];

const Dashboard = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', mealType: 'Breakfast', dayOfWeek: 'Monday',
    method: '', ingredients: '', nutritionalInfo: '', linkToRecipe: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
    fetchMealPlans();
  }, []);

  const fetchMealPlans = async () => {
    try {
      const response = await axiosInstance.get('/api/mealplans', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setMealPlans(response.data);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    }
  };

  const getCurrentWeekPlan = () => {
    if (mealPlans.length === 0) return null;
    return mealPlans[0];
  };

  const getMealForSlot = (day, mealType) => {
    const plan = getCurrentWeekPlan();
    if (!plan) return null;
    return plan.meals.find(m => m.dayOfWeek === day && m.mealType === mealType);
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    try {
      const plan = getCurrentWeekPlan();
      if (plan) {
        await axiosInstance.post(`/api/mealplans/${plan._id}/meals`, formData, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
      } else {
        await axiosInstance.post('/api/mealplans', {
          weekOf: new Date().toISOString(),
          meals: [formData]
        }, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
      }
      setShowForm(false);
      setFormData({ name: '', mealType: 'Breakfast', dayOfWeek: 'Monday', method: '', ingredients: '', nutritionalInfo: '', linkToRecipe: '' });
      fetchMealPlans();
    } catch (error) {
      alert('Error saving meal. Please try again.');
    }
  };

  const handleEditMeal = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/mealplans/${editingPlanId}/meals/${editingMeal._id}`, formData, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setEditingMeal(null);
      setEditingPlanId(null);
      setFormData({ name: '', mealType: 'Breakfast', dayOfWeek: 'Monday', method: '', ingredients: '', nutritionalInfo: '', linkToRecipe: '' });
      fetchMealPlans();
    } catch (error) {
      alert('Error updating meal. Please try again.');
    }
  };

  const handleDeleteMeal = async (planId, mealId) => {
    if (!window.confirm('Are you sure you want to delete this meal?')) return;
    try {
      await axiosInstance.delete(`/api/mealplans/${planId}/meals/${mealId}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      fetchMealPlans();
    } catch (error) {
      alert('Error deleting meal. Please try again.');
    }
  };

  const openEditForm = (meal, planId) => {
    setEditingMeal(meal);
    setEditingPlanId(planId);
    setFormData({
      name: meal.name, mealType: meal.mealType, dayOfWeek: meal.dayOfWeek,
      method: meal.method || '', ingredients: meal.ingredients || '',
      nutritionalInfo: meal.nutritionalInfo || '', linkToRecipe: meal.linkToRecipe || ''
    });
  };

  const currentPlan = getCurrentWeekPlan();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-800">This Week's Meal Plan</h1>
            <p className="text-gray-500">{new Date().toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-800 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            + Add Meal
          </button>
        </div>

        {/* Weekly Grid */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="grid grid-cols-8 border-b">
            <div className="p-3 bg-gray-50"></div>
            {DAYS.map(day => (
              <div key={day} className="p-3 text-center font-semibold text-green-800 bg-gray-50 border-l">
                {day.slice(0, 3)}
              </div>
            ))}
          </div>
          {MEAL_TYPES.map(mealType => (
            <div key={mealType} className="grid grid-cols-8 border-b">
              <div className="p-3 font-semibold text-green-800 bg-gray-50 flex items-center">
                {mealType}
              </div>
              {DAYS.map(day => {
                const meal = getMealForSlot(day, mealType);
                return (
                  <div key={day} className="p-2 border-l min-h-16 relative">
                    {meal ? (
                      <div className="bg-green-50 rounded p-2 h-full">
                        <p className="text-sm font-medium text-green-900">{meal.name}</p>
                        <div className="flex gap-1 mt-1">
                          <button
                            onClick={() => openEditForm(meal, currentPlan._id)}
                            className="text-xs text-green-700 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMeal(currentPlan._id, meal._id)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <span className="text-gray-300 text-xs">Empty</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Add Meal Form Modal */}
        {(showForm || editingMeal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-green-800 mb-4">
                {editingMeal ? 'Edit Meal' : 'Add Meal'}
              </h2>
              <form onSubmit={editingMeal ? handleEditMeal : handleAddMeal}>
                <input
                  type="text"
                  placeholder="Meal Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mb-3 p-2 border rounded-lg"
                  required
                />
                <select
                  value={formData.mealType}
                  onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                  className="w-full mb-3 p-2 border rounded-lg"
                >
                  {MEAL_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <select
                  value={formData.dayOfWeek}
                  onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                  className="w-full mb-3 p-2 border rounded-lg"
                >
                  {DAYS.map(d => <option key={d}>{d}</option>)}
                </select>
                <input
                  type="text"
                  placeholder="Method (optional)"
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                  className="w-full mb-3 p-2 border rounded-lg"
                />
                <textarea
                  placeholder="Ingredients (optional)"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  className="w-full mb-3 p-2 border rounded-lg"
                  rows="2"
                />
                <input
                  type="text"
                  placeholder="Link to Recipe (optional)"
                  value={formData.linkToRecipe}
                  onChange={(e) => setFormData({ ...formData, linkToRecipe: e.target.value })}
                  className="w-full mb-4 p-2 border rounded-lg"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-800 text-white p-2 rounded-lg hover:bg-green-700"
                  >
                    {editingMeal ? 'Update Meal' : 'Add Meal'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditingMeal(null); }}
                    className="flex-1 bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
