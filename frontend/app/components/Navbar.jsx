'use client';

import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">Task Ecosystem</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-300">
          {user?.name} —{' '}
          <span className="capitalize bg-blue-600 text-white px-2 py-1 rounded text-xs">
            {user?.role?.replace('_', ' ')}
          </span>
        </span>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}