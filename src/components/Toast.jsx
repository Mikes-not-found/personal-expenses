const colors = { success: 'var(--c-green)', error: 'var(--c-red)', info: 'var(--accent)' };
export function ToastContainer({ toasts }) {
  if (toasts.length === 0) return null;
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{ padding: '12px 20px', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 500, boxShadow: '0 4px 24px rgba(0,0,0,0.3)', background: colors[t.type] || 'var(--accent)', animation: 'toastIn 0.3s ease-out' }}>{t.message}</div>
      ))}
    </div>
  );
}