'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import AuthRedirect from '@/components/AuthRedirect';
import { getFlagEmoji } from '@/lib/flags';

interface PartidoInfo {
  id: number;
  equipo_local: string;
  equipo_visitante: string;
  goles_local_real: number | null;
  goles_visitante_real: number | null;
  fecha: string;
  estado: string;
}

export default function PartidosPage() {
  const [partidos, setPartidos] = useState<PartidoInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const res = await fetch('/api/partidos', { cache: 'no-store' });
        if (!res.ok) {
          console.error('Error en respuesta del servidor:', res.status);
          setPartidos([]);
          return;
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          console.error('Respuesta inesperada del servidor:', data);
          setPartidos([]);
          return;
        }
        setPartidos(data);
      } catch (error) {
        console.error('Error al cargar partidos:', error);
        setPartidos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPartidos();
  }, []);

  if (loading) return <LoadingSpinner text="Cargando calendario..." />;

  // Agrupar partidos por fecha
  const partidosPorFecha: Record<string, PartidoInfo[]> = {};
  partidos.forEach(p => {
    const dateStr = new Date(p.fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!partidosPorFecha[dateStr]) partidosPorFecha[dateStr] = [];
    partidosPorFecha[dateStr].push(p);
  });

  return (
    <AuthRedirect>
    <div>
      <div style={{ marginBottom: '32px' }}>
        <Link href="/" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          ← Volver al Ranking
        </Link>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '8px' }}>
          <span style={{ background: 'linear-gradient(135deg, #d4a843, #f0d78c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            ⚽ Calendario de Partidos
          </span>
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
          Selecciona un partido para ver los pronósticos de todos los participantes.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {Object.entries(partidosPorFecha).map(([fechaStr, listaPartidos]) => (
          <div key={fechaStr}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#f3f4f6', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', textTransform: 'capitalize' }}>
              {fechaStr}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {listaPartidos.map(p => (
                <Link href={`/partidos/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
                  <div className="glass-card match-card" style={{ padding: '20px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', height: '100%' }}>
                    <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '12px' }}>
                      {new Date(p.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      {' • '}
                      <span style={{ color: p.estado === 'FINALIZADO' ? '#10b981' : '#f59e0b' }}>
                        {p.estado}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                      <span style={{ flex: 1, textAlign: 'right' }}>
                        {getFlagEmoji(p.equipo_local) && <span style={{ marginRight: 6 }}>{getFlagEmoji(p.equipo_local)}</span>}
                        {p.equipo_local}
                      </span>
                      <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '8px', minWidth: '70px', display: 'inline-block' }}>
                        {p.estado === 'FINALIZADO' ? `${p.goles_local_real} - ${p.goles_visitante_real}` : 'vs'}
                      </span>
                      <span style={{ flex: 1, textAlign: 'left' }}>
                        {p.equipo_visitante}
                        {getFlagEmoji(p.equipo_visitante) && <span style={{ marginLeft: 6 }}>{getFlagEmoji(p.equipo_visitante)}</span>}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .match-card:hover {
           transform: translateY(-4px);
           border-color: rgba(212, 168, 67, 0.4);
        }
      `}</style>
    </div>
    </AuthRedirect>
  );
}
