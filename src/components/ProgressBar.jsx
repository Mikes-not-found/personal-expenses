import { formatEuro } from '../constants/categories';

const barColors = {
  normal:  'rgba(79,195,247,0.5)',
  warning: 'rgba(255,202,40,0.6)',
  danger:  'rgba(239,83,80,0.65)',
};

// ── Badge con tooltip contestuale ─────────────────────────────────────────
// avgLabel: es. "media €347" — spiega rispetto a cosa
// overpct: es. +82% — quanto sopra la media
function AlertBadge({ alertLevel, avgLabel, overPct }) {
  if (alertLevel === 'normal') {
    // slot vuoto per tenere il layout
    return <span style={{ width: 70, flexShrink: 0 }} />;
  }

  const isHigh   = alertLevel === 'danger';
  const color    = isHigh ? 'var(--c-red)' : 'var(--c-amber)';
  const bgColor  = isHigh ? 'var(--c-red-muted)' : 'var(--c-amber-muted)';
  const label    = overPct != null ? `+${overPct}% avg` : (isHigh ? 'alto' : 'alto');
  const tooltip  = avgLabel ? `${isHigh ? '🔴 Spesa alta' : '🟡 Sopra la media'} · ${avgLabel}` : '';

  return (
    <span
      title={tooltip}
      style={{
        width: 70, flexShrink: 0,
        fontSize: 9, fontWeight: 700,
        padding: '2px 5px', borderRadius: 4,
        letterSpacing: '0.02em', textAlign: 'center',
        background: bgColor, color,
        cursor: tooltip ? 'help' : 'default',
        whiteSpace: 'nowrap', overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'inline-block',
      }}>
      ↑ {label}
    </span>
  );
}

export function SpendingRow({
  name, amount, total,
  alertLevel = 'normal',
  avg = null,          // valore medio per calcolare tooltip
  momDelta = null, showMom = false,
}) {
  const pct    = total > 0 ? ((amount / total) * 100) : 0;
  const pctStr = pct.toFixed(1);

  // Calcola delta % vs media se disponibile
  const overPct  = (avg != null && avg > 0)
    ? Math.round(((amount - avg) / avg) * 100)
    : null;
  const avgLabel = (avg != null && avg > 0)
    ? `media ${formatEuro(avg)}`
    : null;

  const momColor = momDelta
    ? momDelta.direction === 'down' ? 'var(--c-green)'
    : momDelta.direction === 'up'   ? 'var(--c-red)'
    : 'var(--text-muted)'
    : 'transparent';
  const momText = momDelta && momDelta.direction !== 'first'
    ? `${momDelta.direction === 'down' ? '↓' : momDelta.direction === 'up' ? '↑' : '—'}${momDelta.formatted}`
    : '';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0' }}>
      {/* Nome */}
      <span style={{ width: 68, flexShrink: 0, fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>

      {/* Badge contestuale — 70px fissi */}
      <AlertBadge alertLevel={alertLevel} avgLabel={avgLabel} overPct={overPct} />

      {/* Barra */}
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--bg-interactive)', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 3, background: barColors[alertLevel] || barColors.normal, width: `${pctStr}%`, transition: 'width 0.7s', animation: 'barGrow 0.8s ease-out' }} />
      </div>

      {/* Importo */}
      <span style={{ width: 84, flexShrink: 0, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)' }}>{formatEuro(amount)}</span>

      {/* % sul totale */}
      <span style={{ width: 40, flexShrink: 0, textAlign: 'right', fontSize: 11, color: 'var(--text-muted)' }}>{pctStr}%</span>

      {/* MoM */}
      {showMom && (
        <span style={{ width: 54, flexShrink: 0, textAlign: 'right', fontSize: 10, fontFamily: 'var(--font-mono)', color: momColor }}>
          {momText}
        </span>
      )}
    </div>
  );
}
export function SectionCard({ title, children }) {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
      </div>
      <div style={{ padding: '10px 20px', maxHeight: 400, overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}