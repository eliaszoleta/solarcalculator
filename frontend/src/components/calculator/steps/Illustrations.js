import React from 'react';

// Shared neutral palette — consistent across all illustrations
const C = {
  bg:   '#eef2f7',  // card background
  rd:   '#2d3748',  // roof dark (main face)
  rs:   '#3d5068',  // roof side / depth face
  w:    '#f4f7fa',  // front wall
  ws:   '#d6e2ed',  // side wall
  win:  '#a8c4d9',  // window
  pan:  '#6a8fa8',  // solar panel
  line: '#8aafc4',  // divider lines
  tr:   '#94a3b8',  // trim / subtle outlines
};

// ─────────────────────────── StepHome ─────────────────────────────────────────

export function HouseIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="60" rx="8" fill={C.bg}/>
      {/* Side depth face */}
      <polygon points="52,34 62,28 62,47 52,52" fill={C.ws}/>
      {/* Front face */}
      <rect x="12" y="34" width="40" height="18" fill={C.w}/>
      {/* Front roof slope */}
      <polygon points="12,34 33,16 52,34" fill={C.rd}/>
      {/* Side roof slope */}
      <polygon points="33,16 52,34 62,28" fill={C.rs}/>
      {/* Left window */}
      <rect x="14" y="37" width="11" height="8" rx="1" fill={C.win}/>
      <line x1="19.5" y1="37" x2="19.5" y2="45" stroke={C.line} strokeWidth="0.6" opacity="0.7"/>
      <line x1="14"   y1="41" x2="25"   y2="41" stroke={C.line} strokeWidth="0.6" opacity="0.7"/>
      {/* Right window */}
      <rect x="34" y="37" width="11" height="8" rx="1" fill={C.win}/>
      <line x1="39.5" y1="37" x2="39.5" y2="45" stroke={C.line} strokeWidth="0.6" opacity="0.7"/>
      <line x1="34"   y1="41" x2="45"   y2="41" stroke={C.line} strokeWidth="0.6" opacity="0.7"/>
      {/* Door */}
      <rect x="26" y="42" width="9" height="10" rx="1" fill={C.ws}/>
    </svg>
  );
}

export function CondoIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="60" rx="8" fill={C.bg}/>
      {/* Side face */}
      <polygon points="56,10 64,6 64,52 56,56" fill={C.ws}/>
      {/* Front face */}
      <rect x="18" y="10" width="38" height="46" fill={C.w}/>
      {/* Top face (flat roof) */}
      <polygon points="18,10 26,6 64,6 56,10" fill={C.rs}/>
      {/* Floor lines */}
      <line x1="18" y1="24" x2="56" y2="24" stroke={C.tr} strokeWidth="0.5" opacity="0.3"/>
      <line x1="18" y1="38" x2="56" y2="38" stroke={C.tr} strokeWidth="0.5" opacity="0.3"/>
      {/* 3×3 window grid */}
      {[[21,12],[32,12],[43,12],[21,26],[32,26],[43,26],[21,40],[32,40],[43,40]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="9" height="8" rx="1" fill={C.win}/>
      ))}
      {/* Entrance */}
      <rect x="31" y="48" width="13" height="8" rx="1" fill={C.ws}/>
    </svg>
  );
}

export function ApartmentIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="60" rx="8" fill={C.bg}/>
      {/* Smaller adjacent wing */}
      <polygon points="12,28 18,24 30,24 24,28" fill={C.rs}/>
      <rect x="12" y="28" width="18" height="30" fill="#e2eaf3"/>
      {[[14,30],[20,30],[14,38],[20,38],[14,46],[20,46]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="5" height="5" rx="0.8" fill={C.win} opacity="0.75"/>
      ))}
      {/* Main tower side face */}
      <polygon points="58,6 66,2 66,52 58,56" fill={C.ws}/>
      {/* Main tower front face */}
      <rect x="28" y="6" width="30" height="50" fill={C.w}/>
      {/* Top face */}
      <polygon points="28,6 36,2 66,2 58,6" fill={C.rs}/>
      {/* Floor lines */}
      <line x1="28" y1="18" x2="58" y2="18" stroke={C.tr} strokeWidth="0.5" opacity="0.3"/>
      <line x1="28" y1="30" x2="58" y2="30" stroke={C.tr} strokeWidth="0.5" opacity="0.3"/>
      <line x1="28" y1="42" x2="58" y2="42" stroke={C.tr} strokeWidth="0.5" opacity="0.3"/>
      {/* 4×3 window grid */}
      {[[31,8],[40,8],[50,8],[31,20],[40,20],[50,20],[31,32],[40,32],[50,32],[31,44],[40,44],[50,44]].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="7" height="7" rx="1" fill={C.win}/>
      ))}
      {/* Entrance */}
      <rect x="37" y="48" width="12" height="8" rx="1" fill={C.ws}/>
    </svg>
  );
}

export function OwnsHomeIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="60" rx="8" fill={C.bg}/>
      {/* Simple house silhouette */}
      <polygon points="10,38 40,22 70,38" fill={C.rs}/>
      <rect x="16" y="38" width="48" height="18" fill={C.ws}/>
      <rect x="20" y="41" width="10" height="8" rx="1" fill={C.win} opacity="0.7"/>
      <rect x="50" y="41" width="10" height="8" rx="1" fill={C.win} opacity="0.7"/>
      <rect x="33" y="44" width="10" height="12" rx="1" fill={C.bg}/>
      {/* Key */}
      <circle cx="32" cy="30" r="8"   fill="none" stroke={C.pan} strokeWidth="2.5"/>
      <circle cx="32" cy="30" r="3.5" fill="none" stroke={C.pan} strokeWidth="1.8"/>
      <rect x="38.5" y="28.5" width="13"  height="3"   rx="1.5" fill={C.pan}/>
      <rect x="47"   y="31.5" width="3.5" height="4"   rx="1"   fill={C.pan}/>
      <rect x="42"   y="31.5" width="3.5" height="3.5" rx="1"   fill={C.pan}/>
      {/* Check badge */}
      <circle cx="62" cy="14" r="8" fill={C.pan} opacity="0.9"/>
      <polyline points="57.5,14 61,17.5 67,10.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

export function RentsHomeIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="60" rx="8" fill={C.bg}/>
      {/* Document shadow */}
      <rect x="22" y="9" width="38" height="48" rx="4" fill={C.ws}/>
      {/* Document */}
      <rect x="20" y="7" width="38" height="48" rx="4" fill={C.w} stroke={C.tr} strokeWidth="0.8" opacity="0.8"/>
      {/* Folded corner */}
      <polygon points="44,7 58,7 58,21" fill={C.bg}/>
      <polygon points="44,7 44,21 58,21" fill={C.ws}/>
      <line x1="44" y1="7" x2="44" y2="21" stroke={C.tr} strokeWidth="0.5" opacity="0.5"/>
      {/* House icon on doc */}
      <polygon points="28,22 36,15 44,22" fill={C.rs}/>
      <rect x="30" y="22" width="12" height="9" fill={C.ws}/>
      <rect x="33" y="24" width="4" height="7" rx="0.5" fill={C.bg}/>
      {/* Text lines */}
      <rect x="26" y="34" width="20" height="2" rx="1" fill={C.tr} opacity="0.4"/>
      <rect x="26" y="39" width="15" height="2" rx="1" fill={C.tr} opacity="0.4"/>
      <rect x="26" y="44" width="18" height="2" rx="1" fill={C.tr} opacity="0.4"/>
      {/* Signature */}
      <line x1="26" y1="50" x2="50" y2="50" stroke={C.tr} strokeWidth="0.8" opacity="0.4"/>
      <path d="M 27 48 Q 31 45 33 48 Q 35 51 39 47 Q 41 44 43 47" stroke={C.tr} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

// ─────────────────────── Sun Exposure ────────────────────────────────────────

export function FullSunIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pale warm sky */}
      <rect width="80" height="60" rx="8" fill="#fef9ee"/>
      {/* 8 rays — alternating long/short */}
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const r1 = 13, r2 = i % 2 === 0 ? 20 : 16;
        return (
          <line key={deg}
            x1={40 + Math.cos(rad) * r1} y1={22 + Math.sin(rad) * r1}
            x2={40 + Math.cos(rad) * r2} y2={22 + Math.sin(rad) * r2}
            stroke="#c9930a" strokeWidth={i % 2 === 0 ? 2 : 1.5} strokeLinecap="round"
          />
        );
      })}
      {/* Sun disc — muted golden */}
      <circle cx="40" cy="22" r="9.5" fill="#f5c540"/>
      <circle cx="40" cy="22" r="7"   fill="#f7d060"/>
      <ellipse cx="37.5" cy="19.5" rx="2" ry="1.5" fill="white" opacity="0.4"/>
      {/* Roof silhouette */}
      <polygon points="0,60 40,41 80,60" fill={C.rd}/>
      <line x1="0" y1="60" x2="40" y2="41" stroke={C.rs} strokeWidth="0.8"/>
      <line x1="80" y1="60" x2="40" y2="41" stroke={C.rs} strokeWidth="0.8"/>
      {/* Panels */}
      <polygon points="44,49 54,44 57,49 47,54" fill={C.pan}/>
      <polygon points="54,44 64,39 67,44 57,49" fill={C.pan}/>
      <line x1="44" y1="51.5" x2="57" y2="46.5" stroke={C.line} strokeWidth="0.5" opacity="0.6"/>
      <line x1="54" y1="46.5" x2="67" y2="41.5" stroke={C.line} strokeWidth="0.5" opacity="0.6"/>
    </svg>
  );
}

export function PartialShadeIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pale blue-gray sky */}
      <rect width="80" height="60" rx="8" fill="#e8f0f7"/>
      {/* Muted sun — upper left */}
      <circle cx="16" cy="16" r="8"   fill="#f5c540" opacity="0.45"/>
      <circle cx="16" cy="16" r="5.5" fill="#f5c540" opacity="0.85"/>
      <line x1="16" y1="5"  x2="16" y2="8"  stroke="#c9930a" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
      <line x1="5"  y1="16" x2="3"  y2="16" stroke="#c9930a" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
      <line x1="9"  y1="9"  x2="7"  y2="7"  stroke="#c9930a" strokeWidth="1.3" strokeLinecap="round" opacity="0.8"/>
      <line x1="9"  y1="23" x2="7"  y2="25" stroke="#c9930a" strokeWidth="1.3" strokeLinecap="round" opacity="0.8"/>
      {/* Fluffy cloud */}
      <ellipse cx="53" cy="25" rx="26" ry="10" fill="#cfdae5"/>
      <circle cx="33" cy="19" r="10" fill="#eef4f9"/>
      <circle cx="46" cy="13" r="12" fill="white"/>
      <circle cx="61" cy="16" r="10" fill="#eef4f9"/>
      <circle cx="72" cy="22" r="8"  fill="#eef4f9"/>
      <ellipse cx="53" cy="29" rx="24" ry="7"  fill="#eef4f9"/>
      <ellipse cx="53" cy="33" rx="22" ry="4"  fill="#b8c9d8" opacity="0.5"/>
      {/* Roof */}
      <polygon points="0,60 40,42 80,60" fill={C.rd}/>
      <line x1="0" y1="60" x2="40" y2="42" stroke={C.rs} strokeWidth="0.8"/>
      <line x1="80" y1="60" x2="40" y2="42" stroke={C.rs} strokeWidth="0.8"/>
      {/* Panel in sun */}
      <polygon points="44,50 54,45 57,50 47,55" fill={C.pan}/>
      {/* Panel in shade */}
      <polygon points="54,45 64,40 67,45 57,50" fill={C.pan} opacity="0.4"/>
    </svg>
  );
}

export function MostlyShadeIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dark overcast sky */}
      <rect width="80" height="60" rx="8" fill="#b8c8d8"/>
      {/* Heavy cloud layers */}
      <ellipse cx="40" cy="7"  rx="42" ry="11" fill="#9aaab8"/>
      <ellipse cx="18" cy="17" rx="22" ry="13" fill="#a2b2c0"/>
      <ellipse cx="60" cy="15" rx="26" ry="13" fill="#9aaab8"/>
      <circle cx="12" cy="24" r="13" fill="#a8b8c6"/>
      <circle cx="30" cy="20" r="14" fill="#aebcca"/>
      <circle cx="50" cy="21" r="14" fill="#a8b8c6"/>
      <circle cx="68" cy="25" r="12" fill="#a2b2c0"/>
      <ellipse cx="40" cy="31" rx="40" ry="9"  fill="#9aaab8"/>
      <ellipse cx="25" cy="35" rx="20" ry="5"  fill="#8898a8" opacity="0.7"/>
      <ellipse cx="60" cy="36" rx="18" ry="4"  fill="#8898a8" opacity="0.6"/>
      {/* Trees — muted gray-blue */}
      <rect x="2"  y="34" width="6" height="26" rx="1" fill="#6a7e8e"/>
      <circle cx="5"   cy="30" r="13" fill="#768898"/>
      <circle cx="0"   cy="38" r="9"  fill="#6a7e8e"/>
      <circle cx="11"  cy="37" r="8"  fill="#768898"/>
      <rect x="69" y="39" width="5" height="21" rx="1" fill="#6a7e8e"/>
      <circle cx="71"  cy="34" r="11" fill="#768898"/>
      <circle cx="76"  cy="41" r="8"  fill="#6a7e8e"/>
      <circle cx="65"  cy="42" r="7"  fill="#768898"/>
      {/* Roof */}
      <polygon points="0,60 40,44 80,60" fill={C.rd}/>
      <polygon points="0,60 40,44 80,60" fill="#1a2535" opacity="0.4"/>
      {/* Panels — barely visible */}
      <polygon points="44,51 54,46 57,51 47,56" fill="#3d5068" opacity="0.7"/>
      <polygon points="54,46 64,41 67,46 57,51" fill="#3d5068" opacity="0.7"/>
    </svg>
  );
}

// ─────────────────────── Roof Type ───────────────────────────────────────────

export function AsphaltShinglesIllustration() {
  const rows = [
    { y: 43, off: 0 }, { y: 36, off: 4 }, { y: 29, off: 0 },
    { y: 22, off: 4 }, { y: 15, off: 0 }, { y: 8, off: 4 }, { y: 1, off: 0 },
  ];
  const palette = ['#3d4f62', '#4a5f77'];
  return (
    <svg viewBox="0 0 64 50" width="64" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="50" rx="8" fill="#2d3d4f"/>
      {rows.map(({ y, off }, ri) => {
        const h = 50 - y;
        const tabs = [];
        for (let i = -1; i <= 9; i++) {
          const x = i * 8 - off;
          if (x >= 64) break;
          tabs.push(<rect key={i} x={x} y={y} width={8} height={h} fill={palette[(i + ri) % 2]}/>);
        }
        return (
          <React.Fragment key={ri}>
            {tabs}
            <rect x={0} y={y} width={64} height={1} fill="#1a2535"/>
            {[-off + 12, -off + 36, -off + 60].map(cx =>
              cx > 0 && cx < 64 &&
              <line key={cx} x1={cx} y1={y} x2={cx} y2={Math.min(y + 7, 50)} stroke="#1a2535" strokeWidth={0.7}/>
            )}
          </React.Fragment>
        );
      })}
      {/* Solar panels */}
      <rect x="34" y="3" width="13" height="9" rx="1.5" fill={C.pan}/>
      <rect x="49" y="3" width="13" height="9" rx="1.5" fill={C.pan}/>
      <line x1="34" y1="7.5" x2="47" y2="7.5" stroke={C.line} strokeWidth="0.5" opacity="0.6"/>
      <line x1="49" y1="7.5" x2="62" y2="7.5" stroke={C.line} strokeWidth="0.5" opacity="0.6"/>
    </svg>
  );
}

export function MetalRoofIllustration() {
  return (
    <svg viewBox="0 0 64 50" width="64" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mr-panel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#4a5f77"/>
          <stop offset="45%"  stopColor="#7a9bb5"/>
          <stop offset="100%" stopColor="#4a5f77"/>
        </linearGradient>
      </defs>
      <rect width="64" height="50" rx="8" fill="#4a5f77"/>
      {[0, 9, 18, 27, 36, 45, 54].map(x => (
        <rect key={x} x={x} y={0} width={8.5} height={50} fill="url(#mr-panel)"/>
      ))}
      {[8, 17, 26, 35, 44, 53].map(x => (
        <React.Fragment key={x}>
          <rect x={x} y={0} width={2.5} height={50} rx={1.2} fill="#2d3d4f"/>
          <rect x={x + 0.4} y={0} width={0.7} height={50} fill="white" opacity={0.08}/>
        </React.Fragment>
      ))}
      <rect x="0" y="47" width="64" height="3" rx="0" fill="#2d3d4f"/>
    </svg>
  );
}

export function TileRoofIllustration() {
  const tileW = 16;
  const rows = [
    { y: 0,  bottom: 13, off: 0 },
    { y: 13, bottom: 26, off: 8 },
    { y: 26, bottom: 39, off: 0 },
    { y: 39, bottom: 52, off: 8 },
  ];
  return (
    <svg viewBox="0 0 64 50" width="64" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tr-dome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#7a7a72"/>
          <stop offset="55%"  stopColor="#5e5e58"/>
          <stop offset="100%" stopColor="#484844"/>
        </linearGradient>
        <linearGradient id="tr-dome2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#8a8a80"/>
          <stop offset="55%"  stopColor="#6a6a62"/>
          <stop offset="100%" stopColor="#525250"/>
        </linearGradient>
      </defs>
      <rect width="64" height="50" rx="8" fill="#484844"/>
      {rows.map(({ y, bottom, off }, ri) => {
        const arches = [];
        for (let i = -1; i <= 5; i++) {
          const x1 = i * tileW - off;
          const x2 = x1 + tileW;
          const cx = x1 + tileW / 2;
          const peak = y + 1.5;
          const grad = (i + ri) % 2 === 0 ? 'url(#tr-dome)' : 'url(#tr-dome2)';
          arches.push(
            <path key={`a${i}`}
              d={`M ${x1},${bottom} Q ${cx},${peak} ${x2},${bottom} L ${x2},${y} L ${x1},${y} Z`}
              fill={grad}
            />
          );
          arches.push(
            <line key={`s${i}`} x1={x2} y1={y} x2={x2} y2={bottom} stroke="#383836" strokeWidth="0.6" opacity="0.5"/>
          );
        }
        return (
          <React.Fragment key={ri}>
            {arches}
            <rect x={0} y={bottom - 2.5} width={64} height={3} fill="#2e2e2c"/>
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
          <stop offset="0%" stopColor="#8a9eb0"/>
          <stop offset="100%" stopColor="#6a8090"/>
        </linearGradient>
      </defs>
      <rect width="64" height="50" rx="8" fill="url(#fl-mem)"/>
      {/* Seam grid */}
      <line x1="0"  y1="17" x2="64" y2="17" stroke="#5a7080" strokeWidth="1"/>
      <line x1="0"  y1="34" x2="64" y2="34" stroke="#5a7080" strokeWidth="1"/>
      <line x1="16" y1="0"  x2="16" y2="50" stroke="#5a7080" strokeWidth="0.8"/>
      <line x1="32" y1="0"  x2="32" y2="50" stroke="#5a7080" strokeWidth="0.8"/>
      <line x1="48" y1="0"  x2="48" y2="50" stroke="#5a7080" strokeWidth="0.8"/>
      {/* Tilted solar panels */}
      <polygon points="4,44 22,31 22,37 4,50"  fill={C.pan}/>
      <polygon points="26,44 44,31 44,37 26,50" fill={C.pan}/>
      <line x1="4"  y1="44" x2="22" y2="31" stroke={C.line} strokeWidth="0.6" opacity="0.6"/>
      <line x1="26" y1="44" x2="44" y2="31" stroke={C.line} strokeWidth="0.6" opacity="0.6"/>
      {/* Parapet walls */}
      <rect x="0"  y="0"  width="64" height="4"  rx="8" fill="#4a5f77"/>
      <rect x="0"  y="0"  width="3"  height="50" rx="1" fill="#4a5f77"/>
      <rect x="61" y="0"  width="3"  height="50" rx="1" fill="#4a5f77"/>
    </svg>
  );
}

// ─────────────────────── Battery ─────────────────────────────────────────────

export function NoBatteryIllustration() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill={C.bg}/>
      {/* House */}
      <polygon points="3,30 20,18 37,30" fill={C.rd}/>
      <rect x="5" y="30" width="30" height="16" fill={C.w}/>
      <rect x="14" y="35" width="7"  height="11" rx="1" fill={C.ws}/>
      <rect x="22" y="32" width="8"  height="7"  rx="1" fill={C.win}/>
      {/* Utility pole */}
      <rect x="36" y="6"  width="3"  height="30" fill={C.tr}/>
      <rect x="31" y="9"  width="13" height="1.8" rx="0.9" fill={C.tr}/>
      <rect x="33" y="14" width="9"  height="1.4" rx="0.7" fill={C.tr}/>
      {/* Power lines */}
      <path d="M 31.5 10.8 Q 22 16 14 20" stroke={C.tr} strokeWidth="0.8" fill="none"/>
      <path d="M 33 15.4 Q 24 19 18 22"   stroke={C.tr} strokeWidth="0.7" fill="none"/>
      <path d="M 14 20 Q 10 24 7 28"      stroke={C.tr} strokeWidth="0.8" fill="none"/>
      {/* Meter */}
      <rect x="4" y="27" width="4" height="5" rx="1" fill={C.tr} opacity="0.7"/>
    </svg>
  );
}

export function OneBatteryIllustration() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill={C.bg}/>
      {/* House */}
      <polygon points="3,30 20,18 37,30" fill={C.rd}/>
      <rect x="5" y="30" width="30" height="16" fill={C.w}/>
      {/* Roof panel */}
      <polygon points="20,21 28,18 29,21 21,24" fill={C.pan} opacity="0.9"/>
      <rect x="13" y="34" width="7"  height="12" rx="1" fill={C.ws}/>
      <rect x="22" y="31" width="8"  height="7"  rx="1" fill={C.win}/>
      {/* Battery housing */}
      <rect x="36" y="17" width="10" height="22" rx="2.5" fill={C.rs}/>
      <rect x="37" y="18" width="8"  height="20" rx="2"   fill={C.pan}/>
      <rect x="37" y="18" width="8"  height="2.5" rx="2"  fill={C.rs}/>
      {/* Charge bars */}
      <rect x="38" y="23" width="6" height="2"   rx="0.5" fill={C.win} opacity="0.8"/>
      <rect x="38" y="27" width="6" height="2"   rx="0.5" fill={C.win} opacity="0.8"/>
      <rect x="38" y="31" width="6" height="2"   rx="0.5" fill={C.win} opacity="0.45"/>
      {/* Terminal nub */}
      <rect x="39" y="15" width="4" height="2" rx="0.8" fill={C.rs}/>
      {/* Connection line */}
      <line x1="36" y1="28" x2="35" y2="28" stroke={C.line} strokeWidth="1.5"/>
    </svg>
  );
}

export function TwoBatteriesIllustration() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill={C.bg}/>
      {/* House */}
      <polygon points="2,29 17,19 32,29" fill={C.rd}/>
      <rect x="4" y="29" width="26" height="17" fill={C.w}/>
      {/* Roof panel */}
      <polygon points="17,23 24,20 25,23 18,26" fill={C.pan} opacity="0.9"/>
      <rect x="10" y="33" width="6"  height="13" rx="1" fill={C.ws}/>
      <rect x="18" y="31" width="8"  height="7"  rx="1" fill={C.win}/>
      {/* Battery 1 (upper) */}
      <rect x="34" y="14" width="11" height="15" rx="2.5" fill={C.rs}/>
      <rect x="35" y="15" width="9"  height="13" rx="2"   fill={C.pan}/>
      <rect x="35" y="15" width="9"  height="2.5" rx="2"  fill={C.rs}/>
      <rect x="36" y="19" width="7"  height="1.8" rx="0.5" fill={C.win} opacity="0.8"/>
      <rect x="36" y="23" width="7"  height="1.8" rx="0.5" fill={C.win} opacity="0.55"/>
      <rect x="36.5" y="12" width="4" height="2" rx="0.8" fill={C.rs}/>
      {/* Battery 2 (lower) */}
      <rect x="34" y="31" width="11" height="13" rx="2.5" fill={C.rs}/>
      <rect x="35" y="32" width="9"  height="11" rx="2"   fill={C.pan}/>
      <rect x="35" y="32" width="9"  height="2.5" rx="2"  fill={C.rs}/>
      <rect x="36" y="36" width="7"  height="1.8" rx="0.5" fill={C.win} opacity="0.8"/>
      <rect x="36" y="40" width="7"  height="1.5" rx="0.5" fill={C.win} opacity="0.5"/>
      {/* Bus bar connecting batteries */}
      <line x1="33" y1="22" x2="34" y2="22" stroke={C.line} strokeWidth="1.4"/>
      <line x1="33" y1="37" x2="34" y2="37" stroke={C.line} strokeWidth="1.4"/>
      <line x1="33" y1="22" x2="33" y2="37" stroke={C.line} strokeWidth="1.2"/>
      <line x1="30" y1="30" x2="33" y2="30" stroke={C.line} strokeWidth="1.2"/>
    </svg>
  );
}
