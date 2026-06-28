'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import AuthRedirect from '@/components/AuthRedirect';
import { getFlagEmoji } from '@/lib/flags';

interface Partido {
  id: number;
  fecha: string;
  equipo_local: string;
  equipo_visitante: string;
  goles_local_real: number | null;
  goles_visitante_real: number | null;
  estado: string;
  ronda: string;
}

const RONDA_ORDER = ['DIECISEISAVOS', 'OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'FINAL'] as const;
const RONDA_LABELS: Record<string, string> = {
  DIECISEISAVOS: 'Dieciseisavos',
  OCTAVOS: 'Octavos',
  CUARTOS: 'Cuartos',
  SEMIFINAL: 'Semifinales',
  FINAL: 'Final',
  TERCER_LUGAR: '3er Puesto',
};

function gridRow(rondaIdx: number, matchIdx: number): string {
  const span = Math.pow(2, rondaIdx);
  const start = matchIdx * span + 2;
  return `${start} / span ${span}`;
}

function TeamSide({
  name,
  goals,
  side,
}: {
  name: string;
  goals: number | null;
  side: 'local' | 'visitante';
}) {
  const isKnown = !name.startsWith('Ganador') && !name.startsWith('Perdedor');
  const flag = isKnown ? getFlagEmoji(name) : null;
  return (
    <span
      className={`team ${side}`}
      style={{
        opacity: isKnown ? 1 : 0.5,
        fontStyle: isKnown ? 'normal' : 'italic',
      }}
    >
      {side === 'visitante' && goals !== null && <span className="score">{goals}</span>}
      {flag && <span style={{ marginRight: 4, flexShrink: 0 }}>{flag}</span>}
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </span>
      {side === 'local' && goals !== null && <span className="score">{goals}</span>}
    </span>
  );
}

export default function LlavesPage() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/partidos', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setPartidos(data.sort((a: Partido, b: Partido) => a.id - b.id)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const g: Record<string, Partido[]> = {};
    for (const p of partidos) {
      if (!g[p.ronda]) g[p.ronda] = [];
      g[p.ronda].push(p);
    }
    return g;
  }, [partidos]);

  const tercerLugar = grouped['TERCER_LUGAR']?.[0];
  const final = grouped['FINAL']?.[0];

  const someFinished = partidos.some((p) => p.estado === 'FINALIZADO');

  if (loading) return <LoadingSpinner text="Cargando llaves..." />;
  if (error)
    return (
      <div
        className="glass-card"
        style={{ padding: 40, textAlign: 'center', color: '#ef4444' }}
      >
        Error al cargar las llaves
      </div>
    );

  return (
    <AuthRedirect>
    <div>
      <div style={{ marginBottom: 24 }}>
        <Link
          href="/"
          style={{
            color: '#9ca3af',
            fontSize: '0.85rem',
            textDecoration: 'none',
          }}
        >
          ← Volver al Ranking
        </Link>
      </div>

      <h1
        style={{
          fontSize: '1.8rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #d4a843, #f0d78c)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        🏆 Resultado en Llaves
      </h1>
      <p
        style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.85rem',
          marginBottom: 32,
        }}
      >
        Fase eliminatoria &mdash; Mundial 2026
      </p>

      {partidos.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}
        >
          No hay partidos cargados
        </div>
      ) : (
        <>
          <div
            className={`glass-card bracket-wrapper ${someFinished ? 'bracket-finished' : ''}`}
            style={{ overflowX: 'auto', overflowY: 'hidden', padding: '20px 24px' }}
          >
            <div className="bracket-grid">
              {/* Column headers */}
              {RONDA_ORDER.map((ronda) => (
                <div
                  key={ronda}
                  className="bracket-round-label"
                  style={{ gridColumn: RONDA_ORDER.indexOf(ronda) + 1, gridRow: 1 }}
                >
                  {RONDA_LABELS[ronda]}
                </div>
              ))}

              {/* Rounds */}
              {RONDA_ORDER.map((ronda, rondaIdx) => {
                const matches = grouped[ronda] || [];
                return matches.map((match, matchIdx) => (
                  <div
                    key={match.id}
                    className="bracket-match"
                    style={{
                      gridColumn: rondaIdx + 1,
                      gridRow: gridRow(rondaIdx, matchIdx),
                    }}
                    title={`${match.equipo_local} vs ${match.equipo_visitante}`}
                  >
                    <TeamSide
                      name={match.equipo_local}
                      goals={match.goles_local_real}
                      side="local"
                    />
                    <span className="bracket-vs">vs</span>
                    <TeamSide
                      name={match.equipo_visitante}
                      goals={match.goles_visitante_real}
                      side="visitante"
                    />
                  </div>
                ));
              })}
            </div>
          </div>

          {/* Tercer lugar */}
          {tercerLugar && (
            <div
              className="glass-card"
              style={{
                marginTop: 24,
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 24,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#6b7280',
                }}
              >
                🥉 Tercer Puesto
              </span>
              <div className="third-place-divider" />
              <div className="third-place-card">
                <span className="team">
                  {tercerLugar.goles_local_real !== null && (
                    <span className="score">{tercerLugar.goles_local_real}</span>
                  )}
                  {getFlagEmoji(tercerLugar.equipo_local) && (
                    <span style={{ marginRight: 4 }}>{getFlagEmoji(tercerLugar.equipo_local)}</span>
                  )}
                  <span>{tercerLugar.equipo_local}</span>
                </span>
                <span className="third-place-vs">vs</span>
                <span className="team">
                  <span>{tercerLugar.equipo_visitante}</span>
                  {getFlagEmoji(tercerLugar.equipo_visitante) && (
                    <span style={{ marginLeft: 4 }}>{getFlagEmoji(tercerLugar.equipo_visitante)}</span>
                  )}
                  {tercerLugar.goles_visitante_real !== null && (
                    <span className="score">{tercerLugar.goles_visitante_real}</span>
                  )}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
    </AuthRedirect>
  );
}
