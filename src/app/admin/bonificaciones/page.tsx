'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import Toast from '@/components/Toast';
import AdminNav from '@/components/AdminNav';

interface ToastData {
  message: string;
  type: 'success' | 'error';
}

interface PrediccionesData {
  reales: Record<string, string>;
  predicciones: Record<string, { campeon: string; subcampeon: string; goleador: string }>;
}

interface ResultadoPreview {
  puntos: number;
  detalle: Record<string, { predijo: string; acerto: boolean; puntos: number }>;
}

export default function AdminBonificacionesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [campeon, setCampeon] = useState('');
  const [subCampeon, setSubCampeon] = useState('');
  const [goleador, setGoleador] = useState('');
  const [predicciones, setPredicciones] = useState<PrediccionesData['predicciones']>({});
  const [resultados, setResultados] = useState<Record<string, ResultadoPreview> | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const token = getAdminToken();
      const res = await fetch('/api/admin/bonificaciones', {
        headers: token ? { 'x-admin-token': token } : {},
      });
      if (!res.ok) throw new Error();
      const data: PrediccionesData = await res.json();
      setPredicciones(data.predicciones);
      setCampeon(data.reales?.CAMPEON || '');
      setSubCampeon(data.reales?.SUB_CAMPEON || '');
      setGoleador(data.reales?.GOLEADOR || '');
    } catch {
      setToast({ message: 'Error al cargar datos', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/bonificaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': getAdminToken(),
        },
        body: JSON.stringify({ campeon, sub_campeon: subCampeon, goleador }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResultados(data.resultados);
      setCampeon(data.reales?.CAMPEON || '');
      setSubCampeon(data.reales?.SUB_CAMPEON || '');
      setGoleador(data.reales?.GOLEADOR || '');
      setToast({ message: 'Bonificaciones guardadas y calculadas', type: 'success' });
    } catch {
      setToast({ message: 'Error al guardar', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  function getAdminToken(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token') || new URLSearchParams(window.location.search).get('token') || '';
    }
    return '';
  }

  useEffect(() => {
    if (!getAdminToken()) router.push('/admin');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  const totalBonus = resultados
    ? Object.values(resultados).reduce((sum, r) => sum + r.puntos, 0)
    : 0;

  if (loading) return <LoadingSpinner text="Cargando bonificaciones..." />;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Link href="/" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.85rem' }}>
          ← Volver al Ranking
        </Link>
        <button onClick={handleLogout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>
          Cerrar sesión
        </button>
      </div>

      <AdminNav />

      <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '4px' }}>
        <span style={{ background: 'linear-gradient(135deg, #d4a843, #f0d78c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          🏆 Bonificaciones
        </span>
      </h1>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '32px' }}>
        Ingrese los resultados reales de campeón, subcampeón y goleador
      </p>

      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: '1fr' }}>
        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '24px', maxWidth: '500px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#9ca3af', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '6px' }}>
              🥇 Campeón (+6 pts)
            </label>
            <input className="input-field" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px' }} value={campeon} onChange={(e) => setCampeon(e.target.value)} placeholder="Ej: Argentina" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#9ca3af', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '6px' }}>
              🥈 Subcampeón (+4 pts)
            </label>
            <input className="input-field" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px' }} value={subCampeon} onChange={(e) => setSubCampeon(e.target.value)} placeholder="Ej: Francia" />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#9ca3af', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '6px' }}>
              ⚽ Goleador (+3 pts)
            </label>
            <input className="input-field" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px' }} value={goleador} onChange={(e) => setGoleador(e.target.value)} placeholder="Ej: Mbappé" />
          </div>
          <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%' }}>
            {submitting ? 'Guardando...' : '💾 Guardar y Calcular'}
          </button>
        </form>

        {/* Predicciones de participantes */}
        {Object.keys(predicciones).length > 0 && (
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="ranking-table">
                <thead>
                  <tr>
                    <th>Participante</th>
                    <th style={{ textAlign: 'center' }}>🥇 Campeón</th>
                    <th style={{ textAlign: 'center' }}>🥈 Sub</th>
                    <th style={{ textAlign: 'center' }}>⚽ Goleador</th>
                    {resultados && <th style={{ textAlign: 'center' }}>🎯 Bonus</th>}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(predicciones).map(([nombre, pred]) => (
                    <tr key={nombre}>
                      <td style={{ fontWeight: 600 }}>{nombre}</td>
                      <td style={{ textAlign: 'center', color: pred.campeon === campeon ? '#10b981' : '#9ca3af' }}>
                        {pred.campeon || '—'}
                      </td>
                      <td style={{ textAlign: 'center', color: pred.subcampeon === subCampeon ? '#10b981' : '#9ca3af' }}>
                        {pred.subcampeon || '—'}
                      </td>
                      <td style={{ textAlign: 'center', color: pred.goleador.toLowerCase() === goleador.toLowerCase() ? '#10b981' : '#9ca3af' }}>
                        {pred.goleador || '—'}
                      </td>
                      {resultados && (
                        <td style={{ textAlign: 'center', fontWeight: 800, color: '#d4a843' }}>
                          +{resultados[nombre]?.puntos || 0}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {resultados && (
          <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              🎯 Total puntos bonus otorgados
            </span>
            <span style={{ fontWeight: 800, fontSize: '1.3rem', background: 'linear-gradient(135deg, #d4a843, #f0d78c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {totalBonus} pts
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
