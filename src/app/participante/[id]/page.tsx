'use client';

/**
 * Página de detalle de participante (/participante/[id])
 *
 * RF-05: Muestra todos los partidos con pronóstico, resultado real y puntos.
 */

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import AuthRedirect from '@/components/AuthRedirect';

interface DetallePartido {
  partido_id: number;
  fecha: string;
  equipo_local: string;
  equipo_visitante: string;
  estado: string;
  pronostico_local: number;
  pronostico_visitante: number;
  resultado_local: number | null;
  resultado_visitante: number | null;
  puntos: number | null;
  acierto_resultado: boolean | null;
  acierto_local: boolean | null;
  acierto_visitante: boolean | null;
}

interface Stats {
  puntos_totales: number;
  partidos_jugados: number;
  partidos_perfectos: number;
  aciertos_resultado: number;
  aciertos_local: number;
  aciertos_visitante: number;
  promedio_puntos: number;
}

interface ParticipanteData {
  participante: {
    id: number;
    nombre: string;
    email: string | null;
  };
  stats: Stats;
  detalle: DetallePartido[];
}

export default function ParticipantDetailPage() {
  const params = useParams();
  const [data, setData] = useState<ParticipanteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/participante/${params.id}/detalle`, { cache: 'no-store' });
        if (!res.ok) {
          setError('Participante no encontrado');
          setData(null);
          return;
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError('Error al cargar datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) fetchData();
  }, [params.id]);

  const getPointsClass = (puntos: number) => {
    if (puntos === 5) return 'points-5';
    if (puntos >= 3) return 'points-3-4';
    if (puntos >= 1) return 'points-1-2';
    return 'points-0';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) return <LoadingSpinner text="Cargando detalle..." />;

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <span style={{ fontSize: '3rem' }}>😕</span>
        <p style={{ color: '#9ca3af', marginTop: '16px' }}>{error}</p>
        <Link href="/" className="btn-secondary" style={{ marginTop: '20px', display: 'inline-block', textDecoration: 'none' }}>
          ← Volver al Ranking
        </Link>
      </div>
    );
  }

  if (!data) return null;

  return (
    <AuthRedirect>
    <div>
      {/* Back Link */}
      <Link
        href="/"
        style={{
          color: '#9ca3af',
          textDecoration: 'none',
          fontSize: '0.85rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '24px',
        }}
      >
        ← Volver al Ranking
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 800,
            marginBottom: '4px',
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
            {data.participante.nombre}
          </span>
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>
          Detalle de pronósticos y resultados
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '32px',
        }}
      >
        <div className="stat-card">
          <div className="stat-value">{data.stats.puntos_totales}</div>
          <div className="stat-label">Puntos Totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.stats.partidos_jugados}</div>
          <div className="stat-label">Partidos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.stats.partidos_perfectos}</div>
          <div className="stat-label">⭐ Perfectos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.stats.aciertos_resultado}</div>
          <div className="stat-label">✅ Aciertos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.stats.promedio_puntos}</div>
          <div className="stat-label">Promedio</div>
        </div>
      </div>

      {/* Matches Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="ranking-table" id="detalle-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Partido</th>
                <th style={{ textAlign: 'center' }}>Pronóstico</th>
                <th style={{ textAlign: 'center' }}>Resultado</th>
                <th style={{ textAlign: 'center' }}>Puntos</th>
                <th style={{ textAlign: 'center' }} className="hide-mobile">Aciertos</th>
              </tr>
            </thead>
            <tbody>
              {data.detalle.map((d) => (
                <tr key={d.partido_id} id={`match-${d.partido_id}`}>
                  <td style={{ color: '#9ca3af', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {formatDate(d.fecha)}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                      {d.equipo_local}
                    </span>
                    <span style={{ color: '#6b7280', padding: '0 4px' }}>vs</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                      {d.equipo_visitante}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600, color: '#8b5cf6' }}>
                    {d.pronostico_local} - {d.pronostico_visitante}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {d.estado === 'FINALIZADO' ? (
                      <span style={{ fontWeight: 700 }}>
                        {d.resultado_local} - {d.resultado_visitante}
                      </span>
                    ) : (
                      <span
                        style={{
                          color: '#6b7280',
                          fontSize: '0.75rem',
                          fontStyle: 'italic',
                        }}
                      >
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {d.puntos !== null ? (
                      <span className={`points-badge ${getPointsClass(d.puntos)}`}>
                        {d.puntos}
                      </span>
                    ) : (
                      <span style={{ color: '#6b7280' }}>—</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }} className="hide-mobile">
                    {d.puntos !== null ? (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', fontSize: '0.8rem' }}>
                        <span title="Resultado" className={d.acierto_resultado ? 'acierto-check' : 'acierto-cross'}>
                          {d.acierto_resultado ? '✅' : '❌'}
                        </span>
                        <span title="Goles Local" className={d.acierto_local ? 'acierto-check' : 'acierto-cross'}>
                          {d.acierto_local ? '🟢' : '🔴'}
                        </span>
                        <span title="Goles Visitante" className={d.acierto_visitante ? 'acierto-check' : 'acierto-cross'}>
                          {d.acierto_visitante ? '🟢' : '🔴'}
                        </span>
                      </div>
                    ) : (
                      <span style={{ color: '#6b7280' }}>—</span>
                    )}
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
        <span>✅ = Acertó resultado (±3 pts)</span>
        <span>🟢 = Acertó goles (±1 pt)</span>
        <span>❌🔴 = No acertó</span>
      </div>

      <style>{`
        @media (max-width: 639px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
    </AuthRedirect>
  );
}
