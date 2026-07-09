'use client';

/**
 * Página de carga de resultados — solo administrador (/admin/resultados)
 *
 * RF-02: Carga de resultados reales (administrador)
 * - Selector de partido pendiente
 * - Campos: goles local, goles visitante
 * - Botón "Cargar resultado" → POST a /api/resultados
 * - Mensaje de éxito/error
 * - Después de cargar, el partido desaparece del selector
 */

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import Toast from '@/components/Toast';
import AdminNav from '@/components/AdminNav';

interface PartidoPendiente {
  id: number;
  fecha: string;
  equipo_local: string;
  equipo_visitante: string;
  estado: string;
}

interface ToastData {
  message: string;
  type: 'success' | 'error';
}

export default function AdminResultadosPage() {
  const router = useRouter();
  const [partidos, setPartidos] = useState<PartidoPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPartido, setSelectedPartido] = useState<number | null>(null);
  const [golesLocal, setGolesLocal] = useState('');
  const [golesVisitante, setGolesVisitante] = useState('');
  const [ganadorPenales, setGanadorPenales] = useState<'local' | 'visitante' | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  const fetchPartidos = useCallback(async () => {
    try {
      const res = await fetch('/api/partidos/pendientes', { cache: 'no-store' });
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
  }, []);

  useEffect(() => {
    fetchPartidos();
  }, [fetchPartidos]);

  // Reset penal winner when scores change
  useEffect(() => {
    setGanadorPenales(null);
  }, [golesLocal, golesVisitante]);

  const selectedMatch = partidos.find((p) => p.id === selectedPartido);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPartido) {
      setToast({ message: 'Seleccione un partido', type: 'error' });
      return;
    }

    const golesL = parseInt(golesLocal, 10);
    const golesV = parseInt(golesVisitante, 10);

    if (isNaN(golesL) || isNaN(golesV) || golesL < 0 || golesV < 0 || golesL > 15 || golesV > 15) {
      setToast({ message: 'Los goles deben ser enteros entre 0 y 15', type: 'error' });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/resultados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': getAdminToken(),
        },
        body: JSON.stringify({
          partidoId: selectedPartido,
          goles_local: golesL,
          goles_visitante: golesV,
          ...(golesL === golesV && ganadorPenales ? { ganador_penales: ganadorPenales } : {}),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({
          message: `✅ ${data.resultado} — Puntos calculados para ${data.participantes_calculados} participantes`,
          type: 'success',
        });

        // Limpiar formulario y recargar partidos
        setSelectedPartido(null);
        setGolesLocal('');
        setGolesVisitante('');
        setGanadorPenales(null);
        fetchPartidos();
      } else {
        setToast({ message: data.error || 'Error al cargar resultado', type: 'error' });
      }
    } catch {
      setToast({ message: 'Error de conexión', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Obtener token de localStorage o URL
  function getAdminToken(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token') || new URLSearchParams(window.location.search).get('token') || '';
    }
    return '';
  }

  // Redirigir al login si no hay token
  useEffect(() => {
    if (!getAdminToken()) {
      router.push('/admin');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
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

  if (loading) return <LoadingSpinner text="Cargando partidos pendientes..." />;

  return (
    <div>
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Link
            href="/"
            style={{
              color: '#9ca3af',
              textDecoration: 'none',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ← Volver al Ranking
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#9ca3af',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Cerrar sesión
          </button>
        </div>

        <AdminNav />

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
            ⚙️ Cargar Resultados
          </span>
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
          Seleccione un partido pendiente y registre el marcador final
        </p>
      </div>

      {partidos.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: '60px 20px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🎉</span>
          <p style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 600 }}>
            ¡Todos los partidos han sido finalizados!
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '8px' }}>
            No hay partidos pendientes por cargar
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '24px', maxWidth: '600px' }}>
          {/* Form Card */}
          <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '24px' }}>
            {/* Selector de partido */}
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="partido-selector"
                style={{
                  display: 'block',
                  color: '#9ca3af',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '8px',
                }}
              >
                Partido
              </label>
              <select
                id="partido-selector"
                className="select-field"
                value={selectedPartido ?? ''}
                onChange={(e) => setSelectedPartido(e.target.value ? parseInt(e.target.value, 10) : null)}
              >
                <option value="">— Seleccione un partido —</option>
                {partidos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.equipo_local} vs {p.equipo_visitante} — {formatDate(p.fecha)}
                  </option>
                ))}
              </select>
            </div>

            {/* Match Preview */}
            {selectedMatch && (
              <div
                style={{
                  background: 'rgba(212, 168, 67, 0.05)',
                  border: '1px solid rgba(212, 168, 67, 0.15)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  marginBottom: '20px',
                }}
              >
                <div style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '8px' }}>
                  {formatDate(selectedMatch.fecha)}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px',
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    {selectedMatch.equipo_local}
                  </span>
                  <span style={{ color: '#6b7280', fontWeight: 600 }}>VS</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    {selectedMatch.equipo_visitante}
                  </span>
                </div>
              </div>
            )}

            {/* Goals Inputs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <div>
                <label
                  htmlFor="goles-local"
                  style={{
                    display: 'block',
                    color: '#9ca3af',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '8px',
                  }}
                >
                  Goles Local
                </label>
                <input
                  id="goles-local"
                  type="number"
                  min="0"
                  max="15"
                  className="input-field"
                  value={golesLocal}
                  onChange={(e) => setGolesLocal(e.target.value)}
                  placeholder="0"
                  required
                  style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800 }}
                />
              </div>
              <div>
                <label
                  htmlFor="goles-visitante"
                  style={{
                    display: 'block',
                    color: '#9ca3af',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '8px',
                  }}
                >
                  Goles Visitante
                </label>
                <input
                  id="goles-visitante"
                  type="number"
                  min="0"
                  max="15"
                  className="input-field"
                  value={golesVisitante}
                  onChange={(e) => setGolesVisitante(e.target.value)}
                  placeholder="0"
                  required
                  style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800 }}
                />
              </div>
            </div>

            {/* Penalty selector: visible only when scores are equal */}
            {golesLocal !== '' && golesVisitante !== '' && parseInt(golesLocal) === parseInt(golesVisitante) && (
              <div
                style={{
                  marginBottom: '24px',
                  padding: '16px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}
              >
                <p style={{ color: '#fca5a5', fontWeight: 700, fontSize: '0.85rem', marginBottom: '12px' }}>
                  ⚠️ Empate — ¿Ganador en penales?
                </p>
                {selectedMatch && (
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setGanadorPenales('local')}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: ganadorPenales === 'local' ? '2px solid #d4a843' : '1px solid rgba(255,255,255,0.1)',
                        background: ganadorPenales === 'local' ? 'rgba(212, 168, 67, 0.15)' : 'rgba(255,255,255,0.04)',
                        color: '#f9fafb',
                        fontWeight: ganadorPenales === 'local' ? 700 : 500,
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      {selectedMatch.equipo_local}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGanadorPenales('visitante')}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: ganadorPenales === 'visitante' ? '2px solid #d4a843' : '1px solid rgba(255,255,255,0.1)',
                        background: ganadorPenales === 'visitante' ? 'rgba(212, 168, 67, 0.15)' : 'rgba(255,255,255,0.04)',
                        color: '#f9fafb',
                        fontWeight: ganadorPenales === 'visitante' ? 700 : 500,
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      {selectedMatch.equipo_visitante}
                    </button>
                  </div>
                )}
                {ganadorPenales && (
                  <p style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '8px' }}>
                    ✅ Ganador: {ganadorPenales === 'local' ? selectedMatch?.equipo_local : selectedMatch?.equipo_visitante}
                  </p>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || !selectedPartido}
              style={{ width: '100%' }}
              id="submit-resultado"
            >
              {submitting ? 'Cargando...' : '⚽ Cargar Resultado'}
            </button>
          </form>

          {/* Pending Matches List */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h2
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '16px',
              }}
            >
              Partidos Pendientes ({partidos.length})
            </h2>
            <div style={{ display: 'grid', gap: '8px' }}>
              {partidos.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background:
                      selectedPartido === p.id
                        ? 'rgba(212, 168, 67, 0.1)'
                        : 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    border:
                      selectedPartido === p.id
                        ? '1px solid rgba(212, 168, 67, 0.2)'
                        : '1px solid transparent',
                  }}
                  onClick={() => setSelectedPartido(p.id)}
                >
                  <span style={{ fontWeight: 500 }}>
                    {p.equipo_local} vs {p.equipo_visitante}
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                    {formatDate(p.fecha)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
