'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import AuthRedirect from '@/components/AuthRedirect';
import { getFlagEmoji } from '@/lib/flags';

interface PartidoInfo {
  id: number;
  fecha: string;
  equipo_local: string;
  equipo_visitante: string;
  estado: string;
  goles_local_real: number | null;
  goles_visitante_real: number | null;
}

interface SimuladorResultado {
  participante_id: number;
  nombre: string;
  pronostico_local: number;
  pronostico_visitante: number;
  puntos: number;
  puntos_actuales: number;
  puntos_proyectados: number;
  acierto_resultado: boolean;
  acierto_local: boolean;
  acierto_visitante: boolean;
}

interface SimuladorResponse {
  partido: {
    id: number;
    equipo_local: string;
    equipo_visitante: string;
    fecha: string;
  };
  simulacion: {
    goles_local: number;
    goles_visitante: number;
  };
  stats: {
    total_participantes: number;
    puntaje_promedio: string;
    perfectos: number;
    cero_puntos: number;
  };
  resultados: SimuladorResultado[];
}

export default function SimuladorPage() {
  const [partidos, setPartidos] = useState<PartidoInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculando, setCalculando] = useState(false);
  const [selectedPartido, setSelectedPartido] = useState<number | null>(null);
  const [golesLocal, setGolesLocal] = useState('');
  const [golesVisitante, setGolesVisitante] = useState('');
  const [resultado, setResultado] = useState<SimuladorResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [verAcumulado, setVerAcumulado] = useState(false);

  const fetchPartidos = useCallback(async () => {
    try {
      const res = await fetch('/api/partidos', { cache: 'no-store' });
      if (!res.ok) {
        setPartidos([]);
        return;
      }
      const data = await res.json();
      setPartidos(Array.isArray(data) ? data : []);
    } catch {
      setPartidos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartidos();
  }, [fetchPartidos]);

  const selectedMatch = partidos.find((p) => p.id === selectedPartido);

  const handleCalcular = async () => {
    if (!selectedPartido) return;

    const golesL = parseInt(golesLocal, 10);
    const golesV = parseInt(golesVisitante, 10);

    if (isNaN(golesL) || isNaN(golesV) || golesL < 0 || golesV < 0 || golesL > 15 || golesV > 15) {
      return;
    }

    setCalculando(true);
    setResultado(null);

    try {
      const res = await fetch(`/api/simulador?partidoId=${selectedPartido}&goles_local=${golesL}&goles_visitante=${golesV}`);
      if (res.ok) {
        const data = await res.json();
        setResultado(data);
      }
    } catch {
      console.error('Error en simulación');
    } finally {
      setCalculando(false);
    }
  };

  const getPointsClass = (puntos: number) => {
    if (puntos === 5) return 'points-5';
    if (puntos >= 3) return 'points-3-4';
    if (puntos >= 1) return 'points-1-2';
    return 'points-0';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('es', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const resultadosOrdenados = useMemo(() => {
    if (!resultado) return [];
    const sortKey = verAcumulado ? 'puntos_proyectados' : 'puntos';
    const sorted = [...resultado.resultados];
    sorted.sort((a, b) =>
      (b[sortKey as keyof SimuladorResultado] as number) - (a[sortKey as keyof SimuladorResultado] as number) ||
      a.nombre.localeCompare(b.nombre, 'es')
    );
    return sorted;
  }, [resultado, verAcumulado]);

  const resultadosFiltrados = useMemo(() => {
    return resultadosOrdenados.filter((r) =>
      r.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [resultadosOrdenados, searchTerm]);

  if (loading) return <LoadingSpinner text="Cargando partidos..." />;

  return (
    <AuthRedirect>
    <div>
      <div style={{ marginBottom: '32px' }}>
        <Link href="/" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          ← Volver al Ranking
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#c4b5fd', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Simulador
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '4px' }}>
          <span style={{ background: 'linear-gradient(135deg, #d4a843, #f0d78c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            🔮 Simulador de Puntajes
          </span>
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
          Pruebe diferentes marcadores y vea qué puntaje obtendría cada participante
        </p>
      </div>

      <div style={{ display: 'grid', gap: '24px', maxWidth: '600px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="sim-partido-selector" style={{ display: 'block', color: '#9ca3af', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              Partido
            </label>
            <select
              id="sim-partido-selector"
              className="select-field"
              value={selectedPartido ?? ''}
              onChange={(e) => { setSelectedPartido(e.target.value ? parseInt(e.target.value, 10) : null); setResultado(null); }}
            >
              <option value="">— Seleccione un partido —</option>
              {partidos.map((p) => (
                <option key={p.id} value={p.id}>
                  {getFlagEmoji(p.equipo_local) ? `${getFlagEmoji(p.equipo_local)} ` : ''}{p.equipo_local} vs {getFlagEmoji(p.equipo_visitante) ? `${getFlagEmoji(p.equipo_visitante)} ` : ''}{p.equipo_visitante} — {formatDate(p.fecha)}
                </option>
              ))}
            </select>
          </div>

          {selectedMatch && (
            <div style={{ background: 'rgba(212, 168, 67, 0.05)', border: '1px solid rgba(212, 168, 67, 0.15)', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '8px' }}>
                {formatDate(selectedMatch.fecha)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {getFlagEmoji(selectedMatch.equipo_local) && <span style={{ marginRight: 6 }}>{getFlagEmoji(selectedMatch.equipo_local)}</span>}
                  {selectedMatch.equipo_local}
                </span>
                <span style={{ color: '#6b7280', fontWeight: 600 }}>VS</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {selectedMatch.equipo_visitante}
                  {getFlagEmoji(selectedMatch.equipo_visitante) && <span style={{ marginLeft: 6 }}>{getFlagEmoji(selectedMatch.equipo_visitante)}</span>}
                </span>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label htmlFor="sim-goles-local" style={{ display: 'block', color: '#9ca3af', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Goles Local
              </label>
              <input
                id="sim-goles-local"
                type="number"
                min="0"
                max="15"
                className="input-field"
                value={golesLocal}
                onChange={(e) => setGolesLocal(e.target.value)}
                placeholder="0"
                style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800 }}
              />
            </div>
            <div>
              <label htmlFor="sim-goles-visitante" style={{ display: 'block', color: '#9ca3af', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Goles Visitante
              </label>
              <input
                id="sim-goles-visitante"
                type="number"
                min="0"
                max="15"
                className="input-field"
                value={golesVisitante}
                onChange={(e) => setGolesVisitante(e.target.value)}
                placeholder="0"
                style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800 }}
              />
            </div>
          </div>

          <button
            onClick={handleCalcular}
            className="btn-primary"
            disabled={calculando || !selectedPartido || !golesLocal || !golesVisitante}
            style={{ width: '100%' }}
          >
            {calculando ? 'Calculando...' : '🔮 Calcular Puntajes'}
          </button>
        </div>

        {resultado && (
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px', textAlign: 'center' }}>
              <div className="stat-card" style={{ padding: '12px' }}>
                <div className="stat-value" style={{ fontSize: '1.3rem' }}>{resultado.stats.total_participantes}</div>
                <div className="stat-label">Participantes</div>
              </div>
              <div className="stat-card" style={{ padding: '12px' }}>
                <div className="stat-value" style={{ fontSize: '1.3rem', color: '#f0d78c' }}>{resultado.stats.puntaje_promedio}</div>
                <div className="stat-label">Promedio</div>
              </div>
              <div className="stat-card" style={{ padding: '12px' }}>
                <div className="stat-value" style={{ fontSize: '1.3rem', color: '#10b981' }}>{resultado.stats.perfectos}</div>
                <div className="stat-label">⭐ Perfectos</div>
              </div>
              <div className="stat-card" style={{ padding: '12px' }}>
                <div className="stat-value" style={{ fontSize: '1.3rem', color: '#ef4444' }}>{resultado.stats.cero_puntos}</div>
                <div className="stat-label">😢 0 pts</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {resultado && (
        <div className="glass-card" style={{ overflow: 'hidden', marginTop: '24px' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontWeight: 600 }}>
                {getFlagEmoji(resultado.partido.equipo_local) && <span style={{ marginRight: 4 }}>{getFlagEmoji(resultado.partido.equipo_local)}</span>}
                {resultado.partido.equipo_local} {resultado.simulacion.goles_local} - {resultado.simulacion.goles_visitante} {resultado.partido.equipo_visitante}
                {getFlagEmoji(resultado.partido.equipo_visitante) && <span style={{ marginLeft: 4 }}>{getFlagEmoji(resultado.partido.equipo_visitante)}</span>}
              </span>
              <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>(simulación)</span>
            </div>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <input
                type="text"
                placeholder="🔍 Buscar participante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
                style={{ flex: '1', minWidth: '200px', maxWidth: '350px', padding: '10px 14px', borderRadius: '8px' }}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#9ca3af', fontSize: '0.85rem', fontWeight: 500, userSelect: 'none' }}>
                <span style={{ color: verAcumulado ? '#8b5cf6' : '#9ca3af', transition: 'color 0.2s' }}>Solo este partido</span>
                <div
                  onClick={() => setVerAcumulado(!verAcumulado)}
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    background: verAcumulado ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255,255,255,0.1)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: verAcumulado ? '#8b5cf6' : '#6b7280',
                      position: 'absolute',
                      top: '3px',
                      left: verAcumulado ? '23px' : '3px',
                      transition: 'all 0.2s',
                    }}
                  />
                </div>
                <span style={{ color: verAcumulado ? '#8b5cf6' : '#9ca3af', transition: 'color 0.2s' }}>Con acumulado</span>
              </label>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="ranking-table">
                <thead>
                  <tr>
                    <th style={{ width: '50px', textAlign: 'center' }}>#</th>
                    <th>Participante</th>
                    <th style={{ textAlign: 'center' }}>Pronóstico</th>
                    {verAcumulado ? (
                      <>
                        <th style={{ textAlign: 'center' }}>Actual</th>
                        <th style={{ textAlign: 'center' }}>+ Este</th>
                        <th style={{ textAlign: 'center', color: '#8b5cf6' }}>Total</th>
                      </>
                    ) : (
                      <th style={{ textAlign: 'center' }}>Puntos</th>
                    )}
                    <th style={{ textAlign: 'center' }}>Aciertos</th>
                  </tr>
                </thead>
                <tbody>
                  {resultadosFiltrados.map((r, index) => (
                    <tr key={r.participante_id}>
                      <td style={{ textAlign: 'center', color: '#6b7280' }}>{index + 1}</td>
                      <td><span style={{ fontWeight: 500 }}>{r.nombre}</span></td>
                      <td style={{ textAlign: 'center', fontWeight: 700, letterSpacing: '2px', color: '#8b5cf6' }}>
                        {r.pronostico_local} - {r.pronostico_visitante}
                      </td>
                      {verAcumulado ? (
                        <>
                          <td style={{ textAlign: 'center', color: '#9ca3af', fontWeight: 600 }}>{r.puntos_actuales}</td>
                          <td style={{ textAlign: 'center', color: '#d4a843', fontWeight: 600 }}>+{r.puntos}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span className={`points-badge ${getPointsClass(r.puntos_proyectados)}`}>{r.puntos_proyectados}</span>
                          </td>
                        </>
                      ) : (
                        <td style={{ textAlign: 'center' }}>
                          <span className={`points-badge ${getPointsClass(r.puntos)}`}>{r.puntos}</span>
                        </td>
                      )}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', fontSize: '0.85rem' }}>
                          <span title="Resultado" style={{ color: r.acierto_resultado ? '#10b981' : '#6b7280' }}>
                            {r.acierto_resultado ? '✅' : '❌'}
                          </span>
                          <span title="Goles Local" style={{ color: r.acierto_local ? '#3b82f6' : '#6b7280' }}>
                            {r.acierto_local ? '🟢' : '🔴'}
                          </span>
                          <span title="Goles Visitante" style={{ color: r.acierto_visitante ? '#8b5cf6' : '#6b7280' }}>
                            {r.acierto_visitante ? '🟢' : '🔴'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
    </AuthRedirect>
  );
}
