import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">Munch Time</Link>
      <div>
        {user ? (
          <>
            <Link to="/dashboard" className="mr-4">My Meals</Link>
            <Link to="/history" className="mr-4">History</Link>
            {user.isAdmin && (
              <Link to="/admin" className="mr-4">Admin</Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link
              to="/register"
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
