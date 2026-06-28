'use client';

/**
 * Toast — Sistema de notificaciones
 *
 * Muestra mensajes de éxito o error con animación de entrada/salida.
 */

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icon = type === 'success' ? '✅' : '❌';
  const bgColor =
    type === 'success'
      ? 'rgba(16, 185, 129, 0.15)'
      : 'rgba(239, 68, 68, 0.15)';
  const borderColor =
    type === 'success'
      ? 'rgba(16, 185, 129, 0.3)'
      : 'rgba(239, 68, 68, 0.3)';
  const textColor = type === 'success' ? '#34d399' : '#fca5a5';

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        padding: '16px 20px',
        borderRadius: '12px',
        fontSize: '0.9rem',
        fontWeight: 500,
        zIndex: 9999,
        backdropFilter: 'blur(16px)',
        maxWidth: '400px',
        background: bgColor,
        border: `1px solid ${borderColor}`,
        color: textColor,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transform: visible ? 'translateX(0)' : 'translateX(120%)',
        opacity: visible ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      <span>{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: textColor,
          cursor: 'pointer',
          marginLeft: 'auto',
          fontSize: '1rem',
          opacity: 0.7,
          padding: '0 0 0 8px',
        }}
        aria-label="Cerrar notificación"
      >
        ✕
      </button>
    </div>
  );
}
