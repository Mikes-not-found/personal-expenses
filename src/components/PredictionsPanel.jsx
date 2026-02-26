import { useMemo } from 'react';
import { formatEuro } from '../constants/categories';
import {
  getActiveMonths,
  getYearProjection,
  getCategoryProjections,
  getSavingsTips,
} from '../utils/predictions';

// ── Frasi motivazionali basate sul trend di spesa ──────────────────────────
const MOTIVATION_POSITIVE = [
  'Ogni euro risparmiato oggi è libertà domani. Stai costruendo qualcosa di solido. 💎',
  'La consapevolezza è già metà del lavoro — e tu ce l\'hai. Continua così! 🚀',
  'Non si tratta di spendere meno, ma di spendere meglio. Stai imparando. 🌱',
  'Il bilancio è come una bussola: ti aiuta a non perderti. La tua punta nella giusta direzione. 🧭',
];
const MOTIVATION_WARN = [
  'Ogni piccola ottimizzazione conta. Anche tagliare 50€ al mese fa 600€ in un anno. 💡',
  'Non servono grandi sacrifici — bastano piccole scelte più consapevoli ogni giorno. 🎯',
  'Stai già facendo la cosa più importante: monitorare. Ora è il momento di affinare. ⚙️',
  'Il controllo delle spese non è una punizione, è un superpotere. Usalo. 💪',
];
const MOTIVATION_ALERT = [
  'Va bene, ci sono mesi così. L\'importante è accorgersene — e tu lo hai fatto. 🛠️',
  'Non giudicare il mese peggiore: analizzalo. Cosa si può fare diversamente? 🔍',
  'Il primo passo per migliorare è guardare i numeri in faccia. Stai facendo proprio questo. 👁️',
];

function getMotivationalMessage(projection) {
  const { projected, avgUsed, remaining } = projection;
  if (remaining === 0) return { text: 'Anno completato — hai monitorato ogni mese. Ottimo lavoro! 🎉', color: 'var(--c-green)' };
  const ratio = projected / (avgUsed * 12);
  const seed = Math.floor(Date.now() / 3600000); // cambia ogni ora
  if (ratio <= 0.7) {
    const msgs = [
      '🌟 Stai andando benissimo! A questo ritmo chiudi l\'anno con ampio margine.',
      '🏆 Ritmo eccellente. Sei nella zona verde — mantienila e il futuro ti ringrazierà.',
      ...MOTIVATION_POSITIVE,
    ];
    return { text: msgs[seed % msgs.length], color: 'var(--c-green)' };
  }
  if (ratio <= 0.9) {
    const msgs = [
      '👍 Buon ritmo! Sei sulla strada giusta — qualche piccola attenzione e puoi fare ancora meglio.',
      '✅ Sotto controllo. Continua a monitorare e sarai a posto a fine anno.',
      ...MOTIVATION_POSITIVE,
    ];
    return { text: msgs[seed % msgs.length], color: 'var(--c-green)' };
  }
  if (ratio <= 1.05) {
    const msgs = [
      '⚡ Il ritmo è sostenibile, ma sei vicino al limite. Tieni d\'occhio le categorie arancioni.',
      '⚖️ Equilibrio instabile. Un piccolo taglio su 1-2 categorie ti rimette in carreggiata.',
      ...MOTIVATION_WARN,
    ];
    return { text: msgs[seed % msgs.length], color: 'var(--c-amber)' };
  }
  if (ratio <= 1.3) {
    const msgs = [
      '⚠️ Stai spendendo un po\' sopra la media. Guarda i suggerimenti sotto per intervenire.',
      '📌 Momento di fare un piccolo check. I Savings Tips qui sotto mostrano dove agire.',
      ...MOTIVATION_WARN,
    ];
    return { text: msgs[seed % msgs.length], color: 'var(--c-amber)' };
  }
  const msgs = [
    '🔴 Attenzione: il ritmo attuale potrebbe pesare a fine anno. È il momento di agire!',
    '🚨 Qualcosa non torna. Analizza le categorie rosse e taglia dove puoi.',
    ...MOTIVATION_ALERT,
  ];
  return { text: msgs[seed % msgs.length], color: 'var(--c-red)' };
}

// ── Banner proiezione principale ───────────────────────────────────────────
function ProjectionBanner({ projection, activeCount }) {
  const { projected, current, remaining, avgUsed } = projection;
  const motivation = getMotivationalMessage(projection);
  const projColor = remaining === 0
    ? 'var(--c-green)'
    : projected > avgUsed * 12 * 1.2 ? 'var(--c-red)'
    : projected > avgUsed * 12       ? 'var(--c-amber)'
    : 'var(--accent)';
  const borderColor = remaining === 0
    ? 'var(--c-green)'
    : projected > avgUsed * 12 * 1.2 ? 'var(--c-red)'
    : projected > avgUsed * 12       ? 'var(--c-amber)'
    : 'var(--accent)';

  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: `1px solid ${borderColor}`,
      borderRadius: 14,
      padding: '22px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      animation: 'slideDown 0.4s ease',
    }}>
      <div style={{
        fontSize: 13, color: motivation.color, fontWeight: 500,
        padding: '8px 14px', borderRadius: 8,
        background: `color-mix(in srgb, ${motivation.color} 8%, transparent)`,
        borderLeft: `3px solid ${motivation.color}`,
        animation: 'fadeIn 0.5s ease 0.2s both',
      }}>
        {motivation.text}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>
            Proiezione a fine anno
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 700, color: projColor, animation: 'countUp 0.6s ease' }}>
            {formatEuro(projected)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5 }}>
            basato su <strong style={{ color: 'var(--text-secondary)' }}>{activeCount} mes{activeCount !== 1 ? 'i' : 'e'}</strong> di dati reali
            {remaining > 0 && <> · ancora <strong style={{ color: 'var(--text-secondary)' }}>{remaining} mes{remaining !== 1 ? 'i' : 'e'}</strong> da stimare</>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
          <StatMini label="Speso finora"   value={formatEuro(current)}  color="var(--text-primary)" />
          <StatMini label="Media mensile"  value={formatEuro(avgUsed)}  color="var(--c-amber)" />
          <StatMini label="Mesi rimanenti" value={remaining}             color="var(--text-primary)" />
        </div>
      </div>
    </div>
  );
}

function StatMini({ label, value, color }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color }}>{value}</div>
    </div>
  );
}

// ── Riga proiezione categoria ──────────────────────────────────────────────
function CategoryProjectionRow({ category, current, projected, index }) {
  const progressPct = projected > 0 ? Math.min(100, (current / projected) * 100) : 0;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0',
      borderBottom: '1px solid var(--border)',
      animation: `fadeIn 0.3s ease ${index * 0.05}s both`,
    }}>
      <span style={{ width: 88, flexShrink: 0, fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{category}</span>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{formatEuro(current)} ora</span>
          <span style={{ fontSize: 10, color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatEuro(projected)} a dic</span>
        </div>
        <div style={{ height: 5, borderRadius: 3, background: 'var(--bg-interactive)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 3,
            background: 'linear-gradient(90deg, rgba(79,195,247,0.6), rgba(79,195,247,0.3))',
            width: `${progressPct.toFixed(1)}%`,
            transition: 'width 0.8s ease',
            animation: 'barGrow 0.9s ease-out',
          }} />
        </div>
      </div>
      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', width: 36, textAlign: 'right', flexShrink: 0 }}>
        {progressPct.toFixed(0)}%
      </span>
    </div>
  );
}

// ── Card risparmio singola categoria con 3 scenari ─────────────────────────
function SavingsTipCard({ category, monthlyAvg, saving10pct, saving20pct, saving30pct, annualSaving10pct, annualSaving20pct, annualSaving30pct, index }) {
  const scenarios = [
    { pct: 10, label: '10%', saving: saving10pct, annual: annualSaving10pct, barColor: 'rgba(255,202,40,0.55)',  textColor: 'var(--c-amber)'  },
    { pct: 20, label: '20%', saving: saving20pct, annual: annualSaving20pct, barColor: 'rgba(102,187,106,0.65)', textColor: 'var(--c-green)'  },
    { pct: 30, label: '30%', saving: saving30pct, annual: annualSaving30pct, barColor: 'rgba(102,187,106,0.9)',  textColor: 'var(--c-green)'  },
  ];

  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '12px 14px',
      animation: `slideUp 0.35s ease ${index * 0.06}s both`,
    }}>
      {/* Header categoria */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {category}
        </span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexShrink: 0, marginLeft: 8 }}>
          {formatEuro(monthlyAvg)}<span style={{ fontSize: 8 }}>/mese</span>
        </span>
      </div>

      {/* Scenari 10 / 20 / 30 % */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {scenarios.map(({ pct, label, saving, annual, barColor, textColor }, si) => (
          <div key={pct}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                Taglia del <strong style={{ color: textColor }}>{label}</strong>
              </span>
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: textColor, fontWeight: 700 }}>
                +{formatEuro(annual)}/anno
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--bg-interactive)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2, background: barColor,
                  width: `${pct}%`,
                  animation: `barGrow 0.7s ease-out ${si * 0.08}s both`,
                }} />
              </div>
              <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', width: 52, textAlign: 'right' }}>
                {formatEuro(saving)}/mese
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Componente principale ──────────────────────────────────────────────────
export function PredictionsPanel({ expenses }) {
  const activeMonths = useMemo(() => getActiveMonths(expenses), [expenses]);
  const projection   = useMemo(() => getYearProjection(expenses), [expenses]);
  const catProj      = useMemo(() => getCategoryProjections(expenses), [expenses]);
  const savingsTips  = useMemo(() => getSavingsTips(expenses), [expenses]);

  if (activeMonths.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ProjectionBanner projection={projection} activeCount={activeMonths.length} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* ── Category Projections ── */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 12, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>🗺️ Proiezioni categoria</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>a fine dicembre</span>
          </div>
          <div style={{ padding: '4px 20px 12px', overflowY: 'auto', maxHeight: 380 }}>
            {catProj.length === 0
              ? <p style={{ fontSize: 13, color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>Nessun dato ancora</p>
              : catProj.map((c, i) => <CategoryProjectionRow key={c.category} {...c} index={i} />)
            }
          </div>
        </div>

        {/* ── Savings Tips — tutte le categorie, 3 scenari ── */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 12, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>💡 Dove puoi risparmiare</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>scenari 10 · 20 · 30%</span>
          </div>
          <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', maxHeight: 380 }}>
            {savingsTips.length === 0
              ? <p style={{ fontSize: 13, color: 'var(--text-muted)', padding: '20px 0', textAlign: 'center' }}>Non abbastanza dati</p>
              : savingsTips.map((tip, i) => <SavingsTipCard key={tip.category} {...tip} index={i} />)
            }
          </div>
        </div>

      </div>
    </div>
  );
}
