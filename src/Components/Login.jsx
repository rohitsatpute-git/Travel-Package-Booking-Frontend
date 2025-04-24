import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getUserFromToken } from '../utils/auth';
import { login } from '../utils/searchAPI';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = import.meta.env.VITE_BACKEND_URL + (isLogin ? '/api/login' : '/api/signup');

    const data = await login(email, password, url);
    
    if(data.token) {
        localStorage.setItem('token', data.token)
        const user = getUserFromToken();
        if(user.role === 'admin') navigate('/admin')
        else navigate('/')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? 'Login to your account' : 'Create a new account'}
        </h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 pr-4 py-2 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-4 py-2 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:underline">
            {isLogin ? 'Signup' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;