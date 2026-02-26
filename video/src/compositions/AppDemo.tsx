import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
} from "remotion";
import React from "react";

// ── Design tokens ──────────────────────────────────────────────────────────
const T = {
  bgBase:        "#0a0e14",
  bgSurface:     "#111820",
  bgElevated:    "#1a2230",
  bgInteractive: "#253040",
  accent:        "#4fc3f7",
  accentHover:   "#81d4fa",
  green:         "#66bb6a",
  red:           "#ef5350",
  amber:         "#ffca28",
  purple:        "#ab47bc",
  textPrimary:   "#e3e8ef",
  textSecondary: "#8899aa",
  textMuted:     "#556677",
  border:        "rgba(255,255,255,0.07)",
  mono:          "'Courier New', monospace",
  sans:          "'Segoe UI', system-ui, sans-serif",
};

// ── Dati mock reali ────────────────────────────────────────────────────────
const MOCK_MONTHLY = [
  { m: "Gen", v: 591.16 }, { m: "Feb", v: 818.74 },
  { m: "Mar", v: 0 }, { m: "Apr", v: 0 }, { m: "Mag", v: 0 },
  { m: "Giu", v: 0 }, { m: "Lug", v: 0 }, { m: "Ago", v: 0 },
  { m: "Set", v: 0 }, { m: "Ott", v: 0 }, { m: "Nov", v: 0 }, { m: "Dic", v: 0 },
];
const MOCK_CATS = [
  { c: "Transport", v: 447.65, pct: 31.8, alert: true  },
  { c: "Out",       v: 343.99, pct: 24.4, alert: true  },
  { c: "Leisure",   v: 213.78, pct: 15.2, alert: true  },
  { c: "Health",    v: 158.00, pct: 11.2, alert: false },
  { c: "Travel",    v: 106.00, pct: 7.5,  alert: false },
  { c: "Gifts",     v: 69.90,  pct: 5.0,  alert: false },
];
const TOTAL = 1409.90;
const AVG   = 704.95;

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n: number) => `€ ${n.toFixed(2).replace(".", ",")}`;

function useFade(start: number, dur = 18) {
  const frame = useCurrentFrame();
  return interpolate(frame - start, [0, dur], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });
}

function useSlideIn(start: number, delay = 0) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - start - delay, config: { damping: 18, mass: 0.8, stiffness: 120 } });
  return { opacity: s, transform: `translateY(${interpolate(s, [0, 1], [22, 0])}px)` };
}

// ══════════════════════════════════════════════════════════════════════════
// SCENE 1 — Intro
// ══════════════════════════════════════════════════════════════════════════
function SceneIntro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ fps, frame, config: { damping: 14, stiffness: 90, mass: 1 } });
  const titleOp   = interpolate(frame, [20, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOp     = interpolate(frame, [40, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pillsOp   = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const features = ["📊 KPI in tempo reale", "📈 Proiezioni anno", "💡 Savings tips", "🔬 Grafici avanzati"];

  return (
    <AbsoluteFill style={{ background: T.bgBase, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 0, fontFamily: T.sans }}>
      {/* Glow background */}
      <div style={{
        position: "absolute", width: 600, height: 600,
        borderRadius: "50%", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, rgba(79,195,247,0.08) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Logo */}
      <div style={{
        fontSize: 90, transform: `scale(${logoScale})`,
        filter: "drop-shadow(0 0 30px rgba(79,195,247,0.4))",
        marginBottom: 24,
      }}>💰</div>

      {/* Titolo */}
      <div style={{ opacity: titleOp, textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 52, fontWeight: 800, color: T.textPrimary, letterSpacing: "-0.02em", lineHeight: 1 }}>
          Personal Expenses
        </div>
        <div style={{ fontSize: 18, color: T.accent, fontFamily: T.mono, marginTop: 10, letterSpacing: "0.08em" }}>
          2026 · Desktop App
        </div>
      </div>

      {/* Subtitle */}
      <div style={{ opacity: subOp, fontSize: 16, color: T.textSecondary, marginTop: 18, maxWidth: 500, textAlign: "center", lineHeight: 1.6 }}>
        Traccia, analizza e prevedi le tue spese personali.<br />
        Dark UI · React + Electron · Appwrite
      </div>

      {/* Feature pills */}
      <div style={{ opacity: pillsOp, display: "flex", gap: 12, marginTop: 40, flexWrap: "wrap", justifyContent: "center" }}>
        {features.map((f, i) => (
          <div key={i} style={{
            background: T.bgElevated, border: `1px solid ${T.border}`,
            borderRadius: 20, padding: "8px 18px",
            fontSize: 13, color: T.textSecondary, fontWeight: 500,
          }}>{f}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SCENE 2 — Tab Panoramica
// ══════════════════════════════════════════════════════════════════════════
function KpiCard({ label, value, sub, color, idx, startFrame }: {
  label: string; value: string; sub: string; color: string; idx: number; startFrame: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ fps, frame: frame - startFrame - idx * 5, config: { damping: 18, stiffness: 110 } });
  return (
    <div style={{
      flex: 1, background: T.bgSurface, border: `1px solid ${T.border}`,
      borderRadius: 14, padding: "20px 18px",
      opacity: s, transform: `translateY(${interpolate(s, [0, 1], [16, 0])}px)`,
      display: "flex", flexDirection: "column", gap: 6, minHeight: 110,
    }}>
      <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>{label}</div>
      <div style={{ fontFamily: T.mono, fontSize: 26, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 11, color: T.textMuted }}>{sub}</div>
    </div>
  );
}

function BarRow({ name, v, total, alert, idx, startFrame }: {
  name: string; v: number; total: number; alert: boolean; idx: number; startFrame: number;
}) {
  const frame = useCurrentFrame();
  const pct = (v / total) * 100;
  const delay = startFrame + idx * 4;
  const barPct = interpolate(frame - delay, [0, 25], [0, pct], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const rowOp = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", opacity: rowOp }}>
      <span style={{ width: 80, fontSize: 11, color: T.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
      {alert ? (
        <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: "rgba(255,202,40,0.15)", color: T.amber, width: 55, textAlign: "center", flexShrink: 0 }}>↑ sopra avg</span>
      ) : (
        <span style={{ width: 55, flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, height: 5, borderRadius: 3, background: T.bgInteractive, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 3, background: alert ? "rgba(255,202,40,0.55)" : "rgba(79,195,247,0.5)", width: `${barPct}%` }} />
      </div>
      <span style={{ width: 70, textAlign: "right", fontFamily: T.mono, fontSize: 11, color: T.textPrimary }}>{fmt(v)}</span>
      <span style={{ width: 36, textAlign: "right", fontSize: 10, color: T.textMuted }}>{pct.toFixed(1)}%</span>
    </div>
  );
}

function SceneOverview() {
  const frame = useCurrentFrame();
  const titleSlide = useSlideIn(0, 0);
  const tabOp = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: T.bgBase, padding: "28px 40px", fontFamily: T.sans, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Tab bar */}
      <div style={{ opacity: tabOp, display: "flex", gap: 4, background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 5, width: "fit-content" }}>
        {[
          { icon: "📊", label: "Panoramica", active: true },
          { icon: "📈", label: "Previsioni",  active: false },
          { icon: "🔬", label: "Insights",    active: false },
        ].map(t => (
          <div key={t.label} style={{
            padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: t.active ? 700 : 500,
            background: t.active ? "linear-gradient(135deg, #4fc3f7, #81d4fa)" : "transparent",
            color: t.active ? T.bgBase : T.textMuted,
            display: "flex", gap: 6, alignItems: "center",
            boxShadow: t.active ? "0 2px 12px rgba(79,195,247,0.3)" : "none",
          }}>
            <span>{t.icon}</span>{t.label}
          </div>
        ))}
      </div>

      {/* KPI Cards */}
      <div style={{ display: "flex", gap: 12 }}>
        <KpiCard label="Totale 2026"    value={fmt(TOTAL)} sub="2 mesi registrati"     color={T.textPrimary} idx={0} startFrame={10} />
        <KpiCard label="Media mensile"  value={fmt(AVG)}   sub="su 2 mesi attivi"      color={T.amber}       idx={1} startFrame={10} />
        <KpiCard label="Mese top"       value="February"    sub={`€ 818,74`}            color={T.green}       idx={2} startFrame={10} />
        <KpiCard label="Transazioni"    value="52"          sub="~26 al mese"           color={T.textPrimary} idx={3} startFrame={10} />
        <KpiCard label="Overspend"      value="Out"         sub="×2.0 rispetto media"   color={T.red}         idx={4} startFrame={10} />
      </div>

      {/* 2-col breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 12, flex: 1 }}>
        {/* Mesi */}
        <div style={{
          background: T.bgSurface, border: `1px solid ${T.border}`,
          borderRadius: 14, overflow: "hidden", ...useSlideIn(20, 0) as any,
        }}>
          <div style={{ padding: "11px 16px", borderBottom: `1px solid ${T.border}`, fontSize: 12, fontWeight: 700, color: T.textPrimary }}>
            📅 Mesi · <span style={{ color: T.textMuted, fontWeight: 400, fontSize: 10 }}>2 attivi</span>
          </div>
          <div style={{ padding: "6px 14px" }}>
            {MOCK_MONTHLY.slice(0, 6).map((d, i) => {
              const op = interpolate(frame - (20 + i * 4), [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={d.m} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", opacity: op }}>
                  <span style={{ width: 28, fontSize: 11, color: T.textSecondary }}>{d.m}</span>
                  <div style={{ flex: 1, height: 5, borderRadius: 3, background: T.bgInteractive, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, background: d.v > AVG ? "rgba(255,202,40,0.6)" : "rgba(79,195,247,0.5)", width: `${(d.v / 900) * 100}%` }} />
                  </div>
                  <span style={{ width: 60, textAlign: "right", fontFamily: T.mono, fontSize: 10, color: T.textPrimary }}>{d.v > 0 ? fmt(d.v) : "—"}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categorie */}
        <div style={{
          background: T.bgSurface, border: `1px solid ${T.border}`,
          borderRadius: 14, overflow: "hidden", ...useSlideIn(20, 6) as any,
        }}>
          <div style={{ padding: "11px 16px", borderBottom: `1px solid ${T.border}`, fontSize: 12, fontWeight: 700, color: T.textPrimary }}>
            🏷️ Categorie · <span style={{ color: T.textMuted, fontWeight: 400, fontSize: 10 }}>9 voci</span>
          </div>
          <div style={{ padding: "6px 14px" }}>
            {MOCK_CATS.map((d, i) => (
              <BarRow key={d.c} name={d.c} v={d.v} total={TOTAL} alert={d.alert} idx={i} startFrame={26} />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SCENE 3 — Tab Previsioni
// ══════════════════════════════════════════════════════════════════════════
function ScenePredictions() {
  const frame = useCurrentFrame();
  const PROJECTED = 4229.70;

  const bannerOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const projNum  = interpolate(frame, [15, 55], [0, PROJECTED], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  const savingCats = [
    { c: "Transport", avg: 223.83, s10: 22.38, s20: 44.77, s30: 67.15 },
    { c: "Out",       avg: 172.00, s10: 17.20, s20: 34.40, s30: 51.60 },
    { c: "Leisure",   avg: 106.89, s10: 10.69, s20: 21.38, s30: 32.07 },
  ];

  return (
    <AbsoluteFill style={{ background: T.bgBase, padding: "28px 40px", fontFamily: T.sans, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 5, width: "fit-content" }}>
        {[
          { icon: "📊", label: "Panoramica", active: false },
          { icon: "📈", label: "Previsioni",  active: true  },
          { icon: "🔬", label: "Insights",    active: false },
        ].map(t => (
          <div key={t.label} style={{
            padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: t.active ? 700 : 500,
            background: t.active ? "linear-gradient(135deg, #4fc3f7, #81d4fa)" : "transparent",
            color: t.active ? T.bgBase : T.textMuted,
            display: "flex", gap: 6, alignItems: "center",
          }}>
            <span>{t.icon}</span>{t.label}
          </div>
        ))}
      </div>

      {/* Banner proiezione */}
      <div style={{
        opacity: bannerOp, background: T.bgElevated,
        border: `1px solid rgba(255,202,40,0.35)`,
        borderRadius: 14, padding: "20px 26px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Proiezione a fine anno</div>
          <div style={{ fontFamily: T.mono, fontSize: 38, fontWeight: 700, color: T.amber }}>
            {fmt(projNum)}
          </div>
          <div style={{ fontSize: 12, color: T.textMuted, marginTop: 6 }}>
            basato su <strong style={{ color: T.textSecondary }}>2 mesi</strong> di dati reali · ancora <strong style={{ color: T.textSecondary }}>10 mesi</strong> da stimare
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: T.amber, padding: "8px 14px", background: "rgba(255,202,40,0.08)", borderRadius: 8, borderLeft: `3px solid ${T.amber}` }}>
            ⚠️ Stai spendendo un po' sopra la media. Guarda i suggerimenti sotto.
          </div>
        </div>
        <div style={{ display: "flex", gap: 30 }}>
          {[
            { l: "Speso finora", v: fmt(TOTAL), c: T.textPrimary },
            { l: "Media mensile", v: fmt(AVG),   c: T.amber },
            { l: "Mesi rimasti", v: "10",          c: T.textPrimary },
          ].map(s => (
            <div key={s.l} style={{ textAlign: "right" }}>
              <div style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{s.l}</div>
              <div style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 600, color: s.c }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Savings tips */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
          💡 Dove puoi risparmiare · scenari 10 · 20 · 30%
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {savingCats.map((cat, ci) => {
            const cardOp = interpolate(frame - (30 + ci * 8), [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const cardY  = interpolate(frame - (30 + ci * 8), [0, 18], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={cat.c} style={{
                background: T.bgElevated, border: `1px solid ${T.border}`,
                borderRadius: 10, padding: "14px 14px",
                opacity: cardOp, transform: `translateY(${cardY}px)`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}>{cat.c}</span>
                  <span style={{ fontSize: 10, color: T.textMuted, fontFamily: T.mono }}>{fmt(cat.avg)}/mese</span>
                </div>
                {[
                  { pct: 10, save: cat.s10, ann: cat.s10 * 12, color: "rgba(255,202,40,0.55)", tc: T.amber },
                  { pct: 20, save: cat.s20, ann: cat.s20 * 12, color: "rgba(102,187,106,0.65)", tc: T.green },
                  { pct: 30, save: cat.s30, ann: cat.s30 * 12, color: "rgba(102,187,106,0.9)", tc: T.green },
                ].map(sc => {
                  const barW = interpolate(frame - (45 + ci * 8), [0, 20], [0, sc.pct], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  return (
                    <div key={sc.pct} style={{ marginBottom: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 9, color: T.textMuted }}>Taglia del <strong style={{ color: sc.tc }}>{sc.pct}%</strong></span>
                        <span style={{ fontSize: 9, fontFamily: T.mono, color: sc.tc, fontWeight: 700 }}>+{fmt(sc.ann)}/anno</span>
                      </div>
                      <div style={{ display: "flex", gap: 5 }}>
                        <div style={{ flex: 1, height: 3, borderRadius: 2, background: T.bgInteractive }}>
                          <div style={{ height: "100%", borderRadius: 2, background: sc.color, width: `${barW}%` }} />
                        </div>
                        <span style={{ fontSize: 9, color: T.textMuted, fontFamily: T.mono }}>{fmt(sc.save)}/m</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SCENE 4 — Tab Insights
// ══════════════════════════════════════════════════════════════════════════
function SceneInsights() {
  const frame = useCurrentFrame();
  const CAT_COLORS = ["#4fc3f7","#66bb6a","#ffca28","#ef5350","#ab47bc","#26c6da","#ff7043","#8d6e63"];
  const months12 = [591.16, 818.74, 0,0,0,0,0,0,0,0,0,0];
  const labels   = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
  const maxVal   = 900;
  const avg      = (591.16 + 818.74) / 2;

  return (
    <AbsoluteFill style={{ background: T.bgBase, padding: "28px 40px", fontFamily: T.sans, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 5, width: "fit-content" }}>
        {[
          { icon: "📊", label: "Panoramica", active: false },
          { icon: "📈", label: "Previsioni",  active: false },
          { icon: "🔬", label: "Insights",    active: true  },
        ].map(t => (
          <div key={t.label} style={{
            padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: t.active ? 700 : 500,
            background: t.active ? "linear-gradient(135deg, #4fc3f7, #81d4fa)" : "transparent",
            color: t.active ? T.bgBase : T.textMuted,
            display: "flex", gap: 6, alignItems: "center",
          }}>
            <span>{t.icon}</span>{t.label}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, flex: 1 }}>
        {/* Bar chart */}
        <div style={{
          background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 14,
          gridColumn: "1 / -1", padding: "14px 18px",
          opacity: interpolate(frame, [5, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, marginBottom: 12 }}>
            📊 Spesa mensile <span style={{ color: T.textMuted, fontSize: 10, fontWeight: 400 }}>· barra = totale, linea tratteggiata = media</span>
          </div>
          <svg width="100%" viewBox="0 0 580 110" style={{ overflow: "visible" }}>
            {/* avg line */}
            <line x1={10} x2={570} y1={90 - (avg / maxVal) * 90} y2={90 - (avg / maxVal) * 90}
              stroke="rgba(255,202,40,0.4)" strokeWidth="1.5" strokeDasharray="5 3" />
            <text x={572} y={90 - (avg / maxVal) * 90 + 4} fontSize="8" fill={T.amber} fontFamily={T.mono}>avg</text>
            {months12.map((v, i) => {
              const barH = v > 0 ? Math.max(3, (v / maxVal) * 90) : 0;
              const barW = 30;
              const gap  = (560 / 12);
              const x    = 10 + i * gap + (gap - barW) / 2;
              const animH = interpolate(frame - (10 + i * 3), [0, 22], [0, barH], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              });
              return (
                <g key={i}>
                  <rect x={x} y={90 - animH} width={barW} height={animH} rx={4}
                    fill={v > avg ? "rgba(255,202,40,0.7)" : "rgba(79,195,247,0.55)"} />
                  <text x={x + barW / 2} y={105} textAnchor="middle" fontSize="9"
                    fill={v > 0 ? T.textSecondary : T.textMuted} fontFamily={T.sans}>{labels[i]}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Donut */}
        <div style={{
          background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 18px",
          opacity: interpolate(frame, [20, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [20, 38], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, marginBottom: 10 }}>🍩 Distribuzione categorie</div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <svg width={110} height={110}>
              {MOCK_CATS.map((cat, i) => {
                const start = MOCK_CATS.slice(0, i).reduce((s, c) => s + c.pct, 0) / 100 * 2 * Math.PI - Math.PI / 2;
                const sweep = (cat.pct / 100) * 2 * Math.PI;
                const end   = start + sweep;
                const R = 46, IR = 28, CX = 55, CY = 55;
                const x1 = CX + R * Math.cos(start), y1 = CY + R * Math.sin(start);
                const x2 = CX + R * Math.cos(end),   y2 = CY + R * Math.sin(end);
                const xi1 = CX + IR * Math.cos(start), yi1 = CY + IR * Math.sin(start);
                const xi2 = CX + IR * Math.cos(end),   yi2 = CY + IR * Math.sin(end);
                const la = sweep > Math.PI ? 1 : 0;
                const d = `M${xi1} ${yi1} L${x1} ${y1} A${R} ${R} 0 ${la} 1 ${x2} ${y2} L${xi2} ${yi2} A${IR} ${IR} 0 ${la} 0 ${xi1} ${yi1}Z`;
                return <path key={i} d={d} fill={CAT_COLORS[i % CAT_COLORS.length]} opacity={0.85} />;
              })}
              <text x={55} y={52} textAnchor="middle" fontSize={9} fill={T.textMuted} fontFamily={T.sans}>totale</text>
              <text x={55} y={65} textAnchor="middle" fontSize={13} fontWeight="700" fill={T.textPrimary} fontFamily={T.mono}>1.409€</text>
            </svg>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
              {MOCK_CATS.map((cat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: CAT_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: T.textSecondary, flex: 1 }}>{cat.c}</span>
                  <span style={{ fontSize: 9, color: T.textMuted, fontFamily: T.mono }}>{cat.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div style={{
          background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 18px",
          opacity: interpolate(frame, [25, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [25, 42], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, marginBottom: 10 }}>🗓️ Giorni caldi · spesa per giorno del mese</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {Array.from({ length: 31 }, (_, i) => {
              const mockIntensities = [0.2,0.9,0.1,0.4,0.7,0.3,0.15,0.85,0.2,0.5,0.3,0.1,0.6,0.4,0.25,0.8,0.35,0.15,0.45,0.7,0.1,0.3,0.5,0.2,0.95,0.3,0.15,0.6,0.4,0.2,0.1];
              const intensity = mockIntensities[i] || 0;
              const bg = intensity < 0.05 ? T.bgInteractive : `rgba(79,195,247,${0.12 + intensity * 0.75})`;
              return (
                <div key={i} style={{
                  aspectRatio: "1", borderRadius: 4, background: bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 8, color: intensity > 0.6 ? T.bgBase : T.textMuted,
                  fontFamily: T.mono, fontWeight: intensity > 0.4 ? "700" : "400",
                }}>{i + 1}</div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// SCENE 5 — Outro
// ══════════════════════════════════════════════════════════════════════════
function SceneOutro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const overallOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const features = [
    { icon: "📊", label: "KPI in tempo reale",           desc: "Totale, media, transazioni, overspend" },
    { icon: "📈", label: "Proiezione anno",               desc: "Stima spesa fine anno su media attiva" },
    { icon: "💡", label: "Savings tips 10/20/30%",       desc: "Scenari risparmio per ogni categoria" },
    { icon: "🍩", label: "Grafici interattivi",           desc: "Barche, donut, heatmap, ticket medio" },
    { icon: "🔬", label: "Filtro per mese",               desc: "Analizza ogni mese in isolamento" },
    { icon: "⚡", label: "Alert contestuali",             desc: "Mostra +X% sopra la tua media reale" },
  ];

  return (
    <AbsoluteFill style={{ background: T.bgBase, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20, fontFamily: T.sans, opacity: overallOp }}>
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(79,195,247,0.06) 0%, transparent 70%)" }} />
      <div style={{ fontSize: 14, color: T.accent, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>Personal Expenses · Feature Summary</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, maxWidth: 780 }}>
        {features.map((f, i) => {
          const s = spring({ fps, frame: frame - 10 - i * 6, config: { damping: 18, stiffness: 110 } });
          return (
            <div key={i} style={{
              background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 18px",
              opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.88, 1])})`,
              display: "flex", flexDirection: "column", gap: 6,
            }}>
              <div style={{ fontSize: 24 }}>{f.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary }}>{f.label}</div>
              <div style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.4 }}>{f.desc}</div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 13, color: T.textMuted, marginTop: 10 }}>
        Built with <span style={{ color: T.accent }}>React + Electron + Appwrite</span>
      </div>
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ROOT COMPOSITION
// ══════════════════════════════════════════════════════════════════════════
export const AppDemo: React.FC = () => {
  // Scene timing (frames @ 30fps):
  // 0-70    Intro      (2.3s)
  // 70-220  Overview   (5s)
  // 220-380 Predictions(5.3s)
  // 380-490 Insights   (3.7s)
  // 490-560 Outro      (2.3s)
  return (
    <AbsoluteFill>
      <Sequence from={0}   durationInFrames={70}  ><SceneIntro /></Sequence>
      <Sequence from={70}  durationInFrames={150} ><SceneOverview /></Sequence>
      <Sequence from={220} durationInFrames={160} ><ScenePredictions /></Sequence>
      <Sequence from={380} durationInFrames={110} ><SceneInsights /></Sequence>
      <Sequence from={490} durationInFrames={70}  ><SceneOutro /></Sequence>
    </AbsoluteFill>
  );
};
