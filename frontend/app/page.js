'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) router.push('/login');
      else if (user.role === 'admin') router.push('/dashboard/admin');
      else if (user.role === 'project_lead') router.push('/dashboard/lead');
      else if (user.role === 'employee') router.push('/dashboard/employee');
      else if (user.role === 'qa_tester') router.push('/dashboard/qa');
    }
  }, [user, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  );
}