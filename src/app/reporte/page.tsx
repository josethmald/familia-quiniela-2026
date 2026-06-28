'use client';

/**
 * Página de Reporte Diario (/reporte)
 *
 * RF-04: Selector de fecha con tabla de puntos por participante para esa jornada.
 * Incluye desglose opcional por partido (pronóstico vs resultado).
 * RF-06: Actualización automática cada 30 segundos.
 */

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import AuthRedirect from '@/components/AuthRedirect';

interface PartidoInfo {
  id: number;
  equipo_local: string;
  equipo_visitante: string;
  goles_local_real: number | null;
  goles_visitante_real: number | null;
  fecha: string;
}

interface DesglosePartido {
  partido_id: number;
  equipo_local: string;
  equipo_visitante: string;
  goles_local_real: number | null;
  goles_visitante_real: number | null;
  puntos: number;
  acierto_resultado: boolean;
  acierto_local: boolean;
  acierto_visitante: boolean;
}

interface ParticipanteReporte {
  participante_id: number;
  nombre: string;
  puntos_dia: number;
  partidos_perfectos: number;
  desglose: DesglosePartido[];
}

interface ReporteData {
  fecha: string;
  partidos_finalizados: number;
  partidos: PartidoInfo[];
  reporte: ParticipanteReporte[];
}

export default function ReportePage() {
  const [fecha, setFecha] = useState('');
  const [reporte, setReporte] = useState<ReporteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedParticipante, setExpandedParticipante] = useState<number | null>(null);

  // Fecha por defecto: hoy
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFecha(today);
  }, []);

  const fetchReporte = useCallback(async () => {
    if (!fecha) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/reporte-diario?fecha=${fecha}`, { cache: 'no-store' });
      if (!res.ok) {
        console.error('Error en respuesta del servidor:', res.status);
        setReporte(null);
        return;
      }
      const data = await res.json();
      setReporte(data);
    } catch (error) {
      console.error('Error al cargar reporte:', error);
      setReporte(null);
    } finally {
      setLoading(false);
    }
  }, [fecha]);

  useEffect(() => {
    if (fecha) {
      fetchReporte();

      // Actualización automática cada 30 segundos
      const interval = setInterval(fetchReporte, 30000);
      return () => clearInterval(interval);
    }
  }, [fecha, fetchReporte]);

  const getPointsClass = (puntos: number) => {
    if (puntos === 5) return 'points-5';
    if (puntos >= 3) return 'points-3-4';
    if (puntos >= 1) return 'points-1-2';
    return 'points-0';
  };

  return (
    <AuthRedirect>
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Link
          href="/"
          style={{
            color: '#9ca3af',
            textDecoration: 'none',
            fontSize: '0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '16px',
          }}
        >
          ← Volver al Ranking
        </Link>
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 800,
            marginBottom: '8px',
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
            📊 Reporte Diario
          </span>
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
          Puntos obtenidos por jornada (fecha)
        </p>
      </div>

      {/* Date Picker */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <label
            htmlFor="fecha-selector"
            style={{ color: '#9ca3af', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            Fecha:
          </label>
          <input
            id="fecha-selector"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="input-field"
            style={{ maxWidth: '220px' }}
          />
          {reporte && (
            <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>
              {reporte.partidos_finalizados} partido(s) finalizado(s)
            </span>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner text="Cargando reporte..." />
      ) : reporte ? (
        <>
          {/* Partidos del día */}
          {reporte.partidos.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: '#9ca3af' }}>
                Partidos de la Jornada
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '12px',
                }}
              >
                {reporte.partidos.map((p) => (
                  <div
                    key={p.id}
                    className="glass-card"
                    style={{ padding: '16px', textAlign: 'center' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                      }}
                    >
                      <span>{p.equipo_local}</span>
                      <span
                        style={{
                          background: 'linear-gradient(135deg, #d4a843, #f0d78c)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          fontSize: '1.2rem',
                          fontWeight: 800,
                          padding: '0 8px',
                        }}
                      >
                        {p.goles_local_real} - {p.goles_visitante_real}
                      </span>
                      <span>{p.equipo_visitante}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabla de puntos */}
          {reporte.partidos_finalizados > 0 ? (
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="ranking-table" id="reporte-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50px', textAlign: 'center' }}>#</th>
                      <th>Participante</th>
                      <th style={{ textAlign: 'center' }}>Puntos</th>
                      <th style={{ textAlign: 'center' }} className="hide-mobile">⭐ Perfectos</th>
                      <th style={{ width: '50px', textAlign: 'center' }}>Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporte.reporte.map((entry, index) => (
                      <React.Fragment key={entry.participante_id}>
                        <tr
                          id={`reporte-row-${entry.participante_id}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            setExpandedParticipante(
                              expandedParticipante === entry.participante_id
                                ? null
                                : entry.participante_id
                            )
                          }
                        >
                          <td style={{ textAlign: 'center', color: '#6b7280', fontWeight: 600 }}>
                            {index + 1}
                          </td>
                          <td>
                            <span style={{ fontWeight: 500 }}>{entry.nombre}</span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span
                              className={`points-badge ${getPointsClass(entry.puntos_dia)}`}
                            >
                              {entry.puntos_dia}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center', color: '#d4a843' }} className="hide-mobile">
                            {entry.partidos_perfectos}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span
                              style={{
                                fontSize: '1rem',
                                transition: 'transform 0.2s',
                                display: 'inline-block',
                                transform:
                                  expandedParticipante === entry.participante_id
                                    ? 'rotate(180deg)'
                                    : 'rotate(0)',
                              }}
                            >
                              ▾
                            </span>
                          </td>
                        </tr>
                        {/* Desglose expandible */}
                        {expandedParticipante === entry.participante_id && entry.desglose.length > 0 && (
                          <tr key={`desglose-${entry.participante_id}`}>
                            <td colSpan={5} style={{ padding: '0 16px 16px 16px', background: 'rgba(255,255,255,0.02)' }}>
                              <div
                                style={{
                                  display: 'grid',
                                  gap: '8px',
                                  paddingTop: '8px',
                                }}
                              >
                                {entry.desglose.map((d) => (
                                  <div
                                    key={d.partido_id}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '10px 14px',
                                      background: 'rgba(255,255,255,0.03)',
                                      borderRadius: '8px',
                                      fontSize: '0.8rem',
                                      flexWrap: 'wrap',
                                      gap: '8px',
                                    }}
                                  >
                                    <span style={{ color: '#9ca3af' }}>
                                      {d.equipo_local} {d.goles_local_real} - {d.goles_visitante_real} {d.equipo_visitante}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ color: d.acierto_resultado ? '#10b981' : '#6b7280', fontSize: '0.75rem' }}>
                                        {d.acierto_resultado ? '✅ Resultado' : ''}
                                      </span>
                                      <span style={{ color: d.acierto_local ? '#10b981' : '#6b7280', fontSize: '0.75rem' }}>
                                        {d.acierto_local ? '✅ Local' : ''}
                                      </span>
                                      <span style={{ color: d.acierto_visitante ? '#10b981' : '#6b7280', fontSize: '0.75rem' }}>
                                        {d.acierto_visitante ? '✅ Visitante' : ''}
                                      </span>
                                      <span className={`points-badge ${getPointsClass(d.puntos)}`}>
                                        {d.puntos} pts
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div
              className="glass-card"
              style={{
                padding: '60px 20px',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>📅</span>
              <p style={{ color: '#9ca3af', fontSize: '1rem' }}>
                No hay partidos finalizados en esta fecha
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '8px' }}>
                Seleccione otra fecha para ver resultados
              </p>
            </div>
          )}
        </>
      ) : null}
    </div>
    </AuthRedirect>
  );
}
