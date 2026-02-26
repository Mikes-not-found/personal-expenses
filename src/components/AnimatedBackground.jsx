import { useMemo } from 'react';

// Simboli finanziari fluttuanti
const SYMBOLS = ['€', '$', '£', '%', '↑', '↗', '◈', '▲', '◆'];

// Genera una particella con posizione/timing casuale ma deterministico (seed-based)
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function Particle({ seed }) {
  const rng = seededRandom(seed * 1337 + 7);
  const x    = rng() * 100;           // % orizzontale
  const dur  = 14 + rng() * 22;       // durata animazione (s)
  const delay= rng() * -30;           // delay negativo = già in moto
  const size = 9 + rng() * 14;        // font size
  const sym  = SYMBOLS[Math.floor(rng() * SYMBOLS.length)];
  const drift = rng() > 0.5 ? 'floatDrift' : 'floatUp';
  const opacity = 0.04 + rng() * 0.08;

  return (
    <span style={{
      position: 'absolute',
      left: `${x}%`,
      bottom: '-40px',
      fontSize: size,
      color: 'var(--accent)',
      opacity,
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      userSelect: 'none',
      pointerEvents: 'none',
      animation: `${drift} ${dur}s linear ${delay}s infinite`,
      willChange: 'transform, opacity',
    }}>
      {sym}
    </span>
  );
}

function Orb({ seed }) {
  const rng = seededRandom(seed * 2719 + 13);
  const x    = 10 + rng() * 80;
  const y    = 5  + rng() * 80;
  const size = 180 + rng() * 320;
  const dur  = 18 + rng() * 28;
  const delay= rng() * -20;
  const hue  = rng() > 0.6 ? 'var(--accent)' : rng() > 0.3 ? 'var(--c-purple)' : 'var(--c-green)';

  return (
    <div style={{
      position: 'absolute',
      left: `${x}%`,
      top:  `${y}%`,
      width:  size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${hue} 0%, transparent 70%)`,
      opacity: 0.045,
      pointerEvents: 'none',
      animation: `orb ${dur}s ease-in-out ${delay}s infinite`,
      willChange: 'transform, opacity',
    }} />
  );
}

export function AnimatedBackground() {
  // Numero fisso di elementi (non cambiano tra render)
  const particles = useMemo(() => Array.from({ length: 22 }, (_, i) => i), []);
  const orbs      = useMemo(() => Array.from({ length: 5  }, (_, i) => i), []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      {/* Orbs di luce sfumata */}
      {orbs.map(i => <Orb key={i} seed={i} />)}
      {/* Particelle simboli finanziari */}
      {particles.map(i => <Particle key={i} seed={i} />)}
    </div>
  );
}
