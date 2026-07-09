'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(localStorage.getItem('admin_token') || new URLSearchParams(window.location.search).get('token') || '');
  }, []);

  const tabs = [
    { href: `/admin/resultados${token ? `?token=${token}` : ''}`, label: '⚙️ Cargar Resultados', id: 'nav-admin-resultados' },
    { href: `/admin/bonificaciones${token ? `?token=${token}` : ''}`, label: '🏆 Bonificaciones', id: 'nav-admin-bonificaciones' },
  ];

  const isActive = (href: string) => {
    const base = href.split('?')[0];
    return pathname === base;
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '4px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '10px',
        padding: '4px',
        marginBottom: '24px',
      }}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          id={tab.id}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            textDecoration: 'none',
            textAlign: 'center',
            color: isActive(tab.href) ? '#d4a843' : '#9ca3af',
            background: isActive(tab.href) ? 'rgba(212, 168, 67, 0.1)' : 'transparent',
            border: isActive(tab.href) ? '1px solid rgba(212, 168, 67, 0.2)' : '1px solid transparent',
            transition: 'all 0.2s ease',
          }}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
