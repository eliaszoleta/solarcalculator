import React from 'react';

// ─────────────────────── StepHome Illustrations ───────────────────────────────

export function HouseIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sky */}
      <rect width="80" height="60" rx="10" fill="#dbeafe"/>
      {/* Ground */}
      <rect y="48" width="80" height="12" fill="#86efac"/>
      <rect y="48" width="80" height="4" fill="#4ade80"/>
      {/* House walls */}
      <rect x="13" y="33" width="54" height="19" fill="#f8fafc"/>
      {/* Wall shadow line */}
      <rect x="13" y="33" width="54" height="1.5" fill="#e2e8f0"/>
      {/* Roof */}
      <polygon points="7,33 40,11 73,33" fill="#1e293b"/>
      {/* Roof ridge highlight */}
      <line x1="7" y1="33" x2="73" y2="33" stroke="#0f172a" strokeWidth="1"/>
      {/* Solar panels on right roof slope — parallelograms matching slope */}
      <polygon points="49,15 55,20 59,26 53,21" fill="#1d4ed8"/>
      <polygon points="57,21 63,25 67,32 61,27" fill="#1d4ed8"/>
      {/* Panel cell lines */}
      <line x1="52" y1="18" x2="56" y2="24" stroke="white" strokeWidth="0.5" opacity="0.5"/>
      <line x1="60" y1="23" x2="64" y2="29" stroke="white" strokeWidth="0.5" opacity="0.5"/>
      <line x1="49" y1="20" x2="59" y2="20" stroke="white" strokeWidth="0.4" opacity="0.3"/>
      <line x1="57" y1="25" x2="67" y2="25" stroke="white" strokeWidth="0.4" opacity="0.3"/>
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
      {/* Sun in sky */}
      <circle cx="15" cy="13" r="6" fill="#fde68a"/>
      <line x1="15" y1="4.5" x2="15" y2="6.5" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15" y1="19.5" x2="15" y2="21.5" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="6.5" y1="13" x2="8.5" y2="13" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="21.5" y1="13" x2="23.5" y2="13" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9.4" y1="7.4" x2="10.8" y2="8.8" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="19.2" y1="17.2" x2="20.6" y2="18.6" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Cloud accent */}
      <ellipse cx="60" cy="8" rx="9" ry="5" fill="white" opacity="0.8"/>
      <ellipse cx="53" cy="10" rx="6" ry="4" fill="white" opacity="0.8"/>
      <ellipse cx="67" cy="10" rx="5" ry="3.5" fill="white" opacity="0.8"/>
    </svg>
  );
}

export function CondoIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sky */}
      <rect width="80" height="60" rx="10" fill="#eef2ff"/>
      {/* Ground */}
      <rect y="50" width="80" height="10" fill="#c7d2fe"/>
      {/* Building body */}
      <rect x="18" y="8" width="44" height="44" fill="white"/>
      {/* Building right side (isometric) */}
      <polygon points="62,8 68,4 68,46 62,50" fill="#e0e7ff"/>
      {/* Building top */}
      <polygon points="18,8 24,4 68,4 62,8" fill="#c7d2fe"/>
      {/* Floor lines */}
      <line x1="18" y1="19" x2="62" y2="19" stroke="#e0e7ff" strokeWidth="0.8"/>
      <line x1="18" y1="30" x2="62" y2="30" stroke="#e0e7ff" strokeWidth="0.8"/>
      <line x1="18" y1="41" x2="62" y2="41" stroke="#e0e7ff" strokeWidth="0.8"/>
      {/* Windows - floor 3 (top) */}
      <rect x="22" y="11" width="8" height="6" rx="1.5" fill="#bfdbfe"/>
      <rect x="33" y="11" width="8" height="6" rx="1.5" fill="#bfdbfe"/>
      <rect x="44" y="11" width="8" height="6" rx="1.5" fill="#bfdbfe"/>
      <rect x="55" y="11" width="5" height="6" rx="1" fill="#bfdbfe" opacity="0.6"/>
      {/* Windows - floor 2 */}
      <rect x="22" y="22" width="8" height="6" rx="1.5" fill="#bfdbfe"/>
      <rect x="33" y="22" width="8" height="6" rx="1.5" fill="#93c5fd"/>
      <rect x="44" y="22" width="8" height="6" rx="1.5" fill="#bfdbfe"/>
      <rect x="55" y="22" width="5" height="6" rx="1" fill="#bfdbfe" opacity="0.6"/>
      {/* Windows - floor 1 */}
      <rect x="22" y="33" width="8" height="6" rx="1.5" fill="#bfdbfe"/>
      <rect x="33" y="33" width="8" height="6" rx="1.5" fill="#bfdbfe"/>
      <rect x="44" y="33" width="8" height="6" rx="1.5" fill="#93c5fd"/>
      <rect x="55" y="33" width="5" height="6" rx="1" fill="#bfdbfe" opacity="0.6"/>
      {/* Entrance */}
      <rect x="29" y="41" width="22" height="11" rx="1.5" fill="#a5b4fc"/>
      <line x1="40" y1="41" x2="40" y2="52" stroke="#818cf8" strokeWidth="0.8"/>
      {/* Rooftop solar panels */}
      <rect x="25" y="4.5" width="12" height="6" rx="1" fill="#1d4ed8" opacity="0.85" transform="skewX(-40) translate(10,0)"/>
      <rect x="38" y="4.5" width="12" height="6" rx="1" fill="#1d4ed8" opacity="0.85" transform="skewX(-40) translate(10,0)"/>
    </svg>
  );
}

export function ApartmentIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sky */}
      <rect width="80" height="60" rx="10" fill="#f5f3ff"/>
      {/* Ground */}
      <rect y="52" width="80" height="8" fill="#ddd6fe"/>
      {/* Smaller adjacent building */}
      <rect x="6" y="26" width="20" height="27" fill="#f3f4f6"/>
      <polygon points="6,26 10,22 26,22 22,26" fill="#e5e7eb"/>
      <rect x="9" y="28" width="5" height="4" rx="1" fill="#c4b5fd" opacity="0.7"/>
      <rect x="17" y="28" width="5" height="4" rx="1" fill="#c4b5fd" opacity="0.7"/>
      <rect x="9" y="35" width="5" height="4" rx="1" fill="#c4b5fd" opacity="0.7"/>
      <rect x="17" y="35" width="5" height="4" rx="1" fill="#c4b5fd" opacity="0.7"/>
      <rect x="9" y="42" width="5" height="4" rx="1" fill="#c4b5fd" opacity="0.7"/>
      <rect x="17" y="42" width="5" height="4" rx="1" fill="#c4b5fd" opacity="0.7"/>
      {/* Main tower */}
      <rect x="28" y="4" width="34" height="49" fill="white"/>
      {/* Tower right side */}
      <polygon points="62,4 68,1 68,48 62,51" fill="#ede9fe"/>
      {/* Tower top */}
      <polygon points="28,4 34,1 68,1 62,4" fill="#d8b4fe"/>
      {/* Floor lines */}
      <line x1="28" y1="14" x2="62" y2="14" stroke="#ede9fe" strokeWidth="0.8"/>
      <line x1="28" y1="24" x2="62" y2="24" stroke="#ede9fe" strokeWidth="0.8"/>
      <line x1="28" y1="34" x2="62" y2="34" stroke="#ede9fe" strokeWidth="0.8"/>
      <line x1="28" y1="44" x2="62" y2="44" stroke="#ede9fe" strokeWidth="0.8"/>
      {/* Windows - 4 rows × 3 cols */}
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
      {/* Background */}
      <rect width="80" height="60" rx="10" fill="#ecfdf5"/>
      {/* House silhouette */}
      <rect x="14" y="30" width="52" height="24" fill="#d1fae5"/>
      <polygon points="8,30 40,12 72,30" fill="#6ee7b7"/>
      {/* Key */}
      <circle cx="40" cy="23" r="10" fill="none" stroke="#059669" strokeWidth="3"/>
      <circle cx="40" cy="23" r="5" fill="none" stroke="#059669" strokeWidth="2.5"/>
      <rect x="47" y="21" width="14" height="4" rx="2" fill="#059669"/>
      <rect x="55" y="25" width="4" height="5" rx="1.5" fill="#059669"/>
      <rect x="49" y="25" width="4" height="4" rx="1.5" fill="#059669"/>
      {/* Checkmark badge */}
      <circle cx="60" cy="12" r="8" fill="#059669"/>
      <polyline points="55.5,12 58.5,15 64.5,9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

export function RentsHomeIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="80" height="60" rx="10" fill="#f8fafc"/>
      {/* Document */}
      <rect x="22" y="8" width="36" height="46" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
      {/* Document fold corner */}
      <polygon points="46,8 58,8 58,20" fill="#f1f5f9"/>
      <polygon points="46,8 46,20 58,20" fill="#e2e8f0"/>
      {/* Text lines */}
      <rect x="27" y="24" width="26" height="2.5" rx="1.25" fill="#cbd5e1"/>
      <rect x="27" y="30" width="22" height="2.5" rx="1.25" fill="#cbd5e1"/>
      <rect x="27" y="36" width="24" height="2.5" rx="1.25" fill="#cbd5e1"/>
      {/* Signature line */}
      <line x1="27" y1="44" x2="50" y2="44" stroke="#94a3b8" strokeWidth="1"/>
      {/* Pen */}
      <rect x="44" y="40" width="3" height="10" rx="1.5" fill="#64748b" transform="rotate(-30 44 40)"/>
      <polygon points="44,50 47,50 45.5,53" fill="#475569" transform="rotate(-30 44 40)"/>
      {/* House icon small */}
      <polygon points="27,14 33,9 39,14" fill="#94a3b8"/>
      <rect x="29" y="14" width="8" height="7" fill="#e2e8f0"/>
      <rect x="31.5" y="16" width="2.5" height="5" rx="0.5" fill="#94a3b8"/>
    </svg>
  );
}

// ─────────────────────── StepRoof Sun Illustrations ──────────────────────────

export function FullSunIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Clear warm sky */}
      <rect width="80" height="60" rx="10" fill="#fffbeb"/>
      {/* Sun glow halo */}
      <circle cx="40" cy="20" r="18" fill="#fde68a" opacity="0.45"/>
      {/* Sun body */}
      <circle cx="40" cy="20" r="11" fill="#f59e0b"/>
      <circle cx="40" cy="20" r="8" fill="#fbbf24"/>
      {/* Sun rays */}
      <line x1="40" y1="3" x2="40" y2="7" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      <line x1="40" y1="33" x2="40" y2="37" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      <line x1="23" y1="20" x2="27" y2="20" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      <line x1="53" y1="20" x2="57" y2="20" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      <line x1="28" y1="8" x2="31" y2="11" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      <line x1="49" y1="29" x2="52" y2="32" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      <line x1="52" y1="8" x2="49" y2="11" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      <line x1="28" y1="32" x2="31" y2="29" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
      {/* Roof silhouette */}
      <polygon points="0,60 40,40 80,60" fill="#1e293b"/>
      {/* Solar panels on slope */}
      <polygon points="42,46 52,41 54,46 44,51" fill="#1e40af"/>
      <polygon points="52,42 62,37 64,42 54,47" fill="#1e40af"/>
      {/* Panel shine (sunlight glare) */}
      <polygon points="43,46 45,45 46,47 44,48" fill="white" opacity="0.3"/>
      <polygon points="53,42 55,41 56,43 54,44" fill="white" opacity="0.3"/>
      {/* Panel grid */}
      <line x1="48" y1="43" x2="49" y2="48" stroke="white" strokeWidth="0.5" opacity="0.4"/>
      <line x1="58" y1="39" x2="59" y2="44" stroke="white" strokeWidth="0.5" opacity="0.4"/>
    </svg>
  );
}

export function PartialShadeIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Partly cloudy sky */}
      <rect width="80" height="60" rx="10" fill="#fff7ed"/>
      {/* Sun (partially behind cloud) */}
      <circle cx="28" cy="17" r="8" fill="#fb923c" opacity="0.85"/>
      <circle cx="28" cy="17" r="5.5" fill="#f97316" opacity="0.9"/>
      {/* Sun rays (visible portion) */}
      <line x1="28" y1="6" x2="28" y2="8" stroke="#fb923c" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="18" y1="17" x2="20" y2="17" stroke="#fb923c" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="21" y1="10" x2="23" y2="12" stroke="#fb923c" strokeWidth="1.8" strokeLinecap="round"/>
      {/* Large cloud covering sun partially */}
      <ellipse cx="48" cy="16" rx="18" ry="10" fill="white"/>
      <ellipse cx="38" cy="18" rx="13" ry="8" fill="white"/>
      <ellipse cx="60" cy="19" rx="12" ry="7" fill="#f8fafc"/>
      <ellipse cx="45" cy="22" rx="16" ry="7" fill="white"/>
      {/* Tree silhouette left */}
      <rect x="5" y="36" width="4" height="18" fill="#475569"/>
      <ellipse cx="7" cy="34" rx="7" ry="10" fill="#334155"/>
      <ellipse cx="4" cy="38" rx="5" ry="8" fill="#1e293b"/>
      {/* Roof */}
      <polygon points="0,60 40,42 80,60" fill="#334155"/>
      {/* Panels in partial shade */}
      <polygon points="42,49 52,44 54,49 44,54" fill="#2563eb" opacity="0.75"/>
      <polygon points="52,44 62,39 64,44 54,49" fill="#2563eb" opacity="0.55"/>
      {/* Dappled light */}
      <ellipse cx="58" cy="47" rx="4" ry="2.5" fill="#fde68a" opacity="0.15"/>
    </svg>
  );
}

export function MostlyShadeIllustration() {
  return (
    <svg viewBox="0 0 80 60" width="80" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Overcast sky */}
      <rect width="80" height="60" rx="10" fill="#f1f5f9"/>
      {/* Heavy clouds */}
      <ellipse cx="20" cy="14" rx="18" ry="10" fill="#cbd5e1"/>
      <ellipse cx="38" cy="11" rx="22" ry="12" fill="#e2e8f0"/>
      <ellipse cx="62" cy="16" rx="20" ry="10" fill="#cbd5e1"/>
      <ellipse cx="10" cy="20" rx="12" ry="8" fill="#e2e8f0"/>
      <ellipse cx="50" cy="20" rx="22" ry="10" fill="#e2e8f0"/>
      <ellipse cx="72" cy="22" rx="12" ry="7" fill="#cbd5e1"/>
      {/* Dim sun hint */}
      <circle cx="40" cy="13" r="5" fill="#fde68a" opacity="0.2"/>
      {/* Tree left — large */}
      <rect x="3" y="32" width="5" height="24" fill="#374151"/>
      <ellipse cx="5.5" cy="30" rx="10" ry="14" fill="#1e293b"/>
      <ellipse cx="2" cy="35" rx="7" ry="10" fill="#111827"/>
      {/* Tree right */}
      <rect x="68" y="38" width="4" height="18" fill="#374151"/>
      <ellipse cx="70" cy="35" rx="9" ry="12" fill="#1e293b"/>
      {/* Roof in heavy shade */}
      <polygon points="0,60 40,44 80,60" fill="#334155"/>
      {/* Panels barely visible */}
      <polygon points="42,50 52,45 54,50 44,55" fill="#475569"/>
      <polygon points="52,45 62,40 64,45 54,50" fill="#475569"/>
      {/* Shade overlay on panels */}
      <polygon points="42,50 52,45 54,50 44,55" fill="#1e293b" opacity="0.3"/>
    </svg>
  );
}

// ─────────────────────── StepRoof Type Illustrations ─────────────────────────

export function AsphaltShinglesIllustration() {
  return (
    <svg viewBox="0 0 64 50" width="64" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="64" height="50" rx="8" fill="#374151"/>
      {/* Shingle rows — staggered rectangles */}
      {/* Row 1 */}
      <rect x="0" y="2" width="20" height="9" rx="1" fill="#4b5563"/>
      <rect x="21" y="2" width="20" height="9" rx="1" fill="#6b7280"/>
      <rect x="42" y="2" width="22" height="9" rx="1" fill="#4b5563"/>
      {/* Row 2 — offset */}
      <rect x="-8" y="11" width="20" height="9" rx="1" fill="#6b7280"/>
      <rect x="13" y="11" width="20" height="9" rx="1" fill="#4b5563"/>
      <rect x="34" y="11" width="20" height="9" rx="1" fill="#6b7280"/>
      <rect x="55" y="11" width="14" height="9" rx="1" fill="#4b5563"/>
      {/* Row 3 */}
      <rect x="0" y="20" width="20" height="9" rx="1" fill="#4b5563"/>
      <rect x="21" y="20" width="20" height="9" rx="1" fill="#6b7280"/>
      <rect x="42" y="20" width="22" height="9" rx="1" fill="#4b5563"/>
      {/* Row 4 — offset */}
      <rect x="-8" y="29" width="20" height="9" rx="1" fill="#6b7280"/>
      <rect x="13" y="29" width="20" height="9" rx="1" fill="#4b5563"/>
      <rect x="34" y="29" width="20" height="9" rx="1" fill="#6b7280"/>
      <rect x="55" y="29" width="14" height="9" rx="1" fill="#4b5563"/>
      {/* Row 5 */}
      <rect x="0" y="38" width="20" height="12" rx="1" fill="#4b5563"/>
      <rect x="21" y="38" width="20" height="12" rx="1" fill="#6b7280"/>
      <rect x="42" y="38" width="22" height="12" rx="1" fill="#4b5563"/>
      {/* Solar panel overlay */}
      <rect x="32" y="4" width="14" height="10" rx="1.5" fill="#1d4ed8" opacity="0.9"/>
      <rect x="47" y="4" width="14" height="10" rx="1.5" fill="#1d4ed8" opacity="0.9"/>
      <line x1="39" y1="4" x2="39" y2="14" stroke="white" strokeWidth="0.6" opacity="0.4"/>
      <line x1="54" y1="4" x2="54" y2="14" stroke="white" strokeWidth="0.6" opacity="0.4"/>
      <line x1="32" y1="9" x2="46" y2="9" stroke="white" strokeWidth="0.6" opacity="0.4"/>
      <line x1="47" y1="9" x2="61" y2="9" stroke="white" strokeWidth="0.6" opacity="0.4"/>
    </svg>
  );
}

export function MetalRoofIllustration() {
  return (
    <svg viewBox="0 0 64 50" width="64" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base metal color */}
      <rect width="64" height="50" rx="8" fill="#64748b"/>
      {/* Metallic gradient bands */}
      <rect x="0" y="0" width="8" height="50" fill="#94a3b8"/>
      <rect x="8" y="0" width="4" height="50" fill="#475569"/>
      <rect x="16" y="0" width="8" height="50" fill="#94a3b8"/>
      <rect x="24" y="0" width="4" height="50" fill="#475569"/>
      <rect x="32" y="0" width="8" height="50" fill="#94a3b8"/>
      <rect x="40" y="0" width="4" height="50" fill="#475569"/>
      <rect x="48" y="0" width="8" height="50" fill="#94a3b8"/>
      <rect x="56" y="0" width="8" height="50" fill="#94a3b8"/>
      {/* Standing seam ridge caps */}
      <rect x="7" y="0" width="2.5" height="50" rx="1" fill="#1e293b"/>
      <rect x="15" y="0" width="2.5" height="50" rx="1" fill="#1e293b"/>
      <rect x="23" y="0" width="2.5" height="50" rx="1" fill="#1e293b"/>
      <rect x="31" y="0" width="2.5" height="50" rx="1" fill="#1e293b"/>
      <rect x="39" y="0" width="2.5" height="50" rx="1" fill="#1e293b"/>
      <rect x="47" y="0" width="2.5" height="50" rx="1" fill="#1e293b"/>
      <rect x="55" y="0" width="2.5" height="50" rx="1" fill="#1e293b"/>
      {/* Highlight sheen line */}
      <rect x="0.5" y="0" width="1" height="50" fill="white" opacity="0.15"/>
      <rect x="8.5" y="0" width="1" height="50" fill="white" opacity="0.1"/>
      <rect x="16.5" y="0" width="1" height="50" fill="white" opacity="0.15"/>
      <rect x="24.5" y="0" width="1" height="50" fill="white" opacity="0.1"/>
      <rect x="32.5" y="0" width="1" height="50" fill="white" opacity="0.15"/>
      <rect x="40.5" y="0" width="1" height="50" fill="white" opacity="0.1"/>
      <rect x="48.5" y="0" width="1" height="50" fill="white" opacity="0.15"/>
      {/* Clip to rounded corners */}
    </svg>
  );
}

export function TileRoofIllustration() {
  return (
    <svg viewBox="0 0 64 50" width="64" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="64" height="50" rx="8" fill="#b45309"/>
      {/* Tile row 1 */}
      <ellipse cx="8" cy="6" rx="8" ry="7" fill="#d97706"/>
      <ellipse cx="24" cy="6" rx="8" ry="7" fill="#b45309"/>
      <ellipse cx="40" cy="6" rx="8" ry="7" fill="#d97706"/>
      <ellipse cx="56" cy="6" rx="8" ry="7" fill="#b45309"/>
      <rect x="0" y="9" width="64" height="3" fill="#92400e"/>
      {/* Tile row 2 — offset */}
      <ellipse cx="0" cy="17" rx="8" ry="7" fill="#b45309"/>
      <ellipse cx="16" cy="17" rx="8" ry="7" fill="#d97706"/>
      <ellipse cx="32" cy="17" rx="8" ry="7" fill="#b45309"/>
      <ellipse cx="48" cy="17" rx="8" ry="7" fill="#d97706"/>
      <ellipse cx="64" cy="17" rx="8" ry="7" fill="#b45309"/>
      <rect x="0" y="20" width="64" height="3" fill="#92400e"/>
      {/* Tile row 3 */}
      <ellipse cx="8" cy="28" rx="8" ry="7" fill="#d97706"/>
      <ellipse cx="24" cy="28" rx="8" ry="7" fill="#b45309"/>
      <ellipse cx="40" cy="28" rx="8" ry="7" fill="#d97706"/>
      <ellipse cx="56" cy="28" rx="8" ry="7" fill="#b45309"/>
      <rect x="0" y="31" width="64" height="3" fill="#92400e"/>
      {/* Tile row 4 — offset */}
      <ellipse cx="0" cy="39" rx="8" ry="7" fill="#b45309"/>
      <ellipse cx="16" cy="39" rx="8" ry="7" fill="#d97706"/>
      <ellipse cx="32" cy="39" rx="8" ry="7" fill="#b45309"/>
      <ellipse cx="48" cy="39" rx="8" ry="7" fill="#d97706"/>
      <ellipse cx="64" cy="39" rx="8" ry="7" fill="#b45309"/>
      <rect x="0" y="42" width="64" height="3" fill="#92400e"/>
      {/* Row 5 */}
      <ellipse cx="8" cy="48" rx="8" ry="7" fill="#d97706"/>
      <ellipse cx="24" cy="48" rx="8" ry="7" fill="#b45309"/>
      <ellipse cx="40" cy="48" rx="8" ry="7" fill="#d97706"/>
      <ellipse cx="56" cy="48" rx="8" ry="7" fill="#b45309"/>
      {/* Clip to rounded rect */}
      <rect width="64" height="50" rx="8" fill="none" stroke="#92400e" strokeWidth="0"/>
    </svg>
  );
}

export function FlatRoofIllustration() {
  return (
    <svg viewBox="0 0 64 50" width="64" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Flat membrane background */}
      <rect width="64" height="50" rx="8" fill="#9ca3af"/>
      {/* TPO membrane seam lines */}
      <line x1="0" y1="16" x2="64" y2="16" stroke="#6b7280" strokeWidth="1.2"/>
      <line x1="0" y1="32" x2="64" y2="32" stroke="#6b7280" strokeWidth="1.2"/>
      <line x1="16" y1="0" x2="16" y2="50" stroke="#6b7280" strokeWidth="0.8"/>
      <line x1="32" y1="0" x2="32" y2="50" stroke="#6b7280" strokeWidth="0.8"/>
      <line x1="48" y1="0" x2="48" y2="50" stroke="#6b7280" strokeWidth="0.8"/>
      {/* Solar panels on tilt mounts (trapezoid shape showing tilt) */}
      <polygon points="6,40 26,28 26,34 6,46" fill="#1d4ed8" opacity="0.92"/>
      <polygon points="28,40 48,28 48,34 28,46" fill="#1d4ed8" opacity="0.92"/>
      {/* Tilt mount legs */}
      <line x1="6" y1="46" x2="6" y2="50" stroke="#4b5563" strokeWidth="1.5"/>
      <line x1="26" y1="34" x2="26" y2="38" stroke="#4b5563" strokeWidth="1.5"/>
      <line x1="28" y1="46" x2="28" y2="50" stroke="#4b5563" strokeWidth="1.5"/>
      <line x1="48" y1="34" x2="48" y2="38" stroke="#4b5563" strokeWidth="1.5"/>
      {/* Panel dividers */}
      <line x1="11" y1="37" x2="26" y2="29" stroke="white" strokeWidth="0.5" opacity="0.4"/>
      <line x1="16" y1="43" x2="26" y2="38" stroke="white" strokeWidth="0.5" opacity="0.4"/>
      <line x1="33" y1="37" x2="48" y2="29" stroke="white" strokeWidth="0.5" opacity="0.4"/>
      <line x1="38" y1="43" x2="48" y2="38" stroke="white" strokeWidth="0.5" opacity="0.4"/>
      {/* Panel glare */}
      <polygon points="6,40 10,37 11,39 7,42" fill="white" opacity="0.2"/>
      <polygon points="28,40 32,37 33,39 29,42" fill="white" opacity="0.2"/>
      {/* Edge parapet */}
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
      {/* Background */}
      <rect width="48" height="48" rx="10" fill="#f1f5f9"/>
      {/* Utility pole */}
      <rect x="33" y="6" width="3" height="30" fill="#94a3b8"/>
      <rect x="29" y="10" width="11" height="2" rx="1" fill="#64748b"/>
      {/* Power lines */}
      <path d="M 29 11 Q 20 15 14 18" stroke="#94a3b8" strokeWidth="1" fill="none"/>
      <path d="M 40 11 Q 42 20 42 30" stroke="#94a3b8" strokeWidth="1" fill="none"/>
      {/* Insulators */}
      <circle cx="29" cy="11" r="1.5" fill="#64748b"/>
      <circle cx="40" cy="11" r="1.5" fill="#64748b"/>
      {/* House */}
      <polygon points="5,30 19,20 33,30" fill="#334155"/>
      <rect x="7" y="30" width="26" height="14" fill="#e2e8f0"/>
      {/* Door */}
      <rect x="14" y="35" width="7" height="9" rx="1" fill="#94a3b8"/>
      {/* Window */}
      <rect x="22" y="33" width="7" height="6" rx="1" fill="#bae6fd"/>
      {/* Power meter/connection box */}
      <rect x="5" y="28" width="4" height="6" rx="1" fill="#64748b"/>
      <rect x="6" y="29" width="2" height="4" rx="0.5" fill="#94a3b8"/>
      {/* Connection wire */}
      <path d="M 9 31 Q 12 22 14 21" stroke="#94a3b8" strokeWidth="1" fill="none"/>
    </svg>
  );
}

export function OneBatteryIllustration() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="48" height="48" rx="10" fill="#ecfdf5"/>
      {/* House */}
      <polygon points="4,28 20,16 36,28" fill="#1e293b"/>
      <rect x="6" y="28" width="28" height="16" fill="#f0fdf4"/>
      {/* Roof solar panels */}
      <polygon points="20,20 28,17 29,20 21,23" fill="#1d4ed8" opacity="0.9"/>
      {/* Door */}
      <rect x="14" y="33" width="6" height="11" rx="1" fill="#86efac"/>
      {/* Window */}
      <rect x="22" y="30" width="8" height="7" rx="1" fill="#bbf7d0"/>
      {/* Battery pack (Powerwall style) */}
      <rect x="36" y="22" width="9" height="18" rx="3" fill="#059669"/>
      <rect x="37" y="23" width="7" height="16" rx="2" fill="#10b981"/>
      {/* Battery level indicator */}
      <rect x="38.5" y="25" width="4" height="2.5" rx="0.5" fill="#34d399"/>
      <rect x="38.5" y="29" width="4" height="2.5" rx="0.5" fill="#34d399"/>
      <rect x="38.5" y="33" width="4" height="2.5" rx="0.5" fill="#6ee7b7" opacity="0.5"/>
      {/* Battery terminal nub */}
      <rect x="38.5" y="20.5" width="4" height="2" rx="0.5" fill="#047857"/>
      {/* Connection wire */}
      <path d="M 34 30 L 36 30" stroke="#059669" strokeWidth="1.5"/>
      {/* Energy flow dots */}
      <circle cx="32" cy="30" r="1.5" fill="#34d399" opacity="0.8"/>
      <circle cx="29" cy="30" r="1.2" fill="#34d399" opacity="0.5"/>
    </svg>
  );
}

export function TwoBatteriesIllustration() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="48" height="48" rx="10" fill="#fffbeb"/>
      {/* House */}
      <polygon points="3,28 18,17 33,28" fill="#1e293b"/>
      <rect x="5" y="28" width="26" height="16" fill="#fefce8"/>
      {/* Solar panels on roof */}
      <polygon points="18,21 25,18 26,21 19,24" fill="#1d4ed8" opacity="0.9"/>
      {/* Door */}
      <rect x="12" y="33" width="5" height="11" rx="1" fill="#fde68a"/>
      {/* Window */}
      <rect x="19" y="30" width="7" height="7" rx="1" fill="#fef9c3"/>
      {/* Battery pack 1 */}
      <rect x="33" y="18" width="8" height="15" rx="2.5" fill="#d97706"/>
      <rect x="34" y="19" width="6" height="13" rx="1.5" fill="#f59e0b"/>
      <rect x="35.5" y="21" width="3" height="2" rx="0.5" fill="#fbbf24"/>
      <rect x="35.5" y="24.5" width="3" height="2" rx="0.5" fill="#fbbf24"/>
      <rect x="35.5" y="28" width="3" height="2" rx="0.5" fill="#fde68a" opacity="0.6"/>
      <rect x="35.5" y="16.5" width="3" height="1.8" rx="0.5" fill="#b45309"/>
      {/* Battery pack 2 */}
      <rect x="33" y="35" width="8" height="10" rx="2.5" fill="#d97706"/>
      <rect x="34" y="36" width="6" height="8" rx="1.5" fill="#f59e0b"/>
      <rect x="35.5" y="37.5" width="3" height="2" rx="0.5" fill="#fbbf24"/>
      <rect x="35.5" y="41" width="3" height="2" rx="0.5" fill="#fbbf24"/>
      {/* Connection wires */}
      <path d="M 31 25 L 33 25" stroke="#d97706" strokeWidth="1.5"/>
      <path d="M 31 40 L 33 40" stroke="#d97706" strokeWidth="1.5"/>
      <path d="M 31 25 L 31 40" stroke="#d97706" strokeWidth="1"/>
      {/* Energy bolt */}
      <polygon points="21,9 18,14 20,14 17,19 22,13 19,13" fill="#f59e0b" opacity="0.9"/>
    </svg>
  );
}
