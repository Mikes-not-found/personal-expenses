import { months, formatEuro } from '../constants/categories';
const S = {
  header: { position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,14,20,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' },
  inner: { maxWidth: 1320, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 64 },
  title: { fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', letterSpacing: '-0.02em' },
  stats: { display: 'flex', alignItems: 'center', gap: 20 },
  label: { fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 },
  valW: { fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' },
  valA: { fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 14, color: 'var(--accent)' },
  div: { width: 1, height: 32, background: 'var(--border)' },
};
export function Header({ expenses }) {
  const mk = months[new Date().getMonth()];
  const mT = (expenses[mk] || []).reduce((a, e) => a + e.amount, 0);
  const yT = months.reduce((a, m) => a + (expenses[m] || []).reduce((b, e) => b + e.amount, 0), 0);
  return (
    <header style={S.header}>
      <div style={S.inner}>
        <h1 style={S.title}>Expense Tracker <span style={{ color: 'var(--accent)' }}>2026</span></h1>
        <div style={S.stats}>
          <div style={{ textAlign: 'right' }}>
            <div style={S.label}>This Month</div>
            <div style={S.valW}>{formatEuro(mT)}</div>
          </div>
          <div style={S.div} />
          <div style={{ textAlign: 'right' }}>
            <div style={S.label}>Year Total</div>
            <div style={S.valA}>{formatEuro(yT)}</div>
          </div>
        </div>
      </div>
    </header>
  );
}