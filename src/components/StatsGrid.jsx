import { formatEuro, months, monthNames } from '../constants/categories';
import { getBiggestOverspend } from '../utils/predictions';

function StatCard({ icon, label, value, sub, valueColor, accent }) {
  return (
    <div className="card-hover" style={{
      background: 'var(--bg-surface)',
      border: `1px solid ${accent ? 'rgba(79,195,247,0.2)' : 'var(--border)'}`,
      borderRadius: 14,
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      animation: 'fadeIn 0.4s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
        <span style={{ fontSize: 15 }}>{icon}</span>
        <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--text-muted)', fontWeight: 700 }}>{label}</span>
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700,
        color: valueColor || 'var(--text-primary)',
        animation: 'numPop 0.5s ease',
        letterSpacing: '-0.01em',
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{sub}</div>
      )}
    </div>
  );
}

export function StatsGrid({ expenses }) {
  const yT = months.reduce((s, m) => s + (expenses[m] || []).reduce((a, e) => a + parseFloat(e.amount || 0), 0), 0);
  const mT = {};
  months.forEach(m => { mT[m] = (expenses[m] || []).reduce((s, e) => s + parseFloat(e.amount || 0), 0); });
  const activeMonths = months.filter(m => mT[m] > 0);
  const active = activeMonths.length || 1;
  let topM = 'jan', topA = 0;
  Object.entries(mT).forEach(([m, a]) => { if (a > topA) { topA = a; topM = m; } });
  const count = months.reduce((c, m) => c + (expenses[m] || []).length, 0);
  const overspend = getBiggestOverspend(expenses);
  const remaining = 12 - activeMonths.length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(148px, 1fr))', gap: 12 }}>
      <StatCard
        icon="💰" label="Totale 2026"
        value={formatEuro(yT)}
        sub={`${active} mes${active !== 1 ? 'i' : 'e'} registrat${active !== 1 ? 'i' : 'o'}`}
        accent
      />
      <StatCard
        icon="📅" label="Media mensile"
        value={formatEuro(yT / active)}
        sub={`su ${active} mes${active !== 1 ? 'i' : 'e'} attivi`}
        valueColor="var(--c-amber)"
      />
      <StatCard
        icon="🏆" label="Mese top"
        value={monthNames[topM]}
        sub={topA > 0 ? formatEuro(topA) : 'nessun dato'}
        valueColor="var(--c-green)"
      />
      <StatCard
        icon="🧾" label="Transazioni"
        value={count}
        sub={`~${active > 0 ? Math.round(count / active) : 0} al mese`}
      />
      <StatCard
        icon="⚠️" label="Overspend"
        value={overspend ? overspend.category : '—'}
        sub={overspend ? `×${overspend.ratio.toFixed(1)} rispetto alla media` : 'Dati insufficienti'}
        valueColor={overspend ? 'var(--c-red)' : 'var(--text-muted)'}
      />
    </div>
  );
}