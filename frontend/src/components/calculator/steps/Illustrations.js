import React from 'react';

// ─────────────────────── StepHome Illustrations ───────────────────────────────

export function HouseIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd"/>
          <stop offset="100%" stopColor="#dbeafe"/>
        </linearGradient>
      </defs>
      {/* Sky */}
      <rect width="80" height="60" rx="10" fill="url(#hSky)"/>
      {/* Ground */}
      <rect y="48" width="80" height="12" fill="#86efac"/>
      <rect y="48" width="80" height="3" fill="#4ade80"/>
      {/* House walls */}
      <rect x="13" y="33" width="54" height="19" fill="#f8fafc"/>
      <rect x="13" y="33" width="54" height="1.5" fill="#e2e8f0"/>
      {/* Roof */}
      <polygon points="7,33 40,11 73,33" fill="#1e293b"/>
      {/* Roof ridge cap */}
      <line x1="7" y1="33" x2="73" y2="33" stroke="#0f172a" strokeWidth="1"/>
      {/* Solar panels — parallelograms following right roof slope */}
      <polygon points="49,15 55,20 59,26 53,21" fill="#1e40af"/>
      <polygon points="57,21 63,25 67,32 61,27" fill="#1e40af"/>
      {/* Panel cell lines */}
      <line x1="52" y1="18" x2="56" y2="24" stroke="#93c5fd" strokeWidth="0.5" opacity="0.6"/>
      <line x1="60" y1="23" x2="64" y2="29" stroke="#93c5fd" strokeWidth="0.5" opacity="0.6"/>
      <line x1="49" y1="20.5" x2="59" y2="20.5" stroke="#93c5fd" strokeWidth="0.4" opacity="0.4"/>
      <line x1="57" y1="25.5" x2="67" y2="25.5" stroke="#93c5fd" strokeWidth="0.4" opacity="0.4"/>
      {/* Panel glare */}
      <polygon points="50,15 52,16 53,19 51,18" fill="white" opacity="0.25"/>
      <polygon points="58,21 60,22 61,25 59,24" fill="white" opacity="0.25"/>
      {/* Door */}
      <rect x="34" y="39" width="12" height="13" rx="2" fill="#fbbf24"/>
      <circle cx="43" cy="46" r="1.2" fill="#f59e0b"/>
      {/* Windows */}
      <rect x="17" y="37" width="12" height="9" rx="2" fill="#bae6fd"/>
      <line x1="23" y1="37" x2="23" y2="46" stroke="#93c5fd" strokeWidth="0.8"/>
      <line x1="17" y1="41.5" x2="29" y2="41.5" stroke="#93c5fd" strokeWidth="0.8"/>
      <rect x="51" y="37" width="12" height="9" rx="2" fill="#bae6fd"/>
      <line x1="57" y1="37" x2="57" y2="46" stroke="#93c5fd" strokeWidth="0.8"/>
      <line x1="51" y1="41.5" x2="63" y2="41.5" stroke="#93c5fd" strokeWidth="0.8"/>
      {/* Sun */}
      <circle cx="14" cy="13" r="5.5" fill="#fde68a"/>
      <line x1="14" y1="5" x2="14" y2="6.5" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="19.5" x2="14" y2="21" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="5.5" y1="13" x2="7" y2="13" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="21" y1="13" x2="22.5" y2="13" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8.5" y1="7.5" x2="9.6" y2="8.6" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18.4" y1="17.4" x2="19.5" y2="18.5" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Cloud */}
      <ellipse cx="60" cy="8" rx="9" ry="4.5" fill="white" opacity="0.85"/>
      <ellipse cx="53" cy="10" rx="6" ry="3.5" fill="white" opacity="0.85"/>
      <ellipse cx="67" cy="10" rx="5" ry="3" fill="white" opacity="0.85"/>
    </svg>
  );
}

export function CondoIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c7d2fe"/>
          <stop offset="100%" stopColor="#eef2ff"/>
        </linearGradient>
      </defs>
      <rect width="80" height="60" rx="10" fill="url(#cSky)"/>
      <rect y="50" width="80" height="10" fill="#c7d2fe"/>
      {/* Building body */}
      <rect x="18" y="8" width="44" height="44" fill="white"/>
      {/* Building right side */}
      <polygon points="62,8 68,4 68,46 62,50" fill="#e0e7ff"/>
      {/* Building top */}
      <polygon points="18,8 24,4 68,4 62,8" fill="#c7d2fe"/>
      {/* Floor lines */}
      <line x1="18" y1="19" x2="62" y2="19" stroke="#e0e7ff" strokeWidth="0.8"/>
      <line x1="18" y1="30" x2="62" y2="30" stroke="#e0e7ff" strokeWidth="0.8"/>
      <line x1="18" y1="41" x2="62" y2="41" stroke="#e0e7ff" strokeWidth="0.8"/>
      {/* Windows — 3 floors × 3 cols */}
      <rect x="22" y="11" width="8" height="6" rx="1.5" fill="#bfdbfe"/>
      <rect x="33" y="11" width="8" height="6" rx="1.5" fill="#bfdbfe"/>
      <rect x="44" y="11" width="8" height="6" rx="1.5" fill="#bfdbfe"/>
      <rect x="22" y="22" width="8" height="6" rx="1.5" fill="#bfdbfe"/>
      <rect x="33" y="22" width="8" height="6" rx="1.5" fill="#93c5fd"/>
      <rect x="44" y="22" width="8" height="6" rx="1.5" fill="#bfdbfe"/>
      <rect x="22" y="33" width="8" height="6" rx="1.5" fill="#bfdbfe"/>
      <rect x="33" y="33" width="8" height="6" rx="1.5" fill="#bfdbfe"/>
      <rect x="44" y="33" width="8" height="6" rx="1.5" fill="#93c5fd"/>
      {/* Entrance */}
      <rect x="29" y="41" width="22" height="11" rx="1.5" fill="#a5b4fc"/>
      <line x1="40" y1="41" x2="40" y2="52" stroke="#818cf8" strokeWidth="0.8"/>
      {/* Rooftop solar panels (on top face as parallelograms) */}
      <polygon points="26,7 36,4 38,6 28,9" fill="#1d4ed8" opacity="0.85"/>
      <polygon points="38,6 48,3 50,5 40,8" fill="#1d4ed8" opacity="0.85"/>
      {/* Panel glare */}
      <polygon points="26,7 28,6.5 29,7.5 27,8" fill="white" opacity="0.2"/>
    </svg>
  );
}

export function ApartmentIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="aSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e9d5ff"/>
          <stop offset="100%" stopColor="#f5f3ff"/>
        </linearGradient>
      </defs>
      <rect width="80" height="60" rx="10" fill="url(#aSky)"/>
      <rect y="52" width="80" height="8" fill="#ddd6fe"/>
      {/* Smaller adjacent building */}
      <rect x="5" y="26" width="20" height="27" fill="#f3f4f6"/>
      <polygon points="5,26 9,22 25,22 21,26" fill="#e5e7eb"/>
      <rect x="8" y="28" width="5" height="4" rx="1" fill="#c4b5fd" opacity="0.7"/>
      <rect x="16" y="28" width="5" height="4" rx="1" fill="#c4b5fd" opacity="0.7"/>
      <rect x="8" y="35" width="5" height="4" rx="1" fill="#c4b5fd" opacity="0.7"/>
      <rect x="16" y="35" width="5" height="4" rx="1" fill="#c4b5fd" opacity="0.7"/>
      <rect x="8" y="42" width="5" height="4" rx="1" fill="#c4b5fd" opacity="0.7"/>
      <rect x="16" y="42" width="5" height="4" rx="1" fill="#c4b5fd" opacity="0.7"/>
      {/* Main tower */}
      <rect x="28" y="4" width="34" height="49" fill="white"/>
      <polygon points="62,4 68,1 68,48 62,51" fill="#ede9fe"/>
      <polygon points="28,4 34,1 68,1 62,4" fill="#d8b4fe"/>
      {/* Floor lines */}
      <line x1="28" y1="14" x2="62" y2="14" stroke="#ede9fe" strokeWidth="0.8"/>
      <line x1="28" y1="24" x2="62" y2="24" stroke="#ede9fe" strokeWidth="0.8"/>
      <line x1="28" y1="34" x2="62" y2="34" stroke="#ede9fe" strokeWidth="0.8"/>
      <line x1="28" y1="44" x2="62" y2="44" stroke="#ede9fe" strokeWidth="0.8"/>
      {/* Windows 4 rows × 3 cols */}
      <rect x="31" y="7" width="7" height="5" rx="1.5" fill="#c084fc"/>
      <rect x="41" y="7" width="7" height="5" rx="1.5" fill="#c084fc"/>
      <rect x="51" y="7" width="7" height="5" rx="1.5" fill="#c084fc"/>
      <rect x="31" y="17" width="7" height="5" rx="1.5" fill="#c084fc"/>
      <rect x="41" y="17" width="7" height="5" rx="1.5" fill="#e9d5ff"/>
      <rect x="51" y="17" width="7" height="5" rx="1.5" fill="#c084fc"/>
      <rect x="31" y="27" width="7" height="5" rx="1.5" fill="#c084fc"/>
      <rect x="41" y="27" width="7" height="5" rx="1.5" fill="#c084fc"/>
      <rect x="51" y="27" width="7" height="5" rx="1.5" fill="#e9d5ff"/>
      <rect x="31" y="37" width="7" height="5" rx="1.5" fill="#e9d5ff"/>
      <rect x="41" y="37" width="7" height="5" rx="1.5" fill="#c084fc"/>
      <rect x="51" y="37" width="7" height="5" rx="1.5" fill="#c084fc"/>
      {/* Entrance */}
      <rect x="35" y="44" width="18" height="9" rx="1.5" fill="#a855f7"/>
      <line x1="44" y1="44" x2="44" y2="53" stroke="#9333ea" strokeWidth="0.8"/>
      <circle cx="50" cy="49" r="1" fill="white" opacity="0.7"/>
    </svg>
  );
}

export function OwnsHomeIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="60" rx="10" fill="#ecfdf5"/>
      {/* House silhouette */}
      <polygon points="8,36 40,18 72,36" fill="#a7f3d0"/>
      <rect x="14" y="36" width="52" height="20" fill="#d1fae5"/>
      {/* Door */}
      <rect x="34" y="42" width="12" height="14" rx="1" fill="#6ee7b7"/>
      {/* Windows */}
      <rect x="18" y="39" width="10" height="8" rx="1" fill="#a7f3d0"/>
      <rect x="52" y="39" width="10" height="8" rx="1" fill="#a7f3d0"/>
      {/* Key */}
      <circle cx="40" cy="25" r="9" fill="none" stroke="#059669" strokeWidth="3"/>
      <circle cx="40" cy="25" r="4.5" fill="none" stroke="#059669" strokeWidth="2"/>
      <rect x="46.5" y="23" width="13" height="4" rx="2" fill="#059669"/>
      <rect x="54" y="27" width="4" height="5" rx="1.5" fill="#059669"/>
      <rect x="48" y="27" width="3.5" height="4" rx="1.5" fill="#059669"/>
      {/* Check badge */}
      <circle cx="60" cy="12" r="8" fill="#059669"/>
      <polyline points="55.5,12 58.5,15 64.5,9" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

export function RentsHomeIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="60" rx="10" fill="#f8fafc"/>
      {/* Document */}
      <rect x="20" y="6" width="40" height="50" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
      {/* Folded corner */}
      <polygon points="46,6 60,6 60,20" fill="#f1f5f9"/>
      <polygon points="46,6 46,20 60,20" fill="#e2e8f0"/>
      {/* House icon at top */}
      <polygon points="28,18 35,12 42,18" fill="#94a3b8"/>
      <rect x="30" y="18" width="10" height="8" fill="#e2e8f0"/>
      <rect x="32.5" y="20" width="3" height="6" rx="0.5" fill="#94a3b8"/>
      {/* Text lines */}
      <rect x="26" y="28" width="22" height="2.5" rx="1.25" fill="#cbd5e1"/>
      <rect x="26" y="33" width="18" height="2.5" rx="1.25" fill="#cbd5e1"/>
      <rect x="26" y="38" width="20" height="2.5" rx="1.25" fill="#cbd5e1"/>
      {/* Signature area */}
      <line x1="26" y1="46" x2="48" y2="46" stroke="#e2e8f0" strokeWidth="1"/>
      {/* Pen drawing signature */}
      <path d="M 30 44 Q 34 41 36 44 Q 38 47 42 43" stroke="#64748b" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <line x1="45" y1="43" x2="47" y2="43" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

// ─────────────────────── StepRoof Sun Illustrations ──────────────────────────

export function FullSunIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="fsSky" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fef9c3"/>
          <stop offset="100%" stopColor="#fffbeb"/>
        </radialGradient>
      </defs>
      <rect width="80" height="60" rx="10" fill="url(#fsSky)"/>
      {/* Sun outer glow */}
      <circle cx="40" cy="20" r="17" fill="#fde68a" opacity="0.4"/>
      {/* Sun */}
      <circle cx="40" cy="20" r="11" fill="#f59e0b"/>
      <circle cx="40" cy="20" r="7.5" fill="#fbbf24"/>
      {/* Rays */}
      <line x1="40" y1="3" x2="40" y2="7" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="40" y1="33" x2="40" y2="37" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="23" y1="20" x2="27" y2="20" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="53" y1="20" x2="57" y2="20" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="27.9" y1="7.9" x2="30.7" y2="10.7" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      <line x1="49.3" y1="29.3" x2="52.1" y2="32.1" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      <line x1="52.1" y1="7.9" x2="49.3" y2="10.7" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      <line x1="27.9" y1="32.1" x2="30.7" y2="29.3" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      {/* Roof silhouette */}
      <polygon points="0,60 40,41 80,60" fill="#1e293b"/>
      {/* Panels on slope, reflecting sun */}
      <polygon points="42,47 51,42 53,47 44,52" fill="#1e40af"/>
      <polygon points="51,43 60,38 62,43 53,48" fill="#1e40af"/>
      {/* Glare on panels */}
      <polygon points="43,47 45,46 46,48 44,49" fill="white" opacity="0.35"/>
      <polygon points="52,43 54,42 55,44 53,45" fill="white" opacity="0.35"/>
      {/* Panel grid lines */}
      <line x1="47" y1="44" x2="48" y2="49" stroke="white" strokeWidth="0.5" opacity="0.4"/>
      <line x1="56" y1="40" x2="57" y2="45" stroke="white" strokeWidth="0.5" opacity="0.4"/>
    </svg>
  );
}

export function PartialShadeIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="60" rx="10" fill="#fff7ed"/>
      {/* Sun partially hidden */}
      <circle cx="26" cy="17" r="8" fill="#fb923c" opacity="0.8"/>
      <circle cx="26" cy="17" r="5.5" fill="#f97316" opacity="0.9"/>
      <line x1="26" y1="6" x2="26" y2="8" stroke="#fb923c" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="15" y1="17" x2="17" y2="17" stroke="#fb923c" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="18.9" y1="9.9" x2="20.8" y2="11.8" stroke="#fb923c" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Main cloud */}
      <ellipse cx="50" cy="15" rx="19" ry="10" fill="white"/>
      <ellipse cx="37" cy="18" rx="14" ry="8" fill="white"/>
      <ellipse cx="63" cy="19" rx="13" ry="7" fill="#f8fafc"/>
      <ellipse cx="46" cy="22" rx="17" ry="7" fill="white"/>
      {/* Tree left */}
      <rect x="4" y="36" width="4" height="20" fill="#475569"/>
      <ellipse cx="6" cy="33" rx="7.5" ry="11" fill="#334155"/>
      <ellipse cx="3" cy="38" rx="5" ry="8" fill="#1e293b"/>
      {/* Roof */}
      <polygon points="0,60 40,43 80,60" fill="#334155"/>
      {/* Panels in partial shade */}
      <polygon points="42,50 51,45 53,50 44,55" fill="#2563eb" opacity="0.78"/>
      <polygon points="51,45 60,40 62,45 53,50" fill="#2563eb" opacity="0.58"/>
      {/* Dappled light patch */}
      <ellipse cx="60" cy="50" rx="5" ry="3" fill="#fde68a" opacity="0.12"/>
    </svg>
  );
}

export function MostlyShadeIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="60" rx="10" fill="#e2e8f0"/>
      {/* Heavy overcast clouds — multiple layers */}
      <ellipse cx="18" cy="13" rx="18" ry="10" fill="#cbd5e1"/>
      <ellipse cx="40" cy="10" rx="23" ry="12" fill="#e2e8f0"/>
      <ellipse cx="64" cy="15" rx="20" ry="10" fill="#cbd5e1"/>
      <ellipse cx="8" cy="20" rx="12" ry="8" fill="#e2e8f0"/>
      <ellipse cx="52" cy="20" rx="23" ry="11" fill="#e2e8f0"/>
      <ellipse cx="74" cy="22" rx="12" ry="7" fill="#cbd5e1"/>
      {/* Very faint sun */}
      <circle cx="40" cy="12" r="5" fill="#fde68a" opacity="0.18"/>
      {/* Large tree left */}
      <rect x="2" y="30" width="5" height="26" fill="#374151"/>
      <ellipse cx="4.5" cy="28" rx="11" ry="15" fill="#1e293b"/>
      <ellipse cx="1" cy="35" rx="7" ry="11" fill="#111827"/>
      {/* Tree right */}
      <rect x="68" y="36" width="4" height="20" fill="#374151"/>
      <ellipse cx="70" cy="33" rx="9.5" ry="13" fill="#1e293b"/>
      <ellipse cx="73" cy="38" rx="6" ry="9" fill="#111827"/>
      {/* Roof in heavy shade */}
      <polygon points="0,60 40,45 80,60" fill="#334155"/>
      {/* Panels barely visible — dark */}
      <polygon points="42,51 51,46 53,51 44,56" fill="#475569"/>
      <polygon points="51,47 60,42 62,47 53,52" fill="#475569"/>
      {/* Dark shade overlay */}
      <polygon points="42,51 51,46 53,51 44,56" fill="#1e293b" opacity="0.28"/>
      <polygon points="51,47 60,42 62,47 53,52" fill="#1e293b" opacity="0.28"/>
    </svg>
  );
}

// ─────────────────────── StepRoof Type Illustrations ─────────────────────────

export function AsphaltShinglesIllustration() {
  // Staggered 3-tab shingle pattern:
  // 8px wide tabs, 7px tall exposed rows, 4px stagger between rows
  const rowYs = [43, 36, 29, 22, 15, 8, 1];
  return (
    <svg viewBox="0 0 64 50" width="64" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Roof deck */}
      <rect width="64" height="50" rx="8" fill="#1f2937"/>
      {rowYs.map((y, ri) => {
        const offset = (ri % 2) * 4;
        const h = 50 - y;
        const tabs = [];
        for (let i = -1; i <= 9; i++) {
          const x = i * 8 - offset;
          if (x >= 64) break;
          const isLight = (i + ri) % 2 === 0;
          tabs.push(
            <rect
              key={i}
              x={x}
              y={y}
              width={8}
              height={h}
              fill={isLight ? '#4b5563' : '#374151'}
            />
          );
        }
        return (
          <React.Fragment key={ri}>
            {tabs}
            {/* Drip edge / butt line */}
            <rect x={0} y={y} width={64} height={1} fill="#0f172a"/>
            {/* Subtle tab cut lines (every 24px, staggered) */}
            {[0, 24, 48].map(bx => (
              <line
                key={bx}
                x1={bx - offset + 12}
                y1={y}
                x2={bx - offset + 12}
                y2={Math.min(y + 7, 50)}
                stroke="#111827"
                strokeWidth="0.6"
              />
            ))}
          </React.Fragment>
        );
      })}
      {/* Solar panels top-right */}
      <rect x="34" y="2" width="13" height="9" rx="1.5" fill="#1d4ed8"/>
      <rect x="49" y="2" width="13" height="9" rx="1.5" fill="#1d4ed8"/>
      <line x1="40.5" y1="2" x2="40.5" y2="11" stroke="white" strokeWidth="0.5" opacity="0.45"/>
      <line x1="55.5" y1="2" x2="55.5" y2="11" stroke="white" strokeWidth="0.5" opacity="0.45"/>
      <line x1="34" y1="6.5" x2="47" y2="6.5" stroke="white" strokeWidth="0.5" opacity="0.45"/>
      <line x1="49" y1="6.5" x2="62" y2="6.5" stroke="white" strokeWidth="0.5" opacity="0.45"/>
      {/* Panel glare */}
      <polygon points="34,2 37,2 38,4 35,4" fill="white" opacity="0.2"/>
      <polygon points="49,2 52,2 53,4 50,4" fill="white" opacity="0.2"/>
    </svg>
  );
}

export function MetalRoofIllustration() {
  return (
    <svg viewBox="0 0 64 50" width="64" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="metalBase" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94a3b8"/>
          <stop offset="50%" stopColor="#cbd5e1"/>
          <stop offset="100%" stopColor="#94a3b8"/>
        </linearGradient>
      </defs>
      <rect width="64" height="50" rx="8" fill="#64748b"/>
      {/* Panel bands */}
      {[0, 9, 18, 27, 36, 45, 54].map(x => (
        <rect key={x} x={x} y={0} width={8} height={50} fill="#94a3b8"/>
      ))}
      {/* Standing seam ridges */}
      {[8, 17, 26, 35, 44, 53].map(x => (
        <rect key={x} x={x} y={0} width={2.5} height={50} rx={1} fill="#1e293b"/>
      ))}
      {/* Highlight sheen on each panel */}
      {[0, 9, 18, 27, 36, 45, 54].map(x => (
        <rect key={x} x={x + 0.5} y={0} width={1.5} height={50} fill="white" opacity={0.12}/>
      ))}
      {/* Horizontal weathering lines */}
      <line x1="0" y1="16" x2="64" y2="16" stroke="#475569" strokeWidth="0.5" opacity="0.4"/>
      <line x1="0" y1="33" x2="64" y2="33" stroke="#475569" strokeWidth="0.5" opacity="0.4"/>
      {/* Eave edge */}
      <rect x="0" y="47" width="64" height="3" rx="0" fill="#334155"/>
    </svg>
  );
}

export function TileRoofIllustration() {
  // Barrel/Spanish tile pattern using quadratic bezier arches
  // Each row: arch shapes (M x1,bottom Q mid,top x2,bottom) filled with tile color
  // 4 rows of tiles, alternating row offset by 8px
  // Row height: 13px visible
  const tileW = 16;
  const rows = [
    { y: 0,  bottom: 13, offset: 0 },
    { y: 13, bottom: 26, offset: 8 },
    { y: 26, bottom: 39, offset: 0 },
    { y: 39, bottom: 52, offset: 8 },
  ];
  const colors = ['#d97706', '#b45309'];

  return (
    <svg viewBox="0 0 64 50" width="64" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Valley / background color */}
      <rect width="64" height="50" rx="8" fill="#92400e"/>
      {rows.map(({ y, bottom, offset }, ri) => {
        const arches = [];
        for (let i = -1; i <= 5; i++) {
          const x1 = i * tileW - offset;
          const x2 = x1 + tileW;
          const cx = x1 + tileW / 2;
          const peak = y + 2;
          const fill = colors[(i + ri) % 2];
          // Arch filled shape: from y baseline, curves up to peak, back down
          arches.push(
            <path
              key={i}
              d={`M ${x1},${bottom} Q ${cx},${peak} ${x2},${bottom} L ${x2},${y} L ${x1},${y} Z`}
              fill={fill}
            />
          );
          // Highlight arc on each barrel
          arches.push(
            <path
              key={`h${i}`}
              d={`M ${x1 + 2},${bottom - 3} Q ${cx},${peak + 3} ${x2 - 2},${bottom - 3}`}
              stroke="#fbbf24"
              strokeWidth="1"
              fill="none"
              opacity="0.45"
            />
          );
        }
        return (
          <React.Fragment key={ri}>
            {arches}
            {/* Shadow groove between rows */}
            <rect x={0} y={bottom - 2} width={64} height={2.5} fill="#7c2d12"/>
          </React.Fragment>
        );
      })}
    </svg>
  );
}

export function FlatRoofIllustration() {
  return (
    <svg viewBox="0 0 64 50" width="64" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Membrane surface */}
      <rect width="64" height="50" rx="8" fill="#9ca3af"/>
      {/* TPO seam grid */}
      <line x1="0" y1="17" x2="64" y2="17" stroke="#6b7280" strokeWidth="1.2"/>
      <line x1="0" y1="34" x2="64" y2="34" stroke="#6b7280" strokeWidth="1.2"/>
      <line x1="16" y1="0" x2="16" y2="50" stroke="#6b7280" strokeWidth="0.8"/>
      <line x1="32" y1="0" x2="32" y2="50" stroke="#6b7280" strokeWidth="0.8"/>
      <line x1="48" y1="0" x2="48" y2="50" stroke="#6b7280" strokeWidth="0.8"/>
      {/* Solar panels on tilted racks (viewed at angle) */}
      <polygon points="5,42 24,29 24,35 5,48" fill="#1d4ed8" opacity="0.92"/>
      <polygon points="27,42 46,29 46,35 27,48" fill="#1d4ed8" opacity="0.92"/>
      {/* Rack legs */}
      <line x1="5" y1="48" x2="5" y2="50" stroke="#4b5563" strokeWidth="1.5"/>
      <line x1="24" y1="35" x2="24" y2="39" stroke="#4b5563" strokeWidth="1.5"/>
      <line x1="27" y1="48" x2="27" y2="50" stroke="#4b5563" strokeWidth="1.5"/>
      <line x1="46" y1="35" x2="46" y2="39" stroke="#4b5563" strokeWidth="1.5"/>
      {/* Panel cell lines */}
      <line x1="10" y1="39" x2="24" y2="31" stroke="white" strokeWidth="0.5" opacity="0.35"/>
      <line x1="15" y1="45" x2="24" y2="40" stroke="white" strokeWidth="0.5" opacity="0.35"/>
      <line x1="32" y1="39" x2="46" y2="31" stroke="white" strokeWidth="0.5" opacity="0.35"/>
      <line x1="37" y1="45" x2="46" y2="40" stroke="white" strokeWidth="0.5" opacity="0.35"/>
      {/* Panel glare */}
      <polygon points="5,42 8,40 9,42 6,44" fill="white" opacity="0.22"/>
      <polygon points="27,42 30,40 31,42 28,44" fill="white" opacity="0.22"/>
      {/* Parapet edge */}
      <rect x="0" y="0" width="64" height="4" rx="8" fill="#6b7280"/>
      <rect x="0" y="0" width="3" height="50" rx="1" fill="#6b7280"/>
      <rect x="61" y="0" width="3" height="50" rx="1" fill="#6b7280"/>
    </svg>
  );
}

// ─────────────────────── StepBattery Illustrations ───────────────────────────

export function NoBatteryIllustration() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#f1f5f9"/>
      {/* Utility pole */}
      <rect x="33" y="5" width="3" height="31" fill="#94a3b8"/>
      <rect x="28.5" y="9" width="12" height="2" rx="1" fill="#64748b"/>
      {/* Insulators */}
      <circle cx="29" cy="10" r="1.5" fill="#64748b"/>
      <circle cx="40" cy="10" r="1.5" fill="#64748b"/>
      {/* Power lines */}
      <path d="M 29 11 Q 20 15 13 18" stroke="#94a3b8" strokeWidth="1" fill="none"/>
      <path d="M 40 11 Q 41 20 41 31" stroke="#94a3b8" strokeWidth="1" fill="none"/>
      {/* House */}
      <polygon points="4,30 19,20 34,30" fill="#334155"/>
      <rect x="6" y="30" width="26" height="15" fill="#e2e8f0"/>
      {/* Door */}
      <rect x="14" y="35" width="6" height="10" rx="1" fill="#94a3b8"/>
      {/* Window */}
      <rect x="22" y="32" width="7" height="6" rx="1" fill="#bae6fd"/>
      <line x1="25.5" y1="32" x2="25.5" y2="38" stroke="#93c5fd" strokeWidth="0.6"/>
      <line x1="22" y1="35" x2="29" y2="35" stroke="#93c5fd" strokeWidth="0.6"/>
      {/* Meter box */}
      <rect x="4" y="28" width="4" height="6" rx="1" fill="#64748b"/>
      <rect x="5" y="29" width="2" height="4" rx="0.5" fill="#94a3b8"/>
      {/* Connection wire */}
      <path d="M 8 31 Q 12 22 13 21" stroke="#94a3b8" strokeWidth="1" fill="none"/>
    </svg>
  );
}

export function OneBatteryIllustration() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#ecfdf5"/>
      {/* House */}
      <polygon points="3,28 20,16 37,28" fill="#1e293b"/>
      <rect x="5" y="28" width="30" height="17" fill="#f0fdf4"/>
      {/* Solar panels on roof */}
      <polygon points="20,20 28,17 29,20 21,23" fill="#1e40af" opacity="0.9"/>
      <line x1="24.5" y1="18" x2="25" y2="21.5" stroke="white" strokeWidth="0.5" opacity="0.4"/>
      {/* Door */}
      <rect x="14" y="33" width="6" height="12" rx="1" fill="#86efac"/>
      <circle cx="19" cy="39" r="0.8" fill="#4ade80"/>
      {/* Window */}
      <rect x="22" y="30" width="8" height="7" rx="1" fill="#bbf7d0"/>
      <line x1="26" y1="30" x2="26" y2="37" stroke="#86efac" strokeWidth="0.6"/>
      {/* Battery pack (Powerwall style) — wall-mounted */}
      <rect x="36" y="20" width="9" height="20" rx="3" fill="#059669"/>
      <rect x="37" y="21" width="7" height="18" rx="2" fill="#10b981"/>
      {/* Battery level bars */}
      <rect x="38.5" y="23" width="4" height="2.5" rx="0.5" fill="#34d399"/>
      <rect x="38.5" y="27" width="4" height="2.5" rx="0.5" fill="#34d399"/>
      <rect x="38.5" y="31" width="4" height="2.5" rx="0.5" fill="#6ee7b7" opacity="0.55"/>
      {/* Terminal nub */}
      <rect x="38.5" y="18.5" width="4" height="2" rx="0.5" fill="#047857"/>
      {/* Brand label */}
      <rect x="38" y="35" width="5" height="2" rx="0.5" fill="#047857" opacity="0.6"/>
      {/* Connection */}
      <path d="M 35 30 L 36 30" stroke="#059669" strokeWidth="1.5"/>
      <circle cx="33" cy="30" r="1.5" fill="#34d399" opacity="0.8"/>
      <circle cx="30" cy="30" r="1.2" fill="#34d399" opacity="0.45"/>
    </svg>
  );
}

export function TwoBatteriesIllustration() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#fffbeb"/>
      {/* House */}
      <polygon points="2,28 17,18 32,28" fill="#1e293b"/>
      <rect x="4" y="28" width="26" height="17" fill="#fefce8"/>
      {/* Solar panels */}
      <polygon points="17,22 24,19 25,22 18,25" fill="#1e40af" opacity="0.9"/>
      <line x1="20.5" y1="20" x2="21" y2="23.5" stroke="white" strokeWidth="0.5" opacity="0.4"/>
      {/* Door */}
      <rect x="11" y="33" width="5" height="12" rx="1" fill="#fde68a"/>
      {/* Window */}
      <rect x="18" y="30" width="7" height="7" rx="1" fill="#fef9c3"/>
      <line x1="21.5" y1="30" x2="21.5" y2="37" stroke="#fde68a" strokeWidth="0.6"/>
      {/* Battery pack 1 (upper) */}
      <rect x="33" y="16" width="9" height="15" rx="2.5" fill="#d97706"/>
      <rect x="34" y="17" width="7" height="13" rx="1.5" fill="#f59e0b"/>
      <rect x="35.5" y="19" width="3.5" height="2" rx="0.5" fill="#fbbf24"/>
      <rect x="35.5" y="23" width="3.5" height="2" rx="0.5" fill="#fbbf24"/>
      <rect x="35.5" y="27" width="3.5" height="1.5" rx="0.5" fill="#fde68a" opacity="0.5"/>
      <rect x="35.5" y="14.5" width="3.5" height="1.8" rx="0.5" fill="#b45309"/>
      {/* Battery pack 2 (lower) */}
      <rect x="33" y="33" width="9" height="12" rx="2.5" fill="#d97706"/>
      <rect x="34" y="34" width="7" height="10" rx="1.5" fill="#f59e0b"/>
      <rect x="35.5" y="36" width="3.5" height="2" rx="0.5" fill="#fbbf24"/>
      <rect x="35.5" y="40" width="3.5" height="2" rx="0.5" fill="#fde68a" opacity="0.7"/>
      {/* Connection wires */}
      <path d="M 30 23 L 33 23" stroke="#d97706" strokeWidth="1.5"/>
      <path d="M 30 39 L 33 39" stroke="#d97706" strokeWidth="1.5"/>
      <line x1="30" y1="23" x2="30" y2="39" stroke="#d97706" strokeWidth="1"/>
      {/* Energy bolt */}
      <polygon points="21,8 18,13 20,13 17,18 22,12 19.5,12" fill="#f59e0b" opacity="0.9"/>
    </svg>
  );
}
