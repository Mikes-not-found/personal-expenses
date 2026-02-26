import { useMemo } from 'react';
import { months, monthNames, monthShortNames, formatEuro } from '../constants/categories';
import { getMonthlyTotals, getAvgTransactionByCategory, getSpendingByDayOfMonth } from '../utils/predictions';

// ── Colori categoria ───────────────────────────────────────────────────────
const CAT_COLORS = [
  '#4fc3f7','#66bb6a','#ffca28','#ef5350','#ab47bc',
  '#26c6da','#ff7043','#8d6e63','#42a5f5','#ec407a','#d4e157',
];

// ── Filtra expenses per mese se richiesto ──────────────────────────────────
function filterExpenses(expenses, filterMonth) {
  if (!filterMonth) return expenses;
  const filtered = {};
  months.forEach(m => { filtered[m] = []; });
  filtered[filterMonth] = expenses[filterMonth] || [];
  return filtered;
}

// ── Bar chart SVG mensile ──────────────────────────────────────────────────
function MonthlyBarChart({ expenses, filterMonth }) {
  const mT = useMemo(() => getMonthlyTotals(expenses), [expenses]);
  const W = 580, H = 130, BAR_W = 30, GAP = (W - months.length * BAR_W) / (months.length + 1);
  const maxVal = Math.max(...months.map(m => mT[m] || 0), 1);
  const activeTotals = months.map(m => mT[m] || 0).filter(v => v > 0);
  const avg = activeTotals.length > 1 ? activeTotals.reduce((s, v) => s + v, 0) / activeTotals.length : 0;

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={W} height={H + 32} style={{ display: 'block', minWidth: W }}>
        {/* Linea media */}
        {avg > 0 && (() => {
          const avgY = H - (avg / maxVal) * H;
          return (
            <g>
              <line x1={GAP} x2={W - GAP} y1={avgY} y2={avgY}
                stroke="rgba(255,202,40,0.4)" strokeWidth="1" strokeDasharray="4 3" />
              <text x={W - GAP + 2} y={avgY + 4} fontSize="8"
                fill="var(--c-amber)" fontFamily="JetBrains Mono, monospace">avg</text>
            </g>
          );
        })()}

        {months.map((m, i) => {
          const val = mT[m] || 0;
          const barH = val > 0 ? Math.max(4, (val / maxVal) * H) : 0;
          const x = GAP + i * (BAR_W + GAP);
          const y = H - barH;
          const isHighlighted = filterMonth === m;
          const isTop = val === maxVal && val > 0;
          const fillColor = isHighlighted
            ? 'rgba(79,195,247,0.9)'
            : isTop ? 'rgba(255,202,40,0.7)'
            : filterMonth ? 'rgba(79,195,247,0.2)'
            : 'rgba(79,195,247,0.55)';

          return (
            <g key={m}>
              <rect x={x} y={y} width={BAR_W} height={barH} rx={4} fill={fillColor}
                style={{ transition: 'fill 0.3s' }} />
              {val > 0 && (
                <text x={x + BAR_W / 2} y={y - 4} textAnchor="middle"
                  fontSize="8" fill={isTop ? 'var(--c-amber)' : 'var(--text-muted)'}
                  fontFamily="JetBrains Mono, monospace">
                  {Math.round(val)}
                </text>
              )}
              <text x={x + BAR_W / 2} y={H + 18} textAnchor="middle"
                fontSize="10"
                fill={isHighlighted ? 'var(--accent)' : val > 0 ? 'var(--text-secondary)' : 'var(--text-muted)'}
                fontWeight={isHighlighted ? '700' : '400'}
                fontFamily="inherit">
                {monthShortNames[m]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Donut chart SVG categorie ──────────────────────────────────────────────
function CategoryDonut({ expenses }) {
  const slices = useMemo(() => {
    const totals = {};
    months.forEach(m => {
      (expenses[m] || []).forEach(e => {
        totals[e.primary] = (totals[e.primary] || 0) + parseFloat(e.amount || 0);
      });
    });
    const total = Object.values(totals).reduce((s, v) => s + v, 0);
    if (total === 0) return [];
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, val], i) => ({ cat, val, pct: val / total, color: CAT_COLORS[i % CAT_COLORS.length] }));
  }, [expenses]);

  if (slices.length === 0) return <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>Nessun dato</p>;

  const R = 60, CX = 70, CY = 70, INNER = 36;
  let cumulAngle = -Math.PI / 2;

  const paths = slices.map(s => {
    const startAngle = cumulAngle;
    const sweepAngle = s.pct * 2 * Math.PI;
    cumulAngle += sweepAngle;
    const endAngle = cumulAngle;
    const x1 = CX + R * Math.cos(startAngle), y1 = CY + R * Math.sin(startAngle);
    const x2 = CX + R * Math.cos(endAngle),   y2 = CY + R * Math.sin(endAngle);
    const xi1 = CX + INNER * Math.cos(startAngle), yi1 = CY + INNER * Math.sin(startAngle);
    const xi2 = CX + INNER * Math.cos(endAngle),   yi2 = CY + INNER * Math.sin(endAngle);
    const largeArc = sweepAngle > Math.PI ? 1 : 0;
    const d = `M ${xi1} ${yi1} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${INNER} ${INNER} 0 ${largeArc} 0 ${xi1} ${yi1} Z`;
    return { ...s, d };
  });

  const total = slices.reduce((s, v) => s + v.val, 0);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
      <svg width={140} height={140} style={{ flexShrink: 0 }}>
        {paths.map((p, i) => (
          <path key={i} d={p.d} fill={p.color} opacity={0.85} />
        ))}
        <text x={CX} y={CY - 6} textAnchor="middle" fontSize="9"
          fill="var(--text-muted)" fontFamily="inherit">totale</text>
        <text x={CX} y={CY + 9} textAnchor="middle" fontSize="12" fontWeight="700"
          fill="var(--text-primary)" fontFamily="JetBrains Mono, monospace">
          {Math.round(total)}€
        </text>
      </svg>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 4 }}>
        {slices.slice(0, 8).map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.cat}</span>
            <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', flexShrink: 0 }}>
              {(s.pct * 100).toFixed(0)}%
            </span>
            <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)', flexShrink: 0, width: 60, textAlign: 'right' }}>
              {formatEuro(s.val)}
            </span>
          </div>
        ))}
        {slices.length > 8 && (
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{slices.length - 8} altre</span>
        )}
      </div>
    </div>
  );
}

// ── Heatmap giorni del mese ────────────────────────────────────────────────
function DayHeatmap({ expenses }) {
  const dayData = useMemo(() => getSpendingByDayOfMonth(expenses), [expenses]);
  const maxDay = Math.max(...dayData.map(d => d.total), 1);
  const hasData = dayData.some(d => d.total > 0);

  if (!hasData) return (
    <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
      Nessun dato per questo mese
    </p>
  );

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {dayData.map(({ day, total }) => {
          const intensity = total / maxDay;
          const bg = total === 0
            ? 'var(--bg-interactive)'
            : `rgba(79,195,247,${0.12 + intensity * 0.78})`;
          return (
            <div key={day} title={`Giorno ${day}: ${formatEuro(total)}`} style={{
              aspectRatio: '1',
              borderRadius: 5,
              background: bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              color: intensity > 0.55 ? 'var(--bg-base)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              cursor: 'default',
              transition: 'background 0.3s',
              fontWeight: intensity > 0.3 ? '700' : '400',
            }}>
              {day}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
        <div style={{ height: 8, width: 40, borderRadius: 4, background: 'linear-gradient(90deg, var(--bg-interactive), rgba(79,195,247,0.9))' }} />
        <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>meno → più spesa</span>
      </div>
    </div>
  );
}

// ── Tabella ticket medio ───────────────────────────────────────────────────
function AvgTicketTable({ expenses }) {
  const data = useMemo(() => getAvgTransactionByCategory(expenses), [expenses]);
  if (data.length === 0) return (
    <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>Nessun dato</p>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', gap: 10, padding: '0 0 6px', borderBottom: '1px solid var(--border)', marginBottom: 2 }}>
        <span style={{ width: 20 }} />
        <span style={{ flex: 1, fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Categoria</span>
        <span style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', width: 72, textAlign: 'right' }}>Avg</span>
        <span style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', width: 44, textAlign: 'right' }}>N op.</span>
      </div>

      {data.slice(0, 10).map(({ category, avg, count }, i) => (
        <div key={category} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '7px 0',
          borderBottom: i < Math.min(data.length, 10) - 1 ? '1px solid var(--border)' : 'none',
          animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: 5,
            background: `${CAT_COLORS[i % CAT_COLORS.length]}22`,
            border: `1px solid ${CAT_COLORS[i % CAT_COLORS.length]}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, color: CAT_COLORS[i % CAT_COLORS.length], fontWeight: 700, flexShrink: 0,
          }}>{i + 1}</div>
          <span style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{category}</span>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', width: 72, textAlign: 'right', fontWeight: 600 }}>{formatEuro(avg)}</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', width: 44, textAlign: 'right' }}>{count}</span>
        </div>
      ))}
    </div>
  );
}

// ── Card insight uniforme ──────────────────────────────────────────────────
function InsightCard({ title, subtitle, children, fullWidth, minH }) {
  return (
    <div className="card-hover" style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      overflow: 'hidden',
      gridColumn: fullWidth ? '1 / -1' : undefined,
      display: 'flex',
      flexDirection: 'column',
      minHeight: minH || 220,
    }}>
      <div style={{ padding: '13px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</span>
        {subtitle && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{subtitle}</span>}
      </div>
      <div style={{ padding: '14px 18px', flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

// ── Pannello principale ────────────────────────────────────────────────────
export function InsightsPanel({ expenses, filterMonth }) {
  const filtered = useMemo(() => filterExpenses(expenses, filterMonth), [expenses, filterMonth]);
  const subtitle = filterMonth ? `· ${monthNames[filterMonth]}` : '· anno intero';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

      {/* Bar chart a tutta larghezza */}
      <InsightCard title="📊 Spesa mensile" subtitle="barra = totale · linea tratteggiata = media" fullWidth minH={210}>
        <MonthlyBarChart expenses={expenses} filterMonth={filterMonth} />
      </InsightCard>

      {/* Donut categorie */}
      <InsightCard title="🍩 Categorie" subtitle={subtitle} minH={220}>
        <CategoryDonut expenses={filtered} />
      </InsightCard>

      {/* Heatmap giorni */}
      <InsightCard title="🗓️ Giorni caldi" subtitle={subtitle} minH={220}>
        <DayHeatmap expenses={filtered} />
      </InsightCard>

      {/* Ticket medio */}
      <InsightCard title="🎫 Ticket medio" subtitle={`importo medio / operazione${subtitle}`} minH={220}>
        <AvgTicketTable expenses={filtered} />
      </InsightCard>

    </div>
  );
}
