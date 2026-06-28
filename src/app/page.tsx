'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

interface RankingEntry {
  posicion: number;
  participante_id: number;
  nombre: string;
  puntos_totales: number;
  partidos_perfectos: number;
  aciertos_resultado: number;
  partidos_jugados: number;
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const fetchRanking = useCallback(async () => {
    try {
      const res = await fetch('/api/ranking', { cache: 'no-store' });
      if (!res.ok) {
        console.error('Error en respuesta del servidor:', res.status);
        setRanking([]);
        return;
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error('Respuesta inesperada del servidor:', data);
        setRanking([]);
        return;
      }
      setRanking(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error al cargar ranking:', error);
      setRanking([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRanking();
    const interval = setInterval(fetchRanking, 30000);
    return () => clearInterval(interval);
  }, [fetchRanking]);

  useEffect(() => {
    const token = localStorage.getItem('site_token');
    if (token) setAuthenticated(true);
    setAuthLoading(false);
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoginLoading(true);
    try {
      const res = await fetch('/api/verify-site-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: password }),
      });
      if (res.ok) {
        localStorage.setItem('site_token', password);
        setAuthenticated(true);
      } else {
        setAuthError('Clave incorrecta');
      }
    } catch {
      setAuthError('Error de conexión');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('site_token');
    setAuthenticated(false);
    setPassword('');
  };

  const getPositionBadge = (pos: number) => {
    let className = 'pos-badge';
    if (pos === 1) className += ' pos-1';
    else if (pos === 2) className += ' pos-2';
    else if (pos === 3) className += ' pos-3';
    else
      return (
        <span
          className="pos-badge"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            color: '#9ca3af',
          }}
        >
          {pos}
        </span>
      );
    return <span className={className}>{pos}</span>;
  };

  const getPointsBadge = (puntos: number) => {
    return (
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
        {puntos}
      </span>
    );
  };

  if (loading || authLoading) return <LoadingSpinner text="Cargando..." />;

  if (!authenticated) {
    return (
      <div style={{ maxWidth: '400px', margin: '60px auto', padding: '0 16px' }}>
        <div className="glass-card" style={{ padding: '40px 32px', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>⚽</span>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
            <span style={{ background: 'linear-gradient(135deg, #d4a843, #f0d78c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Quiniela 2026
            </span>
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '24px' }}>
            Ingrese la clave de acceso
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Clave de acceso"
              className="input-field"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}
              autoFocus
            />
            {authError && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '12px' }}>{authError}</p>
            )}
            <button
              type="submit"
              className="btn-primary"
              disabled={loginLoading || !password}
              style={{ width: '100%' }}
            >
              {loginLoading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Logout */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button
          onClick={handleLogout}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer' }}
        >
          🔒 Cerrar sesión
        </button>
      </div>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 900,
            marginBottom: '12px',
            lineHeight: 1.2,
          }}
        >
          <span
            style={{
              background: 'linear-gradient(135deg, #d4a843, #f0d78c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            🏆 Ranking General
          </span>
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
          Quiniela Mundial FIFA 2026 — Tabla de posiciones actualizada
        </p>

        {/* Live indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '16px',
          }}
        >
          <div className="pulse-dot" />
          <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em' }}>
            ACTUALIZACIÓN EN VIVO
          </span>
          {lastUpdate && (
            <span style={{ color: '#6b7280', fontSize: '0.7rem' }}>
              · {lastUpdate.toLocaleTimeString('es')}
            </span>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/reporte" className="btn-secondary" style={{ textDecoration: 'none' }}>
            📊 Reporte Diario
          </Link>
          <Link href="/partidos" className="btn-secondary" style={{ textDecoration: 'none' }}>
            ⚽ Ver Partidos
          </Link>
        </div>
        <div style={{ flex: '1', minWidth: '200px', maxWidth: '300px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar participante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px' }}
          />
        </div>
      </div>

      {/* Ranking Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="ranking-table" id="ranking-table">
            <thead>
              <tr>
                <th style={{ width: '60px', textAlign: 'center' }}>#</th>
                <th>Participante</th>
                <th style={{ textAlign: 'center' }}>Puntos</th>
                <th style={{ textAlign: 'center' }}>⭐ Perfectos</th>
                <th style={{ textAlign: 'center' }}>✅ Aciertos</th>
                <th style={{ textAlign: 'center' }}>PJ</th>
              </tr>
            </thead>
            <tbody>
              {ranking.filter((e) => e.nombre.toLowerCase().includes(searchTerm.toLowerCase())).map((entry) => (
                <tr key={entry.participante_id} id={`ranking-row-${entry.participante_id}`}>
                  <td style={{ textAlign: 'center' }}>
                    {getPositionBadge(entry.posicion)}
                  </td>
                  <td>
                    <Link
                      href={`/participante/${entry.participante_id}`}
                      style={{
                        color: entry.posicion <= 3 ? '#f0d78c' : '#f9fafb',
                        textDecoration: 'none',
                        fontWeight: entry.posicion <= 3 ? 700 : 500,
                        transition: 'color 0.2s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = '#d4a843')}
                      onMouseOut={(e) =>
                        (e.currentTarget.style.color =
                          entry.posicion <= 3 ? '#f0d78c' : '#f9fafb')
                      }
                    >
                      {entry.nombre}
                    </Link>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {getPointsBadge(entry.puntos_totales)}
                  </td>
                  <td style={{ textAlign: 'center', color: '#d4a843' }}>
                    {entry.partidos_perfectos}
                  </td>
                  <td style={{ textAlign: 'center', color: '#10b981' }}>
                    {entry.aciertos_resultado}
                  </td>
                  <td style={{ textAlign: 'center', color: '#9ca3af' }}>
                    {entry.partidos_jugados}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.75rem',
          color: '#6b7280',
        }}
      >
        <span>⭐ Perfectos = Partidos con 5 puntos</span>
        <span>✅ Aciertos = Resultado correcto</span>
        <span>PJ = Partidos jugados</span>
      </div>

      <style>{`
        @media (max-width: 639px) {
          .ranking-table thead th {
            padding: 8px 8px;
            font-size: 0.6rem;
            letter-spacing: 0.06em;
          }
          .ranking-table tbody td {
            padding: 10px 8px;
            font-size: 0.78rem;
          }
          .ranking-table thead th:first-child,
          .ranking-table tbody td:first-child {
            padding-left: 10px;
          }
          .ranking-table thead th:last-child,
          .ranking-table tbody td:last-child {
            padding-right: 10px;
          }
        }
      `}</style>
    </div>
  );
}
