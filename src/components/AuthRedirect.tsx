'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

export default function AuthRedirect({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('site_token');
    if (!token) {
      router.push('/');
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) return <LoadingSpinner text="Verificando acceso..." />;

  return <>{children}</>;
}
