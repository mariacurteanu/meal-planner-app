import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user){
	 navigate('/login');
	 return;
    }
    if (!user?.isAdmin) {
	 navigate('/dashboard');
	 return;
    }
    fetchUsers();
    fetchMealPlans();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMealPlans = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/mealplans', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setMealPlans(response.data);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axiosInstance.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      fetchUsers();
    } catch (error) {
      alert('Error deleting user. Please try again.');
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;
    try {
      await axiosInstance.put(`/api/admin/users/${userId}/deactivate`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      fetchUsers();
    } catch (error) {
      alert('Error deactivating user. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Admin Panel</h1>

        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 font-medium ${activeTab === 'users'
              ? 'border-b-2 border-green-800 text-green-800'
              : 'text-gray-500 hover:text-green-800'}`}
          >
            Active Users
          </button>
          <button
            onClick={() => setActiveTab('mealplans')}
            className={`px-6 py-2 font-medium ${activeTab === 'mealplans'
              ? 'border-b-2 border-green-800 text-green-800'
              : 'text-gray-500 hover:text-green-800'}`}
          >
            All Meal Plans
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-green-800">Name</th>
                  <th className="p-4 text-left text-green-800">Email</th>
                  <th className="p-4 text-left text-green-800">Status</th>
                  <th className="p-4 text-left text-green-800">Role</th>
                  <th className="p-4 text-left text-green-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{u.name}</td>
                    <td className="p-4 text-gray-600">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${u.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${u.isAdmin
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'}`}>
                        {u.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeactivateUser(u._id)}
                        className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-green-600 hover:text-white mr-2 transition-colors"
                      >
                        Deactivate
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Meal Plans Tab */}
        {activeTab === 'mealplans' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-green-800">User</th>
                  <th className="p-4 text-left text-green-800">Email</th>
                  <th className="p-4 text-left text-green-800">Week Of</th>
                  <th className="p-4 text-left text-green-800">Meals Count</th>
                  <th className="p-4 text-left text-green-800">Created</th>
                </tr>
              </thead>
              <tbody>
                {mealPlans.map(plan => (
                  <tr key={plan._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{plan.user?.name}</td>
                    <td className="p-4 text-gray-600">{plan.user?.email}</td>
                    <td className="p-4">{new Date(plan.weekOf).toLocaleDateString('en-AU')}</td>
                    <td className="p-4">{plan.meals.length} meals</td>
                    <td className="p-4 text-gray-600">{new Date(plan.createdAt).toLocaleDateString('en-AU')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
