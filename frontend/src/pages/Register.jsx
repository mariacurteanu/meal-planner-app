import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center text-green-800">Munch Time</h1>
        <p className="text-center text-gray-500 mb-6">Create your account</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
          />
          <button
            type="submit"
            className="w-full bg-green-800 text-white p-3 rounded-lg hover:bg-green-700"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4 text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-green-700 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
