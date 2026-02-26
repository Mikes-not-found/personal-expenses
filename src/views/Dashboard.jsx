import { useState, useMemo } from 'react';
import { months, monthNames, monthShortNames, categories, formatEuro } from '../constants/categories';
import { StatsGrid } from '../components/StatsGrid';
import { SpendingRow } from '../components/ProgressBar';
import { PredictionsPanel } from '../components/PredictionsPanel';
import { InsightsPanel } from '../components/InsightsPanel';
import {
  getMonthlyTotals,
  getActiveMonths,
  getMonthlyAverage,
  getCategoryMonthlyAverage,
  getCategoryDataPoints,
  getMonthAlertLevel,
  getCategoryAlertLevel,
  getAllMoMDeltas,
} from '../utils/predictions';

// ── Stile select condiviso ─────────────────────────────────────────────────
const selStyle = {
  background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8,
  padding: '7px 12px', fontSize: 13, color: 'var(--text-primary)',
  outline: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.2s',
};

// ── Tab bar ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',    label: 'Panoramica',  icon: '📊' },
  { id: 'predictions', label: 'Previsioni',  icon: '📈' },
  { id: 'insights',    label: 'Insights',    icon: '🔬' },
];

function TabBar({ active, onSelect }) {
  return (
    <div style={{
      display: 'flex', gap: 4,
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: 5,
    }}>
      {TABS.map(t => {
        const isActive = t.id === active;
        return (
          <button key={t.id} onClick={() => onSelect(t.id)} style={{
            flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            padding: '10px 16px',
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: isActive ? 700 : 500,
            fontFamily: 'inherit',
            color: isActive ? 'var(--bg-base)' : 'var(--text-muted)',
            background: isActive
              ? 'linear-gradient(135deg, var(--accent), #81d4fa)'
              : 'transparent',
            transition: 'all 0.2s ease',
            letterSpacing: isActive ? 0 : '0.01em',
            boxShadow: isActive ? '0 2px 12px rgba(79,195,247,0.3)' : 'none',
          }}>
            <span style={{ fontSize: 15 }}>{t.icon}</span>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Card contenitore uniforme ──────────────────────────────────────────────
function SectionCard({ title, badge, children, minH }) {
  return (
    <div className="card-hover" style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      minHeight: minH || 0,
    }}>
      <div style={{
        padding: '13px 18px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</span>
        {badge && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{badge}</span>}
      </div>
      <div style={{ padding: '10px 16px', flex: 1, overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

// ── Vista Panoramica ───────────────────────────────────────────────────────
function OverviewTab({ expenses, yT, mT, cT, sT, filtTotal, hasFilter, fMonth, fCat, setFMonth, setFCat, monthlyAvg, catAvgs, catDataPts, momDeltas, activeCount }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, animation: 'fadeIn 0.3s ease' }}>

      {/* KPI */}
      <StatsGrid expenses={expenses} />

      {/* Barra filtri */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '12px 18px',
      }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Filtra</span>
        <select style={selStyle} value={fMonth} onChange={e => setFMonth(e.target.value)}>
          <option value="">Tutti i mesi</option>
          {months.map(m => <option key={m} value={m}>{monthNames[m]}</option>)}
        </select>
        <select style={selStyle} value={fCat} onChange={e => setFCat(e.target.value)}>
          <option value="">Tutte le categorie</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {hasFilter && (
          <button onClick={() => { setFMonth(''); setFCat(''); }}
            style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-interactive)', border: '1px solid var(--border)', cursor: 'pointer', padding: '5px 10px', borderRadius: 6 }}>
            ✕ reset
          </button>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
            {hasFilter ? 'Filtrato' : 'Anno'}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 20, color: 'var(--accent)', animation: 'numPop 0.4s ease' }}>
            {formatEuro(hasFilter ? filtTotal : yT)}
          </span>
        </div>
      </div>

      {/* 3 colonne breakdown — stessa minHeight */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>

        <SectionCard title="📅 Mesi" badge={`${activeCount} attivi`} minH={420}>
          {months.map(m => (
            <SpendingRow key={m} name={monthShortNames[m]} amount={mT[m] || 0} total={yT}
              alertLevel={getMonthAlertLevel(mT[m] || 0, monthlyAvg, activeCount)}
              avg={activeCount >= 2 ? monthlyAvg : null}
              momDelta={momDeltas[m]} showMom={true} />
          ))}
        </SectionCard>

        <SectionCard title="🏷️ Categorie" badge={`${Object.keys(cT).length} voci`} minH={420}>
          {Object.entries(cT).sort((a, b) => b[1] - a[1]).map(([c, a]) => (
            <SpendingRow key={c} name={c} amount={a} total={yT}
              alertLevel={getCategoryAlertLevel(a, catAvgs[c] || 0, catDataPts[c] || 0)}
              avg={catDataPts[c] >= 2 ? catAvgs[c] : null} />
          ))}
          {Object.keys(cT).length === 0 && <p style={{ fontSize: 13, color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>Nessun dato</p>}
        </SectionCard>

        <SectionCard title="🔖 Sottocategorie" badge={`${Object.entries(sT).filter(([s, a]) => s && a > 0).length} voci`} minH={420}>
          {Object.entries(sT).filter(([s, a]) => s && a > 0).sort((a, b) => b[1] - a[1]).map(([s, a]) => (
            <SpendingRow key={s} name={s} amount={a} total={yT} />
          ))}
          {Object.entries(sT).filter(([s, a]) => s && a > 0).length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>Nessun dato</p>
          )}
        </SectionCard>

      </div>
    </div>
  );
}

// ── Vista Previsioni ───────────────────────────────────────────────────────
function PredictionsTab({ expenses }) {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <PredictionsPanel expenses={expenses} />
    </div>
  );
}

// ── Vista Insights ─────────────────────────────────────────────────────────
function InsightsTab({ expenses }) {
  const [fMonth, setFMonth] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'fadeIn 0.3s ease' }}>
      {/* Filtro mese locale per insights */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '10px 16px',
      }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Filtra mese
        </span>
        <select style={selStyle} value={fMonth} onChange={e => setFMonth(e.target.value)}>
          <option value="">Tutti i mesi</option>
          {months.map(m => <option key={m} value={m}>{monthNames[m]}</option>)}
        </select>
        {fMonth && (
          <button onClick={() => setFMonth('')}
            style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-interactive)', border: '1px solid var(--border)', cursor: 'pointer', padding: '5px 10px', borderRadius: 6 }}>
            ✕ tutti
          </button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>
          {fMonth ? `Dati di ${monthNames[fMonth]}` : 'Dati annuali completi'}
        </span>
      </div>

      <InsightsPanel expenses={expenses} filterMonth={fMonth} />
    </div>
  );
}

// ── Dashboard principale ───────────────────────────────────────────────────
export function Dashboard({ expenses }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [fMonth, setFMonth] = useState('');
  const [fCat,   setFCat]   = useState('');

  const yT        = useMemo(() => months.reduce((s, m) => s + (expenses[m] || []).reduce((a, e) => a + parseFloat(e.amount || 0), 0), 0), [expenses]);
  const mT        = useMemo(() => getMonthlyTotals(expenses), [expenses]);
  const cT        = useMemo(() => { const t = {}; months.forEach(m => (expenses[m] || []).forEach(e => { t[e.primary] = (t[e.primary] || 0) + parseFloat(e.amount || 0); })); return t; }, [expenses]);
  const sT        = useMemo(() => { const t = {}; months.forEach(m => (expenses[m] || []).forEach(e => { const s = e.secondary || ''; if (s.trim()) t[s] = (t[s] || 0) + parseFloat(e.amount || 0); })); return t; }, [expenses]);
  const filtTotal = useMemo(() => { let t = 0; months.forEach(m => { if (fMonth && m !== fMonth) return; (expenses[m] || []).forEach(e => { if (fCat && e.primary !== fCat) return; t += parseFloat(e.amount || 0); }); }); return t; }, [expenses, fMonth, fCat]);

  const activeCount = useMemo(() => getActiveMonths(expenses).length, [expenses]);
  const monthlyAvg  = useMemo(() => getMonthlyAverage(expenses), [expenses]);
  const catAvgs     = useMemo(() => getCategoryMonthlyAverage(expenses), [expenses]);
  const catDataPts  = useMemo(() => getCategoryDataPoints(expenses), [expenses]);
  const momDeltas   = useMemo(() => getAllMoMDeltas(expenses), [expenses]);
  const hasFilter   = !!(fMonth || fCat);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, animation: 'fadeIn 0.35s ease' }}>
      <TabBar active={activeTab} onSelect={setActiveTab} />

      {activeTab === 'overview' && (
        <OverviewTab
          expenses={expenses} yT={yT} mT={mT} cT={cT} sT={sT}
          filtTotal={filtTotal} hasFilter={hasFilter}
          fMonth={fMonth} fCat={fCat} setFMonth={setFMonth} setFCat={setFCat}
          monthlyAvg={monthlyAvg} catAvgs={catAvgs} catDataPts={catDataPts}
          momDeltas={momDeltas} activeCount={activeCount}
        />
      )}
      {activeTab === 'predictions' && <PredictionsTab expenses={expenses} />}
      {activeTab === 'insights'    && <InsightsTab    expenses={expenses} />}
    </div>
  );
}
