'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/resultados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': password,
        },
        body: JSON.stringify({ partidoId: 0, goles_local: 0, goles_visitante: 0 }),
      });

      if (res.status === 401) {
        setError('Token de administrador incorrecto');
        setLoading(false);
        return;
      }

      localStorage.setItem('admin_token', password);
      router.push(`/admin/resultados?token=${encodeURIComponent(password)}`);
    } catch {
      setError('Error de conexión');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '0 16px' }}>
      <div className="glass-card" style={{ padding: '40px 32px', textAlign: 'center' }}>
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🔐</span>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
          <span style={{ background: 'linear-gradient(135deg, #d4a843, #f0d78c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Admin
          </span>
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '24px' }}>
          Ingrese el token de administrador
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Token de administrador"
            className="input-field"
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}
            autoFocus
          />

          {error && (
            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</p>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !password}
            style={{ width: '100%' }}
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
