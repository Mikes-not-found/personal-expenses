import { months, monthShortNames } from '../constants/categories';
const base = { border: 'none', outline: 'none', cursor: 'pointer', flexShrink: 0, padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, transition: 'all 0.2s', fontFamily: 'inherit' };
const on  = { ...base, background: 'var(--accent-muted)', color: 'var(--accent)', boxShadow: 'inset 0 -2px 0 var(--accent)' };
const off = { ...base, background: 'transparent', color: 'var(--text-secondary)' };
export function NavTabs({ activeView, onChangeView }) {
  return (
    <nav style={{ position: 'sticky', top: 64, zIndex: 40, background: 'rgba(10,14,20,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
      <div className="scrollbar-none" style={{ maxWidth: 1320, margin: '0 auto', padding: '8px 24px', display: 'flex', gap: 4, overflowX: 'auto' }}>
        <button style={activeView === 'dashboard' ? on : off} onClick={() => onChangeView('dashboard')}>Dashboard</button>
        {months.map(m => (
          <button key={m} style={activeView === m ? on : off} onClick={() => onChangeView(m)}>{monthShortNames[m]}</button>
        ))}
      </div>
    </nav>
  );
}