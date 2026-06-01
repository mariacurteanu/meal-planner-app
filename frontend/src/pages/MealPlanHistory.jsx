import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];

const MealPlanHistory = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [expandedPlan, setExpandedPlan] = useState(null);
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

  const getMealForSlot = (plan, day, mealType) => {
    return plan.meals.find(m => m.dayOfWeek === day && m.mealType === mealType);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Meal Plan History</h1>
        {mealPlans.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No meal plans yet. Start by adding meals to your dashboard.</p>
          </div>
        ) : (
          mealPlans.map((plan, index) => (
            <div key={plan._id} className="bg-white rounded-lg shadow mb-4">
              <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedPlan(expandedPlan === plan._id ? null : plan._id)}
              >
                <div>
                  <h2 className="text-lg font-semibold text-green-800">
                    {index === 0 ? 'Current Week' : `Week of ${new Date(plan.weekOf).toLocaleDateString('en-AU')}`}
                  </h2>
                  <p className="text-gray-500 text-sm">{plan.meals.length} meals planned</p>
                </div>
                <span className="text-green-800 font-bold">
                  {expandedPlan === plan._id ? '▲' : '▼'}
                </span>
              </div>
              {expandedPlan === plan._id && (
                <div className="p-4 border-t overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-2 text-left text-green-800"></th>
                        {DAYS.map(day => (
                          <th key={day} className="p-2 text-center text-green-800">{day.slice(0, 3)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MEAL_TYPES.map(mealType => (
                        <tr key={mealType} className="border-t">
                          <td className="p-2 font-medium text-green-800">{mealType}</td>
                          {DAYS.map(day => {
                            const meal = getMealForSlot(plan, day, mealType);
                            return (
                              <td key={day} className="p-2 text-center text-gray-600">
                                {meal ? meal.name : <span className="text-gray-300">-</span>}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MealPlanHistory; 
