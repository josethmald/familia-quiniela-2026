'use client';

/**
 * Navbar — Barra de navegación principal
 *
 * Enlaces a: Ranking, Reporte Diario
 * El enlace a Admin solo es visible si se accede con token.
 */

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: '/', label: '🏆 Ranking', id: 'nav-ranking' },
    { href: '/llaves', label: '🗺️ Llaves', id: 'nav-llaves' },
    { href: '/simulador', label: '🔮 Simulador', id: 'nav-simulador' },
    { href: '/reporte', label: '📊 Reporte Diario', id: 'nav-reporte' },
    { href: '/admin', label: '🔐 Admin', id: 'nav-admin' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      id="main-navbar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(10, 14, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div
        className="container-app"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          id="nav-logo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>⚽</span>
          <span
            style={{
              fontWeight: 800,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #d4a843, #f0d78c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Quiniela 2026
          </span>
        </Link>

        {/* Desktop Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          className="desktop-nav"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              id={link.id}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 500,
                textDecoration: 'none',
                color: isActive(link.href) ? '#d4a843' : '#9ca3af',
                background: isActive(link.href)
                  ? 'rgba(212, 168, 67, 0.1)'
                  : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '8px',
          }}
          className="mobile-toggle"
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
          className="mobile-menu"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              id={`${link.id}-mobile`}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 500,
                textDecoration: 'none',
                color: isActive(link.href) ? '#d4a843' : '#9ca3af',
                background: isActive(link.href)
                  ? 'rgba(212, 168, 67, 0.1)'
                  : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 639px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (min-width: 640px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
