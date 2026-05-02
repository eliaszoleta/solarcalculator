import React from 'react';

// ─────────────────────── StepHome Illustrations ───────────────────────────────

export function HouseIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="h-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e40af"/>
          <stop offset="100%" stopColor="#93c5fd"/>
        </linearGradient>
        <linearGradient id="h-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80"/>
          <stop offset="100%" stopColor="#16a34a"/>
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="80" height="60" rx="10" fill="url(#h-sky)"/>

      {/* Cloud */}
      <ellipse cx="62" cy="9" rx="10" ry="5" fill="white" opacity="0.9"/>
      <ellipse cx="54" cy="11" rx="7" ry="4.5" fill="white" opacity="0.9"/>
      <ellipse cx="70" cy="11" rx="6" ry="3.5" fill="white" opacity="0.85"/>

      {/* Sun top-left */}
      <circle cx="12" cy="11" r="5.5" fill="#fde68a"/>
      <line x1="12" y1="3"   x2="12" y2="5"   stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="12" y1="17"  x2="12" y2="19"  stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="4"  y1="11"  x2="6"  y2="11"  stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18" y1="11"  x2="20" y2="11"  stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="7"  y1="6"   x2="8.4" y2="7.4" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15.6" y1="14.6" x2="17" y2="16" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Ground */}
      <rect y="48" width="80" height="12" fill="url(#h-ground)"/>

      {/* House right-face depth strip */}
      <polygon points="51,30 59,25 59,50 51,52" fill="#d1d5db"/>

      {/* House front wall */}
      <rect x="12" y="30" width="39" height="22" fill="#f9fafb"/>

      {/* Wall/depth edge */}
      <line x1="51" y1="30" x2="51" y2="52" stroke="#9ca3af" strokeWidth="0.7"/>

      {/* Front roof slope (dark slate, main face) */}
      <polygon points="6,30 33,12 51,30" fill="#0f172a"/>

      {/* Side roof slope (slightly lighter — depth) */}
      <polygon points="33,12 51,30 59,25 41,7" fill="#1e293b"/>

      {/* Roof ridge */}
      <line x1="33" y1="12" x2="41" y2="7" stroke="#020617" strokeWidth="1"/>

      {/* Solar panels on front slope — precise parallelograms following slope angle */}
      {/* Slope dir (18,18) unit=(0.707,0.707), perp=(-0.707,0.707) */}
      <polygon points="36,16 42,22 46,26 40,20" fill="#1e3a8a"/>
      <polygon points="42,22 48,28 52,31 46,26" fill="#1e3a8a"/>
      {/* Panel cell grid */}
      <line x1="39" y1="18" x2="44" y2="24" stroke="#60a5fa" strokeWidth="0.5" opacity="0.55"/>
      <line x1="45" y1="24" x2="50" y2="29" stroke="#60a5fa" strokeWidth="0.5" opacity="0.55"/>
      <line x1="36" y1="21" x2="46" y2="21" stroke="#60a5fa" strokeWidth="0.4" opacity="0.35"/>
      <line x1="42" y1="27" x2="52" y2="26" stroke="#60a5fa" strokeWidth="0.4" opacity="0.35"/>
      {/* Panel glare highlight */}
      <polygon points="36,16 39,16 40,19 37,19" fill="white" opacity="0.28"/>
      <polygon points="42,22 45,22 46,25 43,25" fill="white" opacity="0.28"/>

      {/* Left window */}
      <rect x="13" y="33" width="11" height="9" rx="2" fill="#bae6fd"/>
      <line x1="18.5" y1="33" x2="18.5" y2="42" stroke="#7dd3fc" strokeWidth="0.8"/>
      <line x1="13"   y1="37.5" x2="24" y2="37.5" stroke="#7dd3fc" strokeWidth="0.8"/>
      {/* Window glare */}
      <polygon points="14,33 17,33 14,36" fill="white" opacity="0.3"/>

      {/* Right window */}
      <rect x="40" y="33" width="10" height="9" rx="2" fill="#bae6fd"/>
      <line x1="45"  y1="33" x2="45"  y2="42" stroke="#7dd3fc" strokeWidth="0.8"/>
      <line x1="40"  y1="37.5" x2="50" y2="37.5" stroke="#7dd3fc" strokeWidth="0.8"/>
      <polygon points="41,33 44,33 41,36" fill="white" opacity="0.3"/>

      {/* Door */}
      <rect x="26" y="38" width="12" height="14" rx="2" fill="#fbbf24"/>
      <rect x="27" y="39" width="10" height="12" rx="1.5" fill="#f59e0b"/>
      <circle cx="36" cy="45" r="1.2" fill="#d97706"/>

      {/* Side-face window hint */}
      <rect x="53" y="32" width="4" height="4" rx="1" fill="#bae6fd" opacity="0.6"/>
    </svg>
  );
}

export function CondoIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="c-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3730a3"/>
          <stop offset="100%" stopColor="#a5b4fc"/>
        </linearGradient>
      </defs>
      <rect width="80" height="60" rx="10" fill="url(#c-sky)"/>
      <rect y="50" width="80" height="10" fill="#6366f1" opacity="0.3"/>

      {/* Building right face */}
      <polygon points="58,8 65,4 65,48 58,52" fill="#c7d2fe"/>
      {/* Building front face */}
      <rect x="16" y="8" width="42" height="44" fill="#f0f4ff"/>
      {/* Face/depth edge */}
      <line x1="58" y1="8" x2="58" y2="52" stroke="#a5b4fc" strokeWidth="0.7"/>
      {/* Building top */}
      <polygon points="16,8 23,4 65,4 58,8" fill="#a5b4fc"/>

      {/* Floor separation lines */}
      <line x1="16" y1="20" x2="58" y2="20" stroke="#c7d2fe" strokeWidth="0.8"/>
      <line x1="16" y1="32" x2="58" y2="32" stroke="#c7d2fe" strokeWidth="0.8"/>
      <line x1="16" y1="42" x2="58" y2="42" stroke="#c7d2fe" strokeWidth="0.8"/>

      {/* Windows — 3 floors × 3 cols */}
      {[[20,11],[33,11],[46,11],[20,23],[33,23],[46,23],[20,34],[33,34],[46,34]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y} width="9" height="7" rx="1.5" fill="#818cf8"/>
          <rect x={x} y={y} width="9" height="3" rx="1" fill="#a5b4fc" opacity="0.5"/>
          <polygon points={`${x},${y} ${x+3},${y} ${x},${y+3}`} fill="white" opacity="0.15"/>
        </g>
      ))}

      {/* Entrance */}
      <rect x="27" y="42" width="20" height="10" rx="2" fill="#6366f1"/>
      <line x1="37" y1="42" x2="37" y2="52" stroke="#4f46e5" strokeWidth="0.8"/>
      <rect x="29" y="43" width="7" height="8" rx="1" fill="#818cf8" opacity="0.5"/>
      <rect x="38" y="43" width="7" height="8" rx="1" fill="#818cf8" opacity="0.5"/>

      {/* Rooftop solar panels on top face */}
      <polygon points="20,7.5 31,4.5 33,6 22,9" fill="#1e3a8a" opacity="0.9"/>
      <polygon points="33,6  44,3   46,4.5 35,7.5" fill="#1e3a8a" opacity="0.9"/>
      <polygon points="20,7.5 22,8" stroke="#60a5fa" strokeWidth="0.4" fill="none"/>
    </svg>
  );
}

export function ApartmentIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="a-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#581c87"/>
          <stop offset="100%" stopColor="#c084fc"/>
        </linearGradient>
      </defs>
      <rect width="80" height="60" rx="10" fill="url(#a-sky)"/>
      <rect y="53" width="80" height="7" fill="#7e22ce" opacity="0.4"/>

      {/* Smaller adjacent building */}
      <polygon points="5,26 9,22 23,22 19,26" fill="#e9d5ff"/>
      <rect x="5" y="26" width="18" height="28" fill="#ede9fe"/>
      {[[8,28],[14,28],[8,35],[14,35],[8,42],[14,42]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="4" height="4" rx="0.8" fill="#a78bfa" opacity="0.7"/>
      ))}

      {/* Main tower right face */}
      <polygon points="60,4 67,1 67,50 60,53" fill="#e9d5ff"/>
      {/* Main tower front face */}
      <rect x="26" y="4" width="34" height="50" fill="#f5f3ff"/>
      {/* Depth edge */}
      <line x1="60" y1="4" x2="60" y2="53" stroke="#c4b5fd" strokeWidth="0.7"/>
      {/* Top face */}
      <polygon points="26,4 33,1 67,1 60,4" fill="#c4b5fd"/>

      {/* Floor lines */}
      <line x1="26" y1="14" x2="60" y2="14" stroke="#e9d5ff" strokeWidth="0.8"/>
      <line x1="26" y1="24" x2="60" y2="24" stroke="#e9d5ff" strokeWidth="0.8"/>
      <line x1="26" y1="34" x2="60" y2="34" stroke="#e9d5ff" strokeWidth="0.8"/>
      <line x1="26" y1="44" x2="60" y2="44" stroke="#e9d5ff" strokeWidth="0.8"/>

      {/* Windows 4×3 grid */}
      {[[29,6],[38,6],[50,6],[29,16],[38,16],[50,16],[29,26],[38,26],[50,26],[29,36],[38,36],[50,36]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y} width="7" height="6" rx="1.5" fill="#a78bfa"/>
          <rect x={x} y={y} width="7" height="2.5" rx="1" fill="#c4b5fd" opacity="0.5"/>
          <polygon points={`${x},${y} ${x+2.5},${y} ${x},${y+2.5}`} fill="white" opacity="0.15"/>
        </g>
      ))}

      {/* Entrance */}
      <rect x="34" y="44" width="16" height="10" rx="2" fill="#7c3aed"/>
      <line x1="42" y1="44" x2="42" y2="54" stroke="#6d28d9" strokeWidth="0.8"/>
      <rect x="35" y="45" width="6" height="8" rx="1" fill="#a78bfa" opacity="0.4"/>
      <rect x="43" y="45" width="6" height="8" rx="1" fill="#a78bfa" opacity="0.4"/>
      <circle cx="49.5" cy="49" r="1" fill="#ede9fe" opacity="0.8"/>
    </svg>
  );
}

export function OwnsHomeIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="own-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d1fae5"/>
          <stop offset="100%" stopColor="#ecfdf5"/>
        </linearGradient>
      </defs>
      <rect width="80" height="60" rx="10" fill="url(#own-bg)"/>
      {/* House silhouette */}
      <polygon points="8,38 40,22 72,38" fill="#a7f3d0"/>
      <rect x="14" y="38" width="52" height="18" fill="#bbf7d0"/>
      <rect x="30" y="43" width="14" height="13" rx="1.5" fill="#6ee7b7"/>
      <rect x="17" y="40" width="10" height="9" rx="1.5" fill="#a7f3d0"/>
      <rect x="53" y="40" width="10" height="9" rx="1.5" fill="#a7f3d0"/>
      {/* Key body */}
      <circle cx="36" cy="28" r="9.5" fill="none" stroke="#059669" strokeWidth="3"/>
      <circle cx="36" cy="28" r="5" fill="none" stroke="#059669" strokeWidth="2"/>
      {/* Key shaft + teeth */}
      <rect x="43.5" y="26" width="14" height="4" rx="2" fill="#059669"/>
      <rect x="52" y="30" width="4" height="5" rx="1.5" fill="#059669"/>
      <rect x="46" y="30" width="4" height="4" rx="1.5" fill="#059669"/>
      {/* Green check badge */}
      <circle cx="62" cy="13" r="9" fill="#059669"/>
      <circle cx="62" cy="13" r="7" fill="#10b981"/>
      <polyline points="57,13 60.5,16.5 67,9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

export function RentsHomeIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="60" rx="10" fill="#f8fafc"/>
      {/* Document shadow */}
      <rect x="22" y="9" width="38" height="48" rx="4" fill="#e2e8f0"/>
      {/* Document */}
      <rect x="20" y="7" width="38" height="48" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="1.2"/>
      {/* Folded corner */}
      <polygon points="44,7 58,7 58,21" fill="#f1f5f9"/>
      <polygon points="44,7 44,21 58,21" fill="#e2e8f0"/>
      <line x1="44" y1="7" x2="44" y2="21" stroke="#cbd5e1" strokeWidth="0.6"/>
      {/* House icon */}
      <polygon points="28,21 36,14 44,21" fill="#94a3b8"/>
      <rect x="30" y="21" width="12" height="9" fill="#e2e8f0"/>
      <rect x="33" y="23" width="4" height="7" rx="0.5" fill="#94a3b8"/>
      {/* Text lines */}
      <rect x="26" y="33" width="20" height="2.5" rx="1.25" fill="#e2e8f0"/>
      <rect x="26" y="38" width="16" height="2.5" rx="1.25" fill="#e2e8f0"/>
      <rect x="26" y="43" width="18" height="2.5" rx="1.25" fill="#e2e8f0"/>
      {/* Signature */}
      <line x1="26" y1="49" x2="50" y2="49" stroke="#e2e8f0" strokeWidth="1"/>
      <path d="M 27 47 Q 31 44 33 47 Q 35 50 39 46 Q 41 43 43 46" stroke="#64748b" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// ─────────────────────── StepRoof Sun Illustrations ──────────────────────────

export function FullSunIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fs-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0369a1"/>
          <stop offset="100%" stopColor="#7dd3fc"/>
        </linearGradient>
        <radialGradient id="fs-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#fef9c3" stopOpacity="0.95"/>
          <stop offset="100%" stopColor="#fef9c3" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="fs-disc" cx="38%" cy="35%" r="62%">
          <stop offset="0%"   stopColor="#ffffff"/>
          <stop offset="35%"  stopColor="#fde68a"/>
          <stop offset="100%" stopColor="#f59e0b"/>
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="80" height="60" rx="8" fill="url(#fs-bg)"/>
      {/* Warm horizon shimmer */}
      <ellipse cx="40" cy="60" rx="40" ry="14" fill="#fef3c7" opacity="0.2"/>

      {/* Sun halo */}
      <circle cx="40" cy="20" r="17" fill="url(#fs-halo)"/>

      {/* 8 rays: cardinal = long, diagonal = short */}
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const r1 = 13, r2 = i % 2 === 0 ? 22 : 17;
        return (
          <line key={deg}
            x1={40 + Math.cos(rad) * r1} y1={20 + Math.sin(rad) * r1}
            x2={40 + Math.cos(rad) * r2} y2={20 + Math.sin(rad) * r2}
            stroke="#fbbf24" strokeWidth={i % 2 === 0 ? 2.5 : 1.8} strokeLinecap="round"
          />
        );
      })}

      {/* Sun disc */}
      <circle cx="40" cy="20" r="9.5" fill="url(#fs-disc)"/>
      {/* Lens glare highlight */}
      <ellipse cx="37.5" cy="17.5" rx="2.5" ry="2" fill="white" opacity="0.72"/>

      {/* Roof */}
      <polygon points="0,60 40,40 80,60" fill="#1e293b"/>
      <line x1="0" y1="60" x2="40" y2="40" stroke="#334155" strokeWidth="1"/>
      <line x1="80" y1="60" x2="40" y2="40" stroke="#334155" strokeWidth="1"/>

      {/* Two solar panels on right slope — parallelogram perspective */}
      <polygon points="43,48 53,43 56,48 46,53" fill="#1d4ed8"/>
      <polygon points="53,43 63,38 66,43 56,48" fill="#1d4ed8"/>
      {/* Cell grid lines */}
      <line x1="43" y1="50.5" x2="56" y2="45.5" stroke="#93c5fd" strokeWidth="0.5" opacity="0.6"/>
      <line x1="53" y1="45.5" x2="66" y2="40.5" stroke="#93c5fd" strokeWidth="0.5" opacity="0.6"/>
      <line x1="49" y1="45.5" x2="50" y2="51"   stroke="#93c5fd" strokeWidth="0.5" opacity="0.5"/>
      <line x1="59" y1="40.5" x2="60" y2="46"   stroke="#93c5fd" strokeWidth="0.5" opacity="0.5"/>
      {/* Bright glare on panels */}
      <polygon points="44,48.5 47,47 48,49 45,50.5" fill="white" opacity="0.62"/>
      <polygon points="54,43.5 57,42 58,44 55,45.5" fill="white" opacity="0.62"/>
    </svg>
  );
}

export function PartialShadeIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ps-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8"/>
          <stop offset="100%" stopColor="#bae6fd"/>
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="80" height="60" rx="8" fill="url(#ps-bg)"/>

      {/* Sun — upper-left, peeking from cloud edge */}
      <circle cx="17" cy="16" r="10" fill="#fde68a" opacity="0.45"/>
      <circle cx="17" cy="16" r="7"  fill="#fbbf24"/>
      <circle cx="17" cy="16" r="5"  fill="#fef3c7"/>
      <ellipse cx="15.5" cy="14.5" rx="1.8" ry="1.4" fill="white" opacity="0.72"/>
      {/* Rays visible on exposed (left / top / bottom-left) sides */}
      <line x1="17" y1="4"  x2="17" y2="7"  stroke="#f59e0b" strokeWidth="2"   strokeLinecap="round"/>
      <line x1="6"  y1="16" x2="3"  y2="16" stroke="#f59e0b" strokeWidth="2"   strokeLinecap="round"/>
      <line x1="10" y1="8"  x2="8"  y2="6"  stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="10" y1="24" x2="8"  y2="26" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="27" y1="9"  x2="29" y2="7"  stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>

      {/* Fluffy cloud — realistic puff shapes, overlapping sun's right edge */}
      <ellipse cx="55" cy="26" rx="26" ry="10" fill="#dde6ef"/>
      <circle cx="32" cy="20" r="10" fill="#f1f5f9"/>
      <circle cx="46" cy="14" r="12" fill="white"/>
      <circle cx="61" cy="16" r="11" fill="#f8fafc"/>
      <circle cx="73" cy="22" r="9"  fill="#f1f5f9"/>
      <ellipse cx="54" cy="30" rx="24" ry="7"  fill="#f1f5f9"/>
      {/* Cloud shadow underside */}
      <ellipse cx="54" cy="34" rx="22" ry="4"  fill="#94a3b8" opacity="0.38"/>

      {/* Tree — right edge, canopy clips the frame naturally */}
      <rect x="72" y="40" width="4" height="20" rx="1" fill="#374151"/>
      <circle cx="74" cy="36" r="9"  fill="#1e3a5f"/>
      <circle cx="70" cy="41" r="7"  fill="#1a3450"/>
      <circle cx="79" cy="42" r="6"  fill="#1e3a5f"/>

      {/* Roof */}
      <polygon points="0,60 40,42 80,60" fill="#1e293b"/>
      <line x1="0" y1="60" x2="40" y2="42" stroke="#334155" strokeWidth="1"/>
      <line x1="80" y1="60" x2="40" y2="42" stroke="#334155" strokeWidth="1"/>

      {/* Panel 1 — in sunlight (left / closer to sun) */}
      <polygon points="43,49 53,44 56,49 46,54" fill="#1d4ed8"/>
      <polygon points="44,49.5 47,48 48,50 45,51.5" fill="white" opacity="0.58"/>

      {/* Panel 2 — in cloud shadow (right) */}
      <polygon points="53,44 63,39 66,44 56,49" fill="#1d4ed8" opacity="0.45"/>
      <polygon points="53,44 63,39 66,44 56,49" fill="#1e293b" opacity="0.28"/>
    </svg>
  );
}

export function MostlyShadeIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ms-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f2937"/>
          <stop offset="100%" stopColor="#4b5563"/>
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="80" height="60" rx="8" fill="url(#ms-bg)"/>

      {/* Heavy overcast clouds — layered back to front */}
      <ellipse cx="40" cy="7"  rx="42" ry="11" fill="#374151"/>
      <ellipse cx="18" cy="17" rx="22" ry="13" fill="#3f4f5e"/>
      <ellipse cx="60" cy="15" rx="26" ry="13" fill="#374151"/>
      {/* Front cloud bumps */}
      <circle cx="12" cy="24" r="13" fill="#4b5563"/>
      <circle cx="30" cy="20" r="14" fill="#4f5f6e"/>
      <circle cx="50" cy="21" r="14" fill="#4a5768"/>
      <circle cx="68" cy="25" r="12" fill="#4b5563"/>
      {/* Cloud underbelly fill */}
      <ellipse cx="40" cy="31" rx="40" ry="9"  fill="#3d4c58"/>
      {/* Darkest underside creases */}
      <ellipse cx="25" cy="35" rx="20" ry="5"  fill="#2d3748" opacity="0.75"/>
      <ellipse cx="60" cy="36" rx="18" ry="4"  fill="#2d3748" opacity="0.65"/>
      {/* Barely-there sun disc behind mass of cloud */}
      <circle cx="40" cy="14" r="5" fill="#fde68a" opacity="0.07"/>

      {/* Left tree — trunk + layered canopy circles */}
      <rect x="2"  y="33" width="6" height="27" rx="1" fill="#1e293b"/>
      <circle cx="5"   cy="29" r="14" fill="#111827"/>
      <circle cx="0"   cy="37" r="10" fill="#0f172a"/>
      <circle cx="11"  cy="36" r="8"  fill="#111827"/>

      {/* Right tree */}
      <rect x="69" y="38" width="5" height="22" rx="1" fill="#1e293b"/>
      <circle cx="71"  cy="33" r="12" fill="#111827"/>
      <circle cx="76"  cy="40" r="9"  fill="#0f172a"/>
      <circle cx="65"  cy="41" r="8"  fill="#111827"/>

      {/* Roof */}
      <polygon points="0,60 40,44 80,60" fill="#1e293b"/>
      <polygon points="0,60 40,44 80,60" fill="#0f172a" opacity="0.45"/>
      <line x1="0" y1="60" x2="40" y2="44" stroke="#2d3748" strokeWidth="0.8"/>
      <line x1="80" y1="60" x2="40" y2="44" stroke="#2d3748" strokeWidth="0.8"/>

      {/* Panels — deep shadow, barely distinguishable */}
      <polygon points="43,51 53,46 56,51 46,56" fill="#2d3748"/>
      <polygon points="53,46 63,41 66,46 56,51" fill="#2d3748"/>
      <polygon points="43,51 53,46 56,51 46,56" fill="#0f172a" opacity="0.42"/>
      <polygon points="53,46 63,41 66,46 56,51" fill="#0f172a" opacity="0.42"/>
    </svg>
  );
}

// ─────────────────────── StepRoof Type Illustrations ─────────────────────────

export function AsphaltShinglesIllustration() {
  // Precise 3-tab staggered shingle pattern: 8px tabs, 7px exposed, 4px stagger
  const rows = [
    { y: 43, off: 0 }, { y: 36, off: 4 }, { y: 29, off: 0 },
    { y: 22, off: 4 }, { y: 15, off: 0 }, { y: 8,  off: 4 }, { y: 1, off: 0 },
  ];
  // Three-tone shingle color palette for realism
  const palette = ['#2d3748', '#3d4f62', '#4a5f77'];

  return (
    <svg viewBox="0 0 64 50" width="64" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Roof deck / background */}
      <rect width="64" height="50" rx="8" fill="#1a2535"/>

      {rows.map(({ y, off }, ri) => {
        const h = 50 - y;
        const tabs = [];
        for (let i = -1; i <= 9; i++) {
          const x = i * 8 - off;
          if (x >= 64) break;
          // Three-way color cycle for variation
          tabs.push(<rect key={i} x={x} y={y} width={8} height={h} fill={palette[(i * 3 + ri) % 3]}/>);
        }
        return (
          <React.Fragment key={ri}>
            {tabs}
            {/* Drip-edge shadow — dark line at each row's exposed top */}
            <rect x={0} y={y}     width={64} height={1.2} fill="#0d1520"/>
            {/* Subtle highlight just below drip edge */}
            <rect x={0} y={y + 1.2} width={64} height={0.8} fill="#5a7090" opacity={0.25}/>
            {/* Tab cut lines every ~24px, staggered */}
            {[-off + 12, -off + 36, -off + 60].map(cx => (
              cx > 0 && cx < 64 &&
              <line key={cx} x1={cx} y1={y} x2={cx} y2={Math.min(y + 7, 50)}
                stroke="#0d1520" strokeWidth={0.7} key={cx}/>
            ))}
          </React.Fragment>
        );
      })}

      {/* Solar panels — top-right, 2×1 array */}
      <rect x="34" y="2" width="13" height="9" rx="1.5" fill="#1e3a8a"/>
      <rect x="49" y="2" width="13" height="9" rx="1.5" fill="#1e3a8a"/>
      <line x1="40.5" y1="2" x2="40.5" y2="11" stroke="#60a5fa" strokeWidth="0.5" opacity="0.45"/>
      <line x1="55.5" y1="2" x2="55.5" y2="11" stroke="#60a5fa" strokeWidth="0.5" opacity="0.45"/>
      <line x1="34"   y1="6.5" x2="47" y2="6.5" stroke="#60a5fa" strokeWidth="0.5" opacity="0.45"/>
      <line x1="49"   y1="6.5" x2="62" y2="6.5" stroke="#60a5fa" strokeWidth="0.5" opacity="0.45"/>
      <polygon points="34,2 37,2 38,4 35,4" fill="white" opacity="0.22"/>
      <polygon points="49,2 52,2 53,4 50,4" fill="white" opacity="0.22"/>
    </svg>
  );
}

export function MetalRoofIllustration() {
  return (
    <svg viewBox="0 0 64 50" width="64" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Metallic S-curve gradient per panel: dark → bright specular → dark */}
        <linearGradient id="mr-panel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#334155"/>
          <stop offset="25%"  stopColor="#7f94ab"/>
          <stop offset="50%"  stopColor="#dde5ef"/>
          <stop offset="72%"  stopColor="#8fa5bc"/>
          <stop offset="100%" stopColor="#334155"/>
        </linearGradient>
        <linearGradient id="mr-seam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0f172a"/>
          <stop offset="40%"  stopColor="#1e293b"/>
          <stop offset="100%" stopColor="#0f172a"/>
        </linearGradient>
      </defs>

      {/* Base */}
      <rect width="64" height="50" rx="8" fill="#334155"/>

      {/* Panel strips with metallic gradient */}
      {[0, 9, 18, 27, 36, 45, 54].map(x => (
        <rect key={x} x={x} y={0} width={8.5} height={50} fill="url(#mr-panel)"/>
      ))}

      {/* Standing seam ridge caps */}
      {[8, 17, 26, 35, 44, 53].map(x => (
        <React.Fragment key={x}>
          <rect x={x} y={0} width={2.5} height={50} rx={1.2} fill="url(#mr-seam)"/>
          {/* Ridge cap highlight */}
          <rect x={x + 0.4} y={0} width={0.8} height={50} fill="white" opacity={0.1}/>
        </React.Fragment>
      ))}

      {/* Horizontal weathering chalk lines */}
      <line x1="0" y1="16" x2="64" y2="16" stroke="#475569" strokeWidth="0.6" opacity="0.35"/>
      <line x1="0" y1="33" x2="64" y2="33" stroke="#475569" strokeWidth="0.6" opacity="0.35"/>

      {/* Subtle screw dots at top of each seam cap */}
      {[8, 17, 26, 35, 44, 53].map(x => (
        <circle key={x} cx={x + 1.25} cy={4} r={1} fill="#0f172a" opacity={0.6}/>
      ))}

      {/* Eave drip edge */}
      <rect x="0" y="47" width="64" height="3" rx="0" fill="#1e293b"/>
      <rect x="0" y="47" width="64" height="0.8" fill="#475569" opacity="0.5"/>
    </svg>
  );
}

export function TileRoofIllustration() {
  // Barrel tile (Spanish/S-tile) using quadratic bezier arches
  // Each arch: M x1,bottom Q cx,peak x2,bottom filled with gradient+highlight
  const tileW = 16;
  const rows = [
    { y: 0, bottom: 13, off: 0 },
    { y: 13, bottom: 26, off: 8 },
    { y: 26, bottom: 39, off: 0 },
    { y: 39, bottom: 52, off: 8 },
  ];
  // Alternating terra-cotta colors for realism
  const fills = ['#c2560a', '#d97706', '#b84d08', '#e07a1a'];

  return (
    <svg viewBox="0 0 64 50" width="64" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tr-dome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b"/>
          <stop offset="50%" stopColor="#d97706"/>
          <stop offset="100%" stopColor="#92400e"/>
        </linearGradient>
        <linearGradient id="tr-dome2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24"/>
          <stop offset="50%" stopColor="#c2560a"/>
          <stop offset="100%" stopColor="#7c2d12"/>
        </linearGradient>
      </defs>

      {/* Valley background */}
      <rect width="64" height="50" rx="8" fill="#7c2d12"/>

      {rows.map(({ y, bottom, off }, ri) => {
        const arches = [];
        for (let i = -1; i <= 5; i++) {
          const x1 = i * tileW - off;
          const x2 = x1 + tileW;
          const cx = x1 + tileW / 2;
          const peak = y + 1.5;
          const grad = (i + ri) % 2 === 0 ? 'url(#tr-dome)' : 'url(#tr-dome2)';

          // Main arch body
          arches.push(
            <path key={`a${i}`}
              d={`M ${x1},${bottom} Q ${cx},${peak} ${x2},${bottom} L ${x2},${y} L ${x1},${y} Z`}
              fill={grad}
            />
          );
          // Highlight arc near peak of each dome
          arches.push(
            <path key={`h${i}`}
              d={`M ${x1 + 2},${bottom - 4} Q ${cx},${peak + 3} ${x2 - 2},${bottom - 4}`}
              stroke="#fde68a" strokeWidth="1" fill="none" opacity="0.5"
            />
          );
          // Side-edge shadow lines on each tile
          arches.push(<line key={`s${i}`} x1={x2} y1={y} x2={x2} y2={bottom} stroke="#92400e" strokeWidth="0.6" opacity="0.5"/>);
        }
        return (
          <React.Fragment key={ri}>
            {arches}
            {/* Deep groove shadow between rows */}
            <rect x={0} y={bottom - 2.5} width={64} height={3} fill="#450a03"/>
            {/* Groove highlight top edge */}
            <rect x={0} y={bottom - 2.5} width={64} height={0.8} fill="#b45309" opacity={0.4}/>
          </React.Fragment>
        );
      })}
    </svg>
  );
}

export function FlatRoofIllustration() {
  return (
    <svg viewBox="0 0 64 50" width="64" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fl-mem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9ca3af"/>
          <stop offset="100%" stopColor="#6b7280"/>
        </linearGradient>
        <linearGradient id="fl-panel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e3a8a"/>
          <stop offset="50%" stopColor="#2563eb"/>
          <stop offset="100%" stopColor="#1e3a8a"/>
        </linearGradient>
      </defs>

      {/* TPO membrane surface */}
      <rect width="64" height="50" rx="8" fill="url(#fl-mem)"/>

      {/* Seam grid — typical TPO layout */}
      <line x1="0"  y1="17" x2="64" y2="17" stroke="#6b7280" strokeWidth="1.2"/>
      <line x1="0"  y1="34" x2="64" y2="34" stroke="#6b7280" strokeWidth="1.2"/>
      <line x1="16" y1="0"  x2="16" y2="50" stroke="#6b7280" strokeWidth="0.8"/>
      <line x1="32" y1="0"  x2="32" y2="50" stroke="#6b7280" strokeWidth="0.8"/>
      <line x1="48" y1="0"  x2="48" y2="50" stroke="#6b7280" strokeWidth="0.8"/>
      {/* Seam weld dots */}
      {[0, 16, 32, 48].map(x => [17, 34].map(y =>
        <circle key={`${x}${y}`} cx={x + 8} cy={y} r={1.2} fill="#4b5563"/>
      ))}

      {/* Solar panel array on tilt-mounts (viewed at angle) */}
      {/* Panel 1 */}
      <polygon points="4,44 22,31 22,37 4,50" fill="url(#fl-panel)"/>
      {/* Panel 1 top-edge bevel */}
      <line x1="4" y1="44" x2="22" y2="31" stroke="#60a5fa" strokeWidth="0.6" opacity="0.5"/>
      {/* Panel 1 grid */}
      <line x1="8"  y1="42" x2="22" y2="33" stroke="white" strokeWidth="0.5" opacity="0.3"/>
      <line x1="12" y1="47" x2="22" y2="41" stroke="white" strokeWidth="0.5" opacity="0.3"/>
      <line x1="13" y1="37" x2="13" y2="47" stroke="white" strokeWidth="0.4" opacity="0.25"/>

      {/* Panel 2 */}
      <polygon points="26,44 44,31 44,37 26,50" fill="url(#fl-panel)"/>
      <line x1="26" y1="44" x2="44" y2="31" stroke="#60a5fa" strokeWidth="0.6" opacity="0.5"/>
      <line x1="30" y1="42" x2="44" y2="33" stroke="white" strokeWidth="0.5" opacity="0.3"/>
      <line x1="34" y1="47" x2="44" y2="41" stroke="white" strokeWidth="0.5" opacity="0.3"/>
      <line x1="35" y1="37" x2="35" y2="47" stroke="white" strokeWidth="0.4" opacity="0.25"/>

      {/* Panel glare */}
      <polygon points="4,44 7,42 8,44 5,46" fill="white" opacity="0.25"/>
      <polygon points="26,44 29,42 30,44 27,46" fill="white" opacity="0.25"/>

      {/* Mount legs */}
      <line x1="4"  y1="50" x2="4"  y2="50" stroke="#374151" strokeWidth="1.5"/>
      <line x1="22" y1="37" x2="22" y2="42" stroke="#374151" strokeWidth="1.5"/>
      <line x1="26" y1="50" x2="26" y2="50" stroke="#374151" strokeWidth="1.5"/>
      <line x1="44" y1="37" x2="44" y2="42" stroke="#374151" strokeWidth="1.5"/>

      {/* Parapet walls */}
      <rect x="0"  y="0"  width="64" height="4"  rx="8" fill="#4b5563"/>
      <rect x="0"  y="0"  width="3"  height="50" rx="1" fill="#4b5563"/>
      <rect x="61" y="0"  width="3"  height="50" rx="1" fill="#4b5563"/>
      {/* Parapet highlight */}
      <rect x="0"  y="0"  width="64" height="1"  rx="0" fill="#9ca3af" opacity="0.5"/>
    </svg>
  );
}

// ─────────────────────── StepBattery Illustrations ───────────────────────────

export function NoBatteryIllustration() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfdbfe"/>
          <stop offset="100%" stopColor="#e0f2fe"/>
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#nb-sky)"/>
      <rect y="38" width="48" height="10" fill="#86efac" opacity="0.6"/>

      {/* House */}
      <polygon points="3,30 20,18 37,30" fill="#1e293b"/>
      <rect x="5" y="30" width="30" height="16" fill="#f1f5f9"/>
      {/* Door */}
      <rect x="14" y="35" width="7" height="11" rx="1" fill="#94a3b8"/>
      <circle cx="20" cy="41" r="0.8" fill="#64748b"/>
      {/* Window */}
      <rect x="22" y="32" width="8" height="7" rx="1" fill="#bae6fd"/>
      <line x1="26" y1="32" x2="26" y2="39" stroke="#93c5fd" strokeWidth="0.6"/>

      {/* Utility pole */}
      <rect x="36" y="6" width="3" height="30" fill="#64748b"/>
      <rect x="31" y="9"  width="13" height="2" rx="1" fill="#475569"/>
      <rect x="33" y="14" width="9"  height="1.5" rx="0.7" fill="#475569"/>
      {/* Insulators */}
      <circle cx="31.5" cy="10" r="1.5" fill="#374151"/>
      <circle cx="43.5" cy="10" r="1.5" fill="#374151"/>
      <circle cx="33"   cy="14.8" r="1.2" fill="#374151"/>
      <circle cx="42"   cy="14.8" r="1.2" fill="#374151"/>
      {/* Power lines */}
      <path d="M 31.5 11 Q 22 16 14 20" stroke="#64748b" strokeWidth="0.9" fill="none"/>
      <path d="M 43.5 11 Q 44 20 44 30"  stroke="#64748b" strokeWidth="0.9" fill="none"/>
      <path d="M 33   15 Q 24 19 18 22"  stroke="#64748b" strokeWidth="0.7" fill="none"/>

      {/* Service drop to house */}
      <path d="M 14 20 Q 10 24 7 28" stroke="#64748b" strokeWidth="0.8" fill="none"/>
      {/* Meter */}
      <rect x="4" y="27" width="4" height="5" rx="1" fill="#475569"/>
      <circle cx="6" cy="29.5" r="1.2" fill="#94a3b8"/>
    </svg>
  );
}

export function OneBatteryIllustration() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ob-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a7f3d0"/>
          <stop offset="100%" stopColor="#d1fae5"/>
        </linearGradient>
        <linearGradient id="ob-batt" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#047857"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#ob-sky)"/>
      <rect y="38" width="48" height="10" fill="#4ade80" opacity="0.5"/>

      {/* House */}
      <polygon points="3,29 20,17 37,29" fill="#1e293b"/>
      <rect x="5" y="29" width="30" height="17" fill="#f0fdf4"/>
      {/* Solar panels on roof */}
      <polygon points="20,21 28,18 29,21 21,24" fill="#1e3a8a" opacity="0.9"/>
      <line x1="24.5" y1="19" x2="25" y2="22.5" stroke="#60a5fa" strokeWidth="0.5" opacity="0.4"/>
      {/* Door */}
      <rect x="13" y="33" width="7" height="13" rx="1" fill="#6ee7b7"/>
      <circle cx="19" cy="39.5" r="0.8" fill="#34d399"/>
      {/* Window */}
      <rect x="22" y="31" width="8" height="7" rx="1" fill="#bbf7d0"/>
      <line x1="26" y1="31" x2="26" y2="38" stroke="#6ee7b7" strokeWidth="0.6"/>

      {/* Powerwall battery unit — wall-mounted */}
      {/* Housing */}
      <rect x="36" y="18" width="10" height="22" rx="3" fill="url(#ob-batt)"/>
      {/* Housing face */}
      <rect x="37" y="19" width="8" height="20" rx="2.5" fill="#059669"/>
      {/* Brand stripe */}
      <rect x="37" y="19" width="8" height="3" rx="2.5" fill="#047857"/>
      {/* LED status bar */}
      <rect x="38" y="23.5" width="6" height="1.5" rx="0.8" fill="#34d399"/>
      {/* Charge level bars */}
      <rect x="38.5" y="27" width="5" height="2.5" rx="0.5" fill="#34d399"/>
      <rect x="38.5" y="31" width="5" height="2.5" rx="0.5" fill="#34d399"/>
      <rect x="38.5" y="35" width="5" height="2.5" rx="0.5" fill="#86efac" opacity="0.5"/>
      {/* Terminal nub at top */}
      <rect x="39" y="16" width="4" height="2.5" rx="0.8" fill="#047857"/>
      {/* Bottom bracket */}
      <rect x="37" y="37.5" width="8" height="1.5" rx="0.5" fill="#047857"/>

      {/* Connection cable */}
      <path d="M 35 28 Q 34 28 34 28" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="34" y1="28" x2="36" y2="28" stroke="#059669" strokeWidth="1.5"/>
      {/* Energy particles */}
      <circle cx="32" cy="28" r="1.5" fill="#34d399" opacity="0.85"/>
      <circle cx="29" cy="28" r="1.1" fill="#34d399" opacity="0.5"/>
    </svg>
  );
}

export function TwoBatteriesIllustration() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a"/>
          <stop offset="100%" stopColor="#fef3c7"/>
        </linearGradient>
        <linearGradient id="tb-batt" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b45309"/>
          <stop offset="100%" stopColor="#d97706"/>
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="10" fill="url(#tb-sky)"/>
      <rect y="39" width="48" height="9" fill="#fbbf24" opacity="0.35"/>

      {/* House */}
      <polygon points="2,29 17,19 32,29" fill="#1e293b"/>
      <rect x="4" y="29" width="26" height="17" fill="#fefce8"/>
      {/* Solar panels on roof */}
      <polygon points="17,23 24,20 25,23 18,26" fill="#1e3a8a" opacity="0.9"/>
      {/* Door */}
      <rect x="11" y="33" width="6" height="13" rx="1" fill="#fde68a"/>
      {/* Window */}
      <rect x="18" y="31" width="8" height="7" rx="1" fill="#fef9c3"/>
      <line x1="22" y1="31" x2="22" y2="38" stroke="#fde68a" strokeWidth="0.6"/>

      {/* Battery 1 (upper) */}
      <rect x="34" y="15" width="11" height="16" rx="3" fill="url(#tb-batt)"/>
      <rect x="35" y="16" width="9" height="14" rx="2.5" fill="#d97706"/>
      <rect x="35" y="16" width="9" height="3" rx="2.5" fill="#b45309"/>
      <rect x="35.5" y="20.5" width="2.8" height="1.5" rx="0.4" fill="#fbbf24"/>
      <rect x="39.5" y="20.5" width="2.8" height="1.5" rx="0.4" fill="#fbbf24"/>
      <rect x="36" y="23.5" width="6.5" height="2" rx="0.5" fill="#fbbf24"/>
      <rect x="36" y="27"   width="6.5" height="2" rx="0.5" fill="#fde68a" opacity="0.7"/>
      <rect x="36.5" y="13" width="5" height="2.5" rx="0.8" fill="#b45309"/>

      {/* Battery 2 (lower) */}
      <rect x="34" y="33" width="11" height="12" rx="3" fill="url(#tb-batt)"/>
      <rect x="35" y="34" width="9" height="10" rx="2.5" fill="#d97706"/>
      <rect x="35" y="34" width="9" height="2.5" rx="2.5" fill="#b45309"/>
      <rect x="36" y="38" width="6.5" height="2" rx="0.5" fill="#fbbf24"/>
      <rect x="36" y="41" width="6.5" height="1.5" rx="0.5" fill="#fde68a" opacity="0.6"/>

      {/* Shared bus bar connecting both batteries */}
      <line x1="33" y1="23" x2="34" y2="23" stroke="#d97706" strokeWidth="1.5"/>
      <line x1="33" y1="39" x2="34" y2="39" stroke="#d97706" strokeWidth="1.5"/>
      <line x1="33" y1="23" x2="33" y2="39" stroke="#d97706" strokeWidth="1.2"/>
      {/* House connection */}
      <line x1="30" y1="31" x2="33" y2="31" stroke="#d97706" strokeWidth="1.2"/>
      <circle cx="28.5" cy="31" r="1.4" fill="#fbbf24" opacity="0.8"/>

      {/* Energy bolt — decorative */}
      <polygon points="22,8 19,13 21,13 18,18 23,12 20.5,12" fill="#f59e0b"/>
    </svg>
  );
}
