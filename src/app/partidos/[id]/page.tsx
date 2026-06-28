'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import AuthRedirect from '@/components/AuthRedirect';

interface PronosticoDetalle {
  participante_id: number;
  nombre: string;
  goles_local_pronostico: number;
  goles_visitante_pronostico: number;
  puntos: number;
  acierto_resultado: boolean;
  acierto_local: boolean;
  acierto_visitante: boolean;
}

interface PartidoDetalle {
  partido: {
    id: number;
    equipo_local: string;
    equipo_visitante: string;
    fecha: string;
    estado: string;
    goles_local_real: number | null;
    goles_visitante_real: number | null;
  };
  pronosticos: PronosticoDetalle[];
}

export default function PartidoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<PartidoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/partidos/${id}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          console.error('Error en respuesta del servidor:', res.status);
          setData(null);
        }
      } catch (error) {
        console.error('Error fetching partido:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner text="Cargando detalles del partido..." />;
  if (!data) return <div style={{ textAlign: 'center', color: '#ef4444', marginTop: '40px' }}>Partido no encontrado</div>;

  const { partido, pronosticos } = data;
  const isFinalizado = partido.estado === 'FINALIZADO';

  const filteredPronosticos = pronosticos.filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  const getPointsClass = (puntos: number) => {
    if (puntos === 5) return 'points-5';
    if (puntos >= 3) return 'points-3-4';
    if (puntos >= 1) return 'points-1-2';
    return 'points-0';
  };

  return (
    <AuthRedirect>
    <div>
      <div style={{ marginBottom: '32px' }}>
        <Link href="/partidos" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          ← Volver al Calendario
        </Link>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '8px' }}>
          <span style={{ background: 'linear-gradient(135deg, #d4a843, #f0d78c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            ⚽ Pronósticos del Partido
          </span>
        </h1>
      </div>

      {/* Tarjeta del Partido */}
      <div className="glass-card" style={{ padding: '30px 20px', textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '16px' }}>
          {new Date(partido.fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          {' • '}
          <span style={{ color: isFinalizado ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{partido.estado}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900 }}>
          <span style={{ flex: 1, textAlign: 'right' }}>{partido.equipo_local}</span>
          <span style={{ 
            background: 'rgba(255,255,255,0.05)', 
            padding: '8px 24px', 
            borderRadius: '12px',
            color: '#f0d78c',
            border: '1px solid rgba(212, 168, 67, 0.2)'
          }}>
            {isFinalizado ? `${partido.goles_local_real} - ${partido.goles_visitante_real}` : 'vs'}
          </span>
          <span style={{ flex: 1, textAlign: 'left' }}>{partido.equipo_visitante}</span>
        </div>
      </div>

      {/* Buscador */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '100%', maxWidth: '350px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar participante por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px' }}
          />
        </div>
      </div>

      {/* Tabla de Pronósticos */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="ranking-table">
            <thead>
              <tr>
                <th style={{ width: '50px', textAlign: 'center' }}>#</th>
                <th>Participante</th>
                <th style={{ textAlign: 'center' }}>Pronóstico</th>
                {isFinalizado && <th style={{ textAlign: 'center' }}>Aciertos</th>}
                {isFinalizado && <th style={{ textAlign: 'center' }}>Puntos</th>}
              </tr>
            </thead>
            <tbody>
              {filteredPronosticos.map((p, index) => (
                <tr key={p.participante_id}>
                  <td style={{ textAlign: 'center', color: '#6b7280' }}>{index + 1}</td>
                  <td>
                    <Link href={`/participante/${p.participante_id}`} style={{ color: '#f9fafb', textDecoration: 'none', fontWeight: 500 }}>
                      {p.nombre}
                    </Link>
                  </td>
                  <td style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '2px' }}>
                    {p.goles_local_pronostico} - {p.goles_visitante_pronostico}
                  </td>
                  {isFinalizado && (
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        {p.acierto_resultado && <span title="Resultado" style={{ color: '#10b981' }}>✅</span>}
                        {p.acierto_local && <span title="Goles Local" style={{ color: '#3b82f6' }}>⚽</span>}
                        {p.acierto_visitante && <span title="Goles Visitante" style={{ color: '#8b5cf6' }}>⚽</span>}
                      </div>
                    </td>
                  )}
                  {isFinalizado && (
                    <td style={{ textAlign: 'center' }}>
                      <span className={`points-badge ${getPointsClass(p.puntos)}`}>
                        {p.puntos}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
              {filteredPronosticos.length === 0 && (
                <tr>
                  <td colSpan={isFinalizado ? 5 : 3} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                    No se encontraron participantes que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </AuthRedirect>
  );
}
