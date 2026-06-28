/**
 * LoadingSpinner — Indicador de carga animado
 */

export default function LoadingSpinner({ size = 40, text }: { size?: number; text?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '40px 0',
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: '3px solid rgba(255, 255, 255, 0.06)',
          borderTop: '3px solid #d4a843',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {text && (
        <p style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: 500 }}>
          {text}
        </p>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
