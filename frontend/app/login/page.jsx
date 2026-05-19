'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.access_token, response.data.user);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-slate-700">
        <h1 className="text-2xl font-bold text-center text-white mb-2">
          Task Ecosystem
        </h1>
        <p className="text-center text-slate-400 mb-6">Sign in to your account</p>

        {error && (
          <div className="bg-red-900 text-red-300 border border-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-slate-300 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-medium"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}