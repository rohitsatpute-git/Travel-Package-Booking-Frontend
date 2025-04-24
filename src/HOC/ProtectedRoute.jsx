import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getUserFromToken } from '../utils/auth';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null)
  const token = localStorage.getItem('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const decodedUser = getUserFromToken();
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verify-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(jwtDecode(token))
        

        const response = await res.json();

        console.log("response", decodedUser)

        if (response.ok) {
          setUser(decodedUser)
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, [token]);


  if (isAuthenticated === null) return <div className="text-center mt-10">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
