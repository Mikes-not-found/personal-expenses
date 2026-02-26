import { months } from '../constants/categories';

// ═══════════════════════════════════════════
// SEZIONE 1 - Aggregazioni base
// ═══════════════════════════════════════════

export function getMonthlyTotals(expenses) {
  const t = {};
  months.forEach(m => {
    t[m] = (expenses[m] || []).reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  });
  return t;
}

export function getCategoryTotals(expenses) {
  const t = {};
  months.forEach(m => {
    (expenses[m] || []).forEach(e => {
      t[e.primary] = (t[e.primary] || 0) + parseFloat(e.amount || 0);
    });
  });
  return t;
}

export function getYearTotal(expenses) {
  return months.reduce((s, m) =>
    s + (expenses[m] || []).reduce((a, e) => a + parseFloat(e.amount || 0), 0), 0);
}

// ═══════════════════════════════════════════
// SEZIONE 2 - Mesi attivi e medie
// ═══════════════════════════════════════════

export function getActiveMonths(expenses) {
  return months.filter(m => (expenses[m] || []).length > 0);
}

export function getMonthlyAverage(expenses) {
  const active = getActiveMonths(expenses);
  if (active.length === 0) return 0;
  return getYearTotal(expenses) / active.length;
}

// Per ogni categoria: media mensile calcolata solo sui mesi in cui ha spese
export function getCategoryMonthlyAverage(expenses) {
  const catMonthTotals = {}; // { Housing: { jan: 450, feb: 450 }, ... }
  months.forEach(m => {
    (expenses[m] || []).forEach(e => {
      if (!catMonthTotals[e.primary]) catMonthTotals[e.primary] = {};
      catMonthTotals[e.primary][m] = (catMonthTotals[e.primary][m] || 0) + parseFloat(e.amount || 0);
    });
  });
  const avgs = {};
  Object.entries(catMonthTotals).forEach(([cat, monthMap]) => {
    const vals = Object.values(monthMap);
    avgs[cat] = vals.reduce((s, v) => s + v, 0) / vals.length;
  });
  return avgs;
}

// Quanti mesi di dati ha ogni categoria
export function getCategoryDataPoints(expenses) {
  const points = {};
  months.forEach(m => {
    const seen = new Set();
    (expenses[m] || []).forEach(e => {
      if (!seen.has(e.primary)) {
        points[e.primary] = (points[e.primary] || 0) + 1;
        seen.add(e.primary);
      }
    });
  });
  return points;
}

// ═══════════════════════════════════════════
// SEZIONE 3 - Alert "Spendo troppo"
// ═══════════════════════════════════════════

export function getMonthAlertLevel(amount, avgMonthly, activeMonthsCount) {
  if (activeMonthsCount < 2 || avgMonthly === 0 || amount === 0) return 'normal';
  if (amount > avgMonthly * 1.5) return 'danger';
  if (amount > avgMonthly * 1.2) return 'warning';
  return 'normal';
}

// Confronta il totale cumulativo vs la media × numero di mesi (non vs media mensile singola)
// Questo evita falsi positivi: se hai 2 mesi e la media mensile è 200, il totale atteso è 400
export function getCategoryAlertLevel(categoryTotal, categoryAvg, dataPointsCount) {
  if (dataPointsCount < 2 || categoryAvg === 0 || categoryTotal === 0) return 'normal';
  // Spesa attesa = media mensile × mesi in cui la categoria ha dati
  const expected = categoryAvg * dataPointsCount;
  if (categoryTotal > expected * 1.6) return 'danger';
  if (categoryTotal > expected * 1.25) return 'warning';
  return 'normal';
}

export function getBiggestOverspend(expenses) {
  const active = getActiveMonths(expenses);
  if (active.length < 2) return null;
  const catAvgs = getCategoryMonthlyAverage(expenses);
  const catTotals = getCategoryTotals(expenses);
  const catPoints = getCategoryDataPoints(expenses);
  let best = null;
  Object.entries(catTotals).forEach(([cat, total]) => {
    const avg = catAvgs[cat] || 0;
    const pts = catPoints[cat] || 0;
    if (pts < 2 || avg === 0) return;
    const ratio = total / avg;
    if (ratio > 1.5 && (!best || ratio > best.ratio)) {
      best = { category: cat, ratio, amount: total, avg };
    }
  });
  return best;
}

// ═══════════════════════════════════════════
// SEZIONE 4 - MoM (Month-over-Month)
// ═══════════════════════════════════════════

export function getMoMDelta(monthKey, monthlyTotals) {
  const idx = months.indexOf(monthKey);
  if (idx <= 0) return { delta: null, direction: 'first', formatted: '—' };

  // Cerca il mese precedente con dati (non necessariamente idx-1 se saltato)
  let prevKey = null;
  for (let i = idx - 1; i >= 0; i--) {
    if (monthlyTotals[months[i]] > 0) { prevKey = months[i]; break; }
  }
  if (!prevKey) return { delta: null, direction: 'first', formatted: '—' };

  const curr = monthlyTotals[monthKey] || 0;
  const prev = monthlyTotals[prevKey] || 0;

  if (curr === 0 && prev === 0) return { delta: 0, direction: 'same', formatted: '—' };
  if (prev === 0 && curr > 0) return { delta: null, direction: 'up', formatted: 'new' };

  const delta = ((curr - prev) / prev) * 100;
  const direction = delta > 0.5 ? 'up' : delta < -0.5 ? 'down' : 'same';
  const formatted = `${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`;
  return { delta, direction, formatted };
}

export function getAllMoMDeltas(expenses) {
  const mT = getMonthlyTotals(expenses);
  const result = {};
  months.forEach(m => { result[m] = getMoMDelta(m, mT); });
  return result;
}

// ═══════════════════════════════════════════
// SEZIONE 5 - Proiezioni fine anno
// ═══════════════════════════════════════════

export function getYearProjection(expenses) {
  const active = getActiveMonths(expenses);
  if (active.length === 0) return { projected: 0, current: 0, remaining: 12, avgUsed: 0 };

  const current = getYearTotal(expenses);
  const avgUsed = current / active.length;

  // Mesi rimanenti = mesi dopo l'ultimo mese attivo
  const lastActiveIdx = months.indexOf(active[active.length - 1]);
  const remaining = 11 - lastActiveIdx; // mesi ancora da venire

  const projected = current + avgUsed * remaining;
  return { projected, current, remaining, avgUsed };
}

export function getCategoryProjections(expenses) {
  const active = getActiveMonths(expenses);
  if (active.length === 0) return [];

  const lastActiveIdx = months.indexOf(active[active.length - 1]);
  const remaining = 11 - lastActiveIdx;

  const catAvgs = getCategoryMonthlyAverage(expenses);
  const catTotals = getCategoryTotals(expenses);

  return Object.entries(catTotals)
    .map(([category, current]) => {
      const monthlyAvg = catAvgs[category] || 0;
      const projected = current + monthlyAvg * remaining;
      return { category, current, projected, monthlyAvg };
    })
    .sort((a, b) => b.projected - a.projected);
}

// ═══════════════════════════════════════════
// SEZIONE 6 - Suggerimenti risparmio
// ═══════════════════════════════════════════

// Tutte le categorie con almeno 1 mese di dati, con scenari 10/20/30%
export function getSavingsTips(expenses) {
  const active = getActiveMonths(expenses);
  if (active.length === 0) return [];

  const catAvgs = getCategoryMonthlyAverage(expenses);

  return Object.entries(catAvgs)
    .filter(([, avg]) => avg > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([category, monthlyAvg]) => ({
      category,
      monthlyAvg,
      saving10pct: monthlyAvg * 0.1,
      saving20pct: monthlyAvg * 0.2,
      saving30pct: monthlyAvg * 0.3,
      annualSaving10pct: monthlyAvg * 0.1 * 12,
      annualSaving20pct: monthlyAvg * 0.2 * 12,
      annualSaving30pct: monthlyAvg * 0.3 * 12,
    }));
}

// Dati aggiuntivi per insights
export function getTopExpenseDay(expenses) {
  const dayCounts = {};
  months.forEach(m => {
    (expenses[m] || []).forEach(e => {
      const key = `${e.date}/${m}`;
      dayCounts[key] = (dayCounts[key] || 0) + parseFloat(e.amount || 0);
    });
  });
  if (Object.keys(dayCounts).length === 0) return null;
  return Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];
}

// Spesa media per giorno del mese (1-31) su tutti i mesi
export function getSpendingByDayOfMonth(expenses) {
  const dayTotals = {};
  const dayCounts = {};
  months.forEach(m => {
    (expenses[m] || []).forEach(e => {
      const d = parseInt(e.date);
      if (!d) return;
      dayTotals[d] = (dayTotals[d] || 0) + parseFloat(e.amount || 0);
      dayCounts[d] = (dayCounts[d] || 0) + 1;
    });
  });
  return Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    total: dayTotals[i + 1] || 0,
    count: dayCounts[i + 1] || 0,
  }));
}

// Velocità di spesa: importo medio per transazione per categoria
export function getAvgTransactionByCategory(expenses) {
  const totals = {};
  const counts = {};
  months.forEach(m => {
    (expenses[m] || []).forEach(e => {
      const cat = e.primary;
      totals[cat] = (totals[cat] || 0) + parseFloat(e.amount || 0);
      counts[cat] = (counts[cat] || 0) + 1;
    });
  });
  return Object.entries(totals)
    .map(([cat, total]) => ({ category: cat, avg: total / (counts[cat] || 1), count: counts[cat] || 0 }))
    .sort((a, b) => b.avg - a.avg);
}

// Trend mensile per categoria (solo mesi attivi)
export function getCategoryMonthlyTrend(expenses, category) {
  return months.map(m => ({
    month: m,
    total: (expenses[m] || [])
      .filter(e => e.primary === category)
      .reduce((s, e) => s + parseFloat(e.amount || 0), 0),
  })).filter(d => d.total > 0);
}
