export function EmptyState({ onAdd }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.25, fontFamily: 'var(--font-mono)' }}>&lt;/&gt;</div>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>No expenses recorded</h3>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Click "Add Expense" to start tracking this month</p>
      <button onClick={onAdd} style={{ padding: '10px 22px', background: 'var(--accent)', color: '#0a0e14', fontWeight: 600, fontSize: 13, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>+ Add Expense</button>
    </div>
  );
}