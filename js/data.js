/**
 * BRAVADIAN | BRAVE INDIAN
 * Core Data Engine & Supabase Abstraction Layer
 * Supports LocalStorage Offline First + Supabase Cloud Sync
 *
 * TABLE OF CONTENTS
 * ─────────────────────────────────────────────────────
 *  1. SVG MOCK IMAGE GENERATORS ........... ~L10
 *  2. DEFAULT PRODUCT DATA ................ ~L400
 *  3. DEFAULT COLLECTIONS ................. ~L750
 *  4. DEFAULT SETTINGS .................... ~L760
 *  5. BravadianDB PUBLIC API .............. ~L1230
 *     - init(), getProducts(), saveProduct()
 *     - getCollections(), getSettings()
 *     - Supabase sync methods
 *  6. SUPABASE REMOTE SYNC ................ ~L1600
 * ─────────────────────────────────────────────────────
 */

(function (window) {
  'use strict';

  // SVG Helper to generate photorealistic, uncropped luxury streetwear mock images for Front, Back, Closeup, Lifestyle
  function createTeeSVG(title, subtitle, colorHex, accentHex, viewType) {
    const isWhite = colorHex.toLowerCase() === '#ffffff' || colorHex.toLowerCase() === '#f4f4f7' || colorHex.toLowerCase() === 'white' || colorHex.toLowerCase() === 'off-white' || colorHex.toLowerCase() === 'bone ecru';
    const teeBodyFill = isWhite ? '#ebebee' : '#111115';
    const teeHighlightFill = isWhite ? '#f8f8fa' : '#181820';
    const ribFill = isWhite ? '#dedee4' : '#0c0c0f';
    const innerNeckFill = isWhite ? '#cfd0d8' : '#070709';
    const strokeCol = isWhite ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)';
    const stitchCol = isWhite ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.18)';
    const textCol = isWhite ? '#0c0c10' : '#ffffff';
    const textSub = isWhite ? '#555566' : '#8a8a9a';
    const accent = accentHex || '#ff4d00';
    const uniqueId = (title + '_' + viewType + '_' + colorHex).replace(/[^a-zA-Z0-9]/g, '_');

    const upperTitle = (title || '').toUpperCase();

    if (viewType === 'closeup') {
      // MACRO FABRIC & CONSTRUCTION VIEW
      const macroSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 625" width="500" height="625">
          <defs>
            <radialGradient id="macroGrad_${uniqueId}" cx="50%" cy="40%" r="75%">
              <stop offset="0%" stop-color="#191922"/>
              <stop offset="60%" stop-color="#0e0e13"/>
              <stop offset="100%" stop-color="#060608"/>
            </radialGradient>
            <pattern id="knitPattern_${uniqueId}" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M0 4 L4 0 L8 4 L4 8 Z" fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1"/>
            </pattern>
          </defs>

          <!-- Deep Studio Canvas -->
          <rect width="100%" height="100%" fill="url(#macroGrad_${uniqueId})"/>
          <rect width="100%" height="100%" fill="url(#knitPattern_${uniqueId})"/>

          <!-- Header Specs -->
          <text x="35" y="45" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="3">[ MACRO FABRIC SPECIMEN ]</text>
          <text x="35" y="65" fill="#fff" font-family="'Syne', sans-serif" font-size="18" font-weight="900" letter-spacing="2">240 GSM COMBED INTERLOCK</text>
          <line x1="35" y1="78" x2="465" y2="78" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>

          <!-- 1.25" High Tension Rib Collar Contour -->
          <path d="M -40 180 Q 250 330 540 180" fill="none" stroke="${accent}" stroke-width="56" opacity="0.18"/>
          <path d="M -40 180 Q 250 330 540 180" fill="none" stroke="#121217" stroke-width="48"/>
          <path d="M -40 180 Q 250 330 540 180" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="48" stroke-dasharray="2,3"/>
          <path d="M -40 206 Q 250 356 540 206" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="5,4"/>

          <!-- Woven Luxury Damask Neck Label -->
          <g transform="translate(140, 270)">
            <rect x="0" y="0" width="220" height="135" rx="4" fill="#09090d" stroke="#f59e0b" stroke-width="1.2" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.9))"/>
            <rect x="6" y="6" width="208" height="123" rx="2" fill="none" stroke="rgba(245,158,11,0.25)" stroke-width="1" stroke-dasharray="3,2"/>
            
            <text x="110" y="36" text-anchor="middle" fill="#fff" font-family="'Syne', sans-serif" font-size="15" font-weight="900" letter-spacing="4">BRAVADIAN</text>
            <text x="110" y="52" text-anchor="middle" fill="#f59e0b" font-family="'Space Grotesk', monospace" font-size="8.5" font-weight="700" letter-spacing="3">BRAVE INDIAN</text>
            
            <line x1="30" y1="62" x2="190" y2="62" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>

            <text x="110" y="80" text-anchor="middle" fill="#ddd" font-family="'Space Grotesk', monospace" font-size="9" font-weight="700" letter-spacing="2">240 GSM HEAVY INTERLOCK</text>
            <text x="110" y="96" text-anchor="middle" fill="#888" font-family="'Space Grotesk', monospace" font-size="8" letter-spacing="1.5">100% COMBED LONG-STAPLE</text>
            <text x="110" y="112" text-anchor="middle" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="700" letter-spacing="3">CRAFTED IN BHARAT // BATCH 001</text>
          </g>

          <!-- Technical Spec Badges -->
          <g transform="translate(35, 460)">
            <rect x="0" y="0" width="430" height="115" rx="4" fill="#0d0d12" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
            
            <circle cx="25" cy="30" r="4" fill="${accent}"/>
            <text x="40" y="34" fill="#fff" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700">1.25" ANTI-SAG HIGH TENSION LYCRA RIB COLLAR</text>
            <text x="40" y="48" fill="#888" font-family="'Space Grotesk', monospace" font-size="8.5">Reinforced with twin-needle chainstitch to hold sharp drape through 100+ washes.</text>

            <circle cx="25" cy="72" r="4" fill="#f59e0b"/>
            <text x="40" y="76" fill="#fff" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700">240 GSM DENSE DUAL-INTERLOCK WEAVE</text>
            <text x="40" y="90" fill="#888" font-family="'Space Grotesk', monospace" font-size="8.5">Substantial 240g/m² weight gives architectural boxy drape with zero cling.</text>
          </g>
        </svg>
      `.trim();
      return `data:image/svg+xml;utf8,${encodeURIComponent(macroSvg)}`;
    }

    if (viewType === 'lifestyle') {
      // EDITORIAL MOOD & SILHOUETTE VIEW
      const lifeSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 625" width="500" height="625">
          <defs>
            <linearGradient id="lifeGrad_${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#14141c"/>
              <stop offset="50%" stop-color="#0a0a0e"/>
              <stop offset="100%" stop-color="#040405"/>
            </linearGradient>
            <radialGradient id="emberAura_${uniqueId}" cx="60%" cy="45%" r="55%">
              <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
              <stop offset="60%" stop-color="${accent}" stop-opacity="0.05"/>
              <stop offset="100%" stop-color="#000" stop-opacity="0"/>
            </radialGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#lifeGrad_${uniqueId})"/>
          <circle cx="280" cy="270" r="210" fill="url(#emberAura_${uniqueId})"/>

          <!-- Studio Lighting Silhouette Form -->
          <g filter="drop-shadow(0 20px 40px rgba(0,0,0,0.95))">
            <path d="M 200 135 C 220 152, 280 152, 300 135 L 410 195 L 450 285 L 385 315 L 370 290 L 370 545 C 300 550, 200 550, 130 545 L 130 290 L 115 315 L 50 285 L 90 195 Z" 
                  fill="#0c0c10" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.6"/>
            <!-- Rim Light on Right Shoulder -->
            <path d="M 300 135 L 410 195 L 450 285" fill="none" stroke="${accent}" stroke-width="3.5" stroke-linecap="round" opacity="0.85"/>
          </g>

          <!-- Editorial Typography Overlay -->
          <text x="40" y="55" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="4">EDITORIAL SILHOUETTE // ARCHIVE</text>
          <text x="40" y="85" fill="#fff" font-family="'Syne', sans-serif" font-size="28" font-weight="900" letter-spacing="3">BRAVADIAN</text>
          <text x="40" y="108" fill="#aaa" font-family="'Space Grotesk', monospace" font-size="10" font-weight="600" letter-spacing="2">240 GSM ARCHITECTURAL CUT</text>

          <!-- Center Spec Wheel -->
          <circle cx="250" cy="360" r="85" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="4,4"/>
          <circle cx="250" cy="360" r="60" fill="none" stroke="${accent}" stroke-width="1.2" opacity="0.5"/>
          <text x="250" y="355" text-anchor="middle" fill="#fff" font-family="'Syne', sans-serif" font-size="14" font-weight="900" letter-spacing="2">OVERSIZED</text>
          <text x="250" y="375" text-anchor="middle" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="9" font-weight="700" letter-spacing="2">240 GSM</text>

          <!-- Footer Metadata -->
          <line x1="40" y1="580" x2="460" y2="580" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <text x="40" y="602" fill="#777" font-family="'Space Grotesk', monospace" font-size="8.5" letter-spacing="2">HEAVY DROP SHOULDER // PRE-SHRUNK</text>
          <text x="460" y="602" text-anchor="end" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="8.5" font-weight="700" letter-spacing="2">EST. 2026 // BHARAT</text>
        </svg>
      `.trim();
      return `data:image/svg+xml;utf8,${encodeURIComponent(lifeSvg)}`;
    }

    // FRONT & BACK GRAPHICS DETERMINATION
    let artworkMarkup = '';
    if (viewType === 'front') {
      if (upperTitle.includes('NINETAILS')) {
        // Japanese / Cyberpunk Chest Emblem
        artworkMarkup = `
          <!-- Minimal Left Chest Anime / Ninetails Graphic -->
          <g transform="translate(170, 195)">
            <rect x="0" y="0" width="75" height="52" rx="3" fill="#09090e" stroke="${accent}" stroke-width="1.2"/>
            <text x="12" y="24" fill="${accent}" font-family="'Syne', sans-serif" font-size="16" font-weight="900">九尾</text>
            <text x="36" y="19" fill="${textCol}" font-family="'Syne', sans-serif" font-size="7" font-weight="800" letter-spacing="1">BRVD</text>
            <text x="36" y="28" fill="${textSub}" font-family="'Space Grotesk', monospace" font-size="5.5" font-weight="600">240 GSM</text>
            <line x1="8" y1="35" x2="67" y2="35" stroke="rgba(255,255,255,0.12)" stroke-width="0.8"/>
            <text x="10" y="44" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="6" font-weight="700" letter-spacing="1">CELESTIAL FOX // 01</text>
          </g>
          <!-- Woven Hem Tag -->
          <rect x="131" y="510" width="16" height="8" rx="1" fill="${accent}"/>
          <text x="139" y="516" text-anchor="middle" fill="#000" font-family="'Space Grotesk', monospace" font-size="4.5" font-weight="900">BRVD</text>
        `;
      } else if (upperTitle.includes('HOYSALA')) {
        artworkMarkup = `
          <!-- Hoysala Stone Inscription Chest Crest -->
          <g transform="translate(170, 195)">
            <rect x="0" y="0" width="76" height="50" rx="2" fill="#08080c" stroke="#FFA000" stroke-width="1.2"/>
            <text x="38" y="18" text-anchor="middle" fill="#FFA000" font-family="'Syne', sans-serif" font-size="9" font-weight="900" letter-spacing="1.5">HOYSALA</text>
            <text x="38" y="30" text-anchor="middle" fill="#fff" font-family="'Space Grotesk', monospace" font-size="6.5" font-weight="700">ROOTED IN STONE</text>
            <line x1="10" y1="36" x2="66" y2="36" stroke="#FFA000" stroke-width="0.8"/>
            <text x="38" y="44" text-anchor="middle" fill="#888" font-family="'Space Grotesk', monospace" font-size="5.5">240 GSM // BHARAT</text>
          </g>
        `;
      } else if (upperTitle.includes('ASURA')) {
        artworkMarkup = `
          <!-- Asura Mythological Chest Sigil -->
          <g transform="translate(180, 195)">
            <circle cx="26" cy="26" r="24" fill="#0a0a0f" stroke="#FFA000" stroke-width="1.2"/>
            <polygon points="26,10 38,36 14,36" fill="none" stroke="#FFA000" stroke-width="1"/>
            <text x="26" y="30" text-anchor="middle" fill="#fff" font-family="'Syne', sans-serif" font-size="7" font-weight="900">ASURA</text>
            <text x="26" y="42" text-anchor="middle" fill="#FFA000" font-family="'Space Grotesk', monospace" font-size="5" font-weight="700">400 GSM</text>
          </g>
        `;
      } else if (upperTitle.includes('BERUNDA')) {
        artworkMarkup = `
          <!-- Berunda Tonal Twin-Eagle Pocket Patch -->
          <g transform="translate(170, 195)">
            <rect x="0" y="0" width="76" height="50" rx="2" fill="#08080c" stroke="#FFA000" stroke-width="1"/>
            <circle cx="28" cy="20" r="8" fill="none" stroke="#FFA000" stroke-width="1"/>
            <circle cx="48" cy="20" r="8" fill="none" stroke="#FFA000" stroke-width="1"/>
            <text x="38" y="36" text-anchor="middle" fill="#fff" font-family="'Syne', sans-serif" font-size="8" font-weight="900">BERUNDA</text>
            <text x="38" y="44" text-anchor="middle" fill="#FFA000" font-family="'Space Grotesk', monospace" font-size="5" font-weight="700">CHORE COAT</text>
          </g>
        `;
      } else if (upperTitle.includes('GARUDA')) {
        artworkMarkup = `
          <!-- Sacred Solar Feather Crest -->
          <g transform="translate(180, 195)">
            <circle cx="26" cy="26" r="24" fill="#0a0a0f" stroke="#f59e0b" stroke-width="1.2"/>
            <circle cx="26" cy="26" r="18" fill="none" stroke="rgba(245,158,11,0.3)" stroke-width="0.8" stroke-dasharray="2,2"/>
            <text x="26" y="24" text-anchor="middle" fill="#f59e0b" font-family="'Tiro Devanagari Hindi', serif" font-size="14" font-weight="700">गरुड़</text>
            <text x="26" y="35" text-anchor="middle" fill="#fff" font-family="'Space Grotesk', monospace" font-size="5" font-weight="800" letter-spacing="1">APEX 240</text>
          </g>
        `;
      } else if (upperTitle.includes('BHARAT') || upperTitle.includes('MONOLITH')) {
        artworkMarkup = `
          <!-- Brutalist Longitude Badge -->
          <g transform="translate(170, 195)">
            <rect x="0" y="0" width="80" height="46" rx="2" fill="#08080c" stroke="${accent}" stroke-width="1"/>
            <text x="10" y="18" fill="#fff" font-family="'Syne', sans-serif" font-size="9" font-weight="900" letter-spacing="1.5">BHARAT</text>
            <text x="10" y="29" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="6.5" font-weight="700">28°36'N 77°12'E</text>
            <text x="10" y="39" fill="${textSub}" font-family="'Space Grotesk', monospace" font-size="5.5" letter-spacing="1">240 GSM ARCHIVE</text>
          </g>
        `;
      } else if (upperTitle.includes('CYBER')) {
        artworkMarkup = `
          <!-- Industrial Hazard Barcode -->
          <g transform="translate(170, 195)">
            <rect x="0" y="0" width="76" height="48" rx="2" fill="#08080c" stroke="${accent}" stroke-width="1.2"/>
            <rect x="0" y="0" width="76" height="6" fill="${accent}"/>
            <text x="38" y="5" text-anchor="middle" fill="#000" font-family="'Space Grotesk', monospace" font-size="4.5" font-weight="900">WARNING: 240 GSM</text>
            <text x="8" y="24" fill="#fff" font-family="'Syne', sans-serif" font-size="9" font-weight="900" letter-spacing="1">CYBER REBEL</text>
            <line x1="8" y1="32" x2="68" y2="32" stroke="${textCol}" stroke-width="2" stroke-dasharray="1,2,3,1,2"/>
            <text x="8" y="42" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="6" font-weight="700">[BRVD-CR-04]</text>
          </g>
        `;
      } else if (upperTitle.includes('ASHOKA')) {
        artworkMarkup = `
          <!-- Solar Chakra Mini Chest Disc -->
          <g transform="translate(185, 200)">
            <circle cx="22" cy="22" r="20" fill="#0a0a0f" stroke="#f59e0b" stroke-width="1.2"/>
            <circle cx="22" cy="22" r="14" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="2,2"/>
            <circle cx="22" cy="22" r="5" fill="${accent}"/>
            <text x="22" y="35" text-anchor="middle" fill="#fff" font-family="'Space Grotesk', monospace" font-size="4.5" font-weight="800">24 CHAKRA</text>
          </g>
        `;
      } else {
        // Clean Minimal Tonal Chest Badge
        artworkMarkup = `
          <g transform="translate(175, 200)">
            <rect x="0" y="0" width="70" height="40" rx="2" fill="#0a0a0d" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
            <text x="35" y="18" text-anchor="middle" fill="${textCol}" font-family="'Syne', sans-serif" font-size="7.5" font-weight="800" letter-spacing="2">BRAVADIAN</text>
            <text x="35" y="30" text-anchor="middle" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="6.5" font-weight="700" letter-spacing="1.5">240 GSM</text>
          </g>
        `;
      }
    } else {
      // BACK STATEMENT PRINT
      if (upperTitle.includes('NINETAILS')) {
        artworkMarkup = `
          <!-- Monumental Nine-Tails Celestial Fox Artwork -->
          <g transform="translate(160, 160)">
            <!-- Outer Architectural Grid Frame -->
            <rect x="0" y="0" width="180" height="230" rx="4" fill="#08080c" stroke="${accent}" stroke-width="1.2" stroke-dasharray="6,3"/>
            
            <!-- Radiating Sun Mandala Halo -->
            <circle cx="90" cy="95" r="52" fill="none" stroke="rgba(255,77,0,0.25)" stroke-width="1.5" stroke-dasharray="3,3"/>
            <circle cx="90" cy="95" r="42" fill="none" stroke="rgba(245,158,11,0.4)" stroke-width="1"/>

            <!-- 9 Radiant Flame Tails (Multi-layered vector curves) -->
            <path d="M 90 120 C 70 80, 20 70, 30 35 C 45 45, 65 75, 80 100" fill="${accent}" opacity="0.9"/>
            <path d="M 90 120 C 60 70, 40 40, 55 20 C 70 35, 80 65, 85 100" fill="#f59e0b" opacity="0.95"/>
            <path d="M 90 120 C 75 60, 65 30, 80 12 C 90 30, 92 65, 90 100" fill="#ff7700" opacity="0.9"/>
            
            <path d="M 90 120 C 110 80, 160 70, 150 35 C 135 45, 115 75, 100 100" fill="${accent}" opacity="0.9"/>
            <path d="M 90 120 C 120 70, 140 40, 125 20 C 110 35, 100 65, 95 100" fill="#f59e0b" opacity="0.95"/>
            <path d="M 90 120 C 105 60, 115 30, 100 12 C 90 30, 88 65, 90 100" fill="#ff7700" opacity="0.9"/>

            <!-- Fox Spirit Head & Mask -->
            <polygon points="90,75 75,50 82,75 90,95 98,75 105,50" fill="#ffffff"/>
            <polygon points="90,85 85,93 95,93" fill="${accent}"/>
            <!-- Eyes -->
            <polygon points="82,78 86,81 83,83" fill="${accent}"/>
            <polygon points="98,78 94,81 97,83" fill="${accent}"/>

            <!-- Vertical Japanese Kanji Stream -->
            <text x="18" y="70" fill="#fff" font-family="'Syne', sans-serif" font-size="10" font-weight="900" opacity="0.8">勇</text>
            <text x="18" y="86" fill="#fff" font-family="'Syne', sans-serif" font-size="10" font-weight="900" opacity="0.8">敢</text>
            <text x="18" y="102" fill="${accent}" font-family="'Syne', sans-serif" font-size="10" font-weight="900">狐</text>

            <!-- Heavy Typography Block -->
            <text x="90" y="160" text-anchor="middle" fill="#ffffff" font-family="'Syne', sans-serif" font-size="18" font-weight="900" letter-spacing="4">BRAVADIAN</text>
            <text x="90" y="178" text-anchor="middle" fill="${accent}" font-family="'Syne', sans-serif" font-size="14" font-weight="900" letter-spacing="3">NINETAILS</text>
            
            <line x1="25" y1="190" x2="155" y2="190" stroke="${accent}" stroke-width="1.5"/>

            <text x="90" y="205" text-anchor="middle" fill="#ccc" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="700" letter-spacing="2">CELESTIAL FOX SPIRIT // ANIME ARCHIVE</text>
            <text x="90" y="218" text-anchor="middle" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="7" font-weight="700" letter-spacing="2.5">[ 240 GSM HEAVYWEIGHT // BATCH 001 ]</text>
          </g>
        `;
      } else if (upperTitle.includes('HOYSALA')) {
        artworkMarkup = `
          <!-- Hoysala Architectural Temple Relief -->
          <g transform="translate(160, 160)">
            <rect x="0" y="0" width="180" height="230" rx="4" fill="#08080c" stroke="#FFA000" stroke-width="1.2"/>
            <path d="M 90 35 L 45 80 L 60 80 L 60 120 L 120 120 L 120 80 L 135 80 Z" fill="none" stroke="#FFA000" stroke-width="1.5"/>
            <rect x="75" y="90" width="30" height="30" fill="#FFA000" opacity="0.3"/>
            <text x="90" y="150" text-anchor="middle" fill="#ffffff" font-family="'Syne', sans-serif" font-size="16" font-weight="900" letter-spacing="3">HOYSALA</text>
            <text x="90" y="170" text-anchor="middle" fill="#FFA000" font-family="'Space Grotesk', monospace" font-size="9" font-weight="700" letter-spacing="2.5">ROOTED IN STONE</text>
            <line x1="30" y1="184" x2="150" y2="184" stroke="#FFA000" stroke-width="1.2"/>
            <text x="90" y="202" text-anchor="middle" fill="#aaa" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="700" letter-spacing="2">ARCHITECTURAL RELIEF</text>
            <text x="90" y="216" text-anchor="middle" fill="#FFA000" font-family="'Space Grotesk', monospace" font-size="7" font-weight="700" letter-spacing="2.5">240 GSM HEAVYWEIGHT</text>
          </g>
        `;
      } else if (upperTitle.includes('ASURA')) {
        artworkMarkup = `
          <!-- Asura Mythological Warrior Frieze -->
          <g transform="translate(160, 160)">
            <rect x="0" y="0" width="180" height="230" rx="4" fill="#08080c" stroke="#FFA000" stroke-width="1.2"/>
            <circle cx="90" cy="75" r="32" fill="none" stroke="#FFA000" stroke-width="1.2" stroke-dasharray="3,2"/>
            <polygon points="90,45 105,75 75,75" fill="#FFA000" opacity="0.8"/>
            <text x="90" y="150" text-anchor="middle" fill="#ffffff" font-family="'Syne', sans-serif" font-size="18" font-weight="900" letter-spacing="3">ASURA</text>
            <text x="90" y="170" text-anchor="middle" fill="#FFA000" font-family="'Space Grotesk', monospace" font-size="8.5" font-weight="700" letter-spacing="2">WARRIOR ARCHIVE</text>
            <line x1="30" y1="184" x2="150" y2="184" stroke="#FFA000" stroke-width="1.2"/>
            <text x="90" y="202" text-anchor="middle" fill="#aaa" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="700" letter-spacing="2">CHAOS DOCTRINE</text>
            <text x="90" y="216" text-anchor="middle" fill="#FFA000" font-family="'Space Grotesk', monospace" font-size="7" font-weight="700" letter-spacing="2.5">400 GSM BRUSHED FLEECE</text>
          </g>
        `;
      } else if (upperTitle.includes('BERUNDA')) {
        artworkMarkup = `
          <!-- Gandaberunda Twin-Headed Eagle Crest -->
          <g transform="translate(160, 160)">
            <rect x="0" y="0" width="180" height="230" rx="4" fill="#08080c" stroke="#FFA000" stroke-width="1.2"/>
            <circle cx="72" cy="70" r="14" fill="none" stroke="#FFA000" stroke-width="1.5"/>
            <circle cx="108" cy="70" r="14" fill="none" stroke="#FFA000" stroke-width="1.5"/>
            <path d="M 60 70 L 40 45 L 90 90 L 140 45 L 120 70 Z" fill="#FFA000" opacity="0.75"/>
            <text x="90" y="150" text-anchor="middle" fill="#ffffff" font-family="'Syne', sans-serif" font-size="16" font-weight="900" letter-spacing="3">BERUNDA</text>
            <text x="90" y="170" text-anchor="middle" fill="#FFA000" font-family="'Space Grotesk', monospace" font-size="8.5" font-weight="700" letter-spacing="2">TWIN SOVEREIGN</text>
            <line x1="30" y1="184" x2="150" y2="184" stroke="#FFA000" stroke-width="1.2"/>
            <text x="90" y="202" text-anchor="middle" fill="#aaa" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="700" letter-spacing="2">HEAVY CHORE COAT</text>
            <text x="90" y="216" text-anchor="middle" fill="#FFA000" font-family="'Space Grotesk', monospace" font-size="7" font-weight="700" letter-spacing="2.5">CANVAS EMBROIDERY</text>
          </g>
        `;
      } else if (upperTitle.includes('GARUDA')) {
        artworkMarkup = `
          <!-- Monumental Garuda Sovereign Wingspan -->
          <g transform="translate(160, 160)">
            <rect x="0" y="0" width="180" height="230" rx="4" fill="#08080c" stroke="#FFA000" stroke-width="1.2" stroke-dasharray="4,4"/>
            
            <!-- Wingspan Art -->
            <path d="M 90 90 L 20 40 L 40 70 L 15 65 L 35 90 L 90 115 L 145 90 L 165 65 L 140 70 L 160 40 Z" fill="#FFA000" opacity="0.9"/>
            <circle cx="90" cy="80" r="28" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="2,2"/>
            <text x="90" y="85" text-anchor="middle" fill="#fff" font-family="'Tiro Devanagari Hindi', serif" font-size="14" font-weight="700">गरुड़</text>

            <text x="90" y="155" text-anchor="middle" fill="#fff" font-family="'Syne', sans-serif" font-size="18" font-weight="900" letter-spacing="3">GARUDA DISTRESSED</text>
            <text x="90" y="175" text-anchor="middle" fill="#FFA000" font-family="'Syne', sans-serif" font-size="13" font-weight="900" letter-spacing="2">400 GSM FLEECE</text>
            <line x1="30" y1="188" x2="150" y2="188" stroke="#FFA000" stroke-width="1.5"/>
            <text x="90" y="205" text-anchor="middle" fill="#ccc" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="700" letter-spacing="2">MYTHOLOGY DROP // BHARAT</text>
            <text x="90" y="218" text-anchor="middle" fill="#FFA000" font-family="'Space Grotesk', monospace" font-size="7" font-weight="700" letter-spacing="2.5">LIMITED ARCHIVE PIECE</text>
          </g>
        `;
      } else if (upperTitle.includes('BHARAT') || upperTitle.includes('MONOLITH')) {
        artworkMarkup = `
          <!-- Monumental Bharat Heritage Print -->
          <g transform="translate(160, 160)">
            <rect x="0" y="0" width="180" height="230" rx="4" fill="#08080c" stroke="${accent}" stroke-width="1.2"/>
            
            <!-- Brutalist Ashoka Chakra Geometry -->
            <circle cx="90" cy="80" r="38" fill="none" stroke="${accent}" stroke-width="1.5"/>
            <circle cx="90" cy="80" r="28" fill="none" stroke="#fff" stroke-width="0.8" stroke-dasharray="3,2"/>
            <circle cx="90" cy="80" r="8" fill="${accent}"/>
            
            <text x="90" y="150" text-anchor="middle" fill="#ffffff" font-family="'Syne', sans-serif" font-size="20" font-weight="900" letter-spacing="4">BHARAT</text>
            <text x="90" y="172" text-anchor="middle" fill="${accent}" font-family="'Syne', sans-serif" font-size="14" font-weight="900" letter-spacing="3">MONOLITH</text>
            <line x1="30" y1="185" x2="150" y2="185" stroke="${accent}" stroke-width="1.5"/>
            <text x="90" y="202" text-anchor="middle" fill="#ccc" font-family="'Space Grotesk', monospace" font-size="8" font-weight="700" letter-spacing="2">28°36'N 77°12'E // HERITAGE</text>
            <text x="90" y="216" text-anchor="middle" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="7" font-weight="700" letter-spacing="2.5">240 GSM HEAVY INTERLOCK</text>
          </g>
        `;
      } else if (upperTitle.includes('CYBER')) {
        artworkMarkup = `
          <!-- Cyber Rebellion Dystopian Print -->
          <g transform="translate(160, 160)">
            <rect x="0" y="0" width="180" height="230" rx="4" fill="#08080c" stroke="${accent}" stroke-width="1.5"/>
            
            <!-- Hazard Cross Stripes -->
            <line x1="10" y1="15" x2="170" y2="15" stroke="${accent}" stroke-width="4" stroke-dasharray="6,4"/>
            <text x="90" y="55" text-anchor="middle" fill="#fff" font-family="'Syne', sans-serif" font-size="16" font-weight="900" letter-spacing="2">RAW REBELLION</text>
            <text x="90" y="78" text-anchor="middle" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="8" font-weight="700" letter-spacing="3">[ ANTI-SURVEILLANCE ]</text>
            
            <!-- Inverted Brutalist Seal -->
            <polygon points="90,95 65,135 115,135" fill="none" stroke="${accent}" stroke-width="2"/>
            <text x="90" y="125" text-anchor="middle" fill="#fff" font-family="'Space Grotesk', monospace" font-size="12" font-weight="900">!</text>

            <text x="90" y="170" text-anchor="middle" fill="#fff" font-family="'Syne', sans-serif" font-size="15" font-weight="900" letter-spacing="3">BRAVADIAN</text>
            <text x="90" y="190" text-anchor="middle" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="9" font-weight="700" letter-spacing="2">STREET ARCHIVE 2026</text>
            <text x="90" y="214" text-anchor="middle" fill="#888" font-family="'Space Grotesk', monospace" font-size="7" letter-spacing="2">[ 240 GSM OVERSIZED ]</text>
          </g>
        `;
      } else {
        // Minimal or Default Statement Back
        artworkMarkup = `
          <g transform="translate(160, 175)">
            <rect x="0" y="0" width="180" height="200" rx="4" fill="#08080c" stroke="${accent}" stroke-width="1" stroke-dasharray="5,4"/>
            <text x="90" y="65" text-anchor="middle" fill="#ffffff" font-family="'Syne', sans-serif" font-size="20" font-weight="900" letter-spacing="4">BRAVADIAN</text>
            <text x="90" y="95" text-anchor="middle" fill="${accent}" font-family="'Syne', sans-serif" font-size="16" font-weight="900" letter-spacing="3">BRAVE INDIAN</text>
            <line x1="30" y1="115" x2="150" y2="115" stroke="${accent}" stroke-width="1.5"/>
            <text x="90" y="140" text-anchor="middle" fill="#bbb" font-family="'Space Grotesk', monospace" font-size="8.5" font-weight="700" letter-spacing="2">ARCHITECTURAL SILHOUETTE</text>
            <text x="90" y="165" text-anchor="middle" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="700" letter-spacing="3">[ 240 GSM // HEAVY INTERLOCK ]</text>
          </g>
        `;
      }
    }

    // Complete T-Shirt Silhouette SVG in 500x625 Aspect Ratio (4:5)
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 625" width="500" height="625">
        <defs>
          <radialGradient id="bgGrad_${uniqueId}" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stop-color="#181822"/>
            <stop offset="60%" stop-color="#0b0b0f"/>
            <stop offset="100%" stop-color="#050507"/>
          </radialGradient>
          <linearGradient id="teeBodyGrad_${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${teeHighlightFill}"/>
            <stop offset="40%" stop-color="${teeBodyFill}"/>
            <stop offset="100%" stop-color="${isWhite ? '#d8d8de' : '#0c0c10'}"/>
          </linearGradient>
          <filter id="studioShadow_${uniqueId}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000" flood-opacity="0.85"/>
          </filter>
        </defs>

        <!-- Studio Atmosphere Backdrop -->
        <rect width="100%" height="100%" fill="url(#bgGrad_${uniqueId})"/>

        <!-- Ambient Floor Spotlight Shadow -->
        <ellipse cx="250" cy="570" rx="150" ry="24" fill="#000000" opacity="0.6" filter="blur(10px)"/>

        <!-- T-SHIRT SILHOUETTE GROUP (Perfect Centered Framing, No Zooming, No Cropping) -->
        <g filter="url(#studioShadow_${uniqueId})">
          
          <!-- Inner Back Collar Scoop (visible from front) -->
          ${viewType === 'front' ? `
            <path d="M 200 95 C 220 78, 280 78, 300 95 C 280 114, 220 114, 200 95 Z" fill="${innerNeckFill}"/>
            <!-- Woven Inside Neck Brand Label -->
            <rect x="232" y="85" width="36" height="18" rx="1.5" fill="#050508" stroke="#f59e0b" stroke-width="0.8"/>
            <text x="250" y="93" text-anchor="middle" fill="#fff" font-family="'Syne', sans-serif" font-size="4" font-weight="900" letter-spacing="0.5">BRAVADIAN</text>
            <text x="250" y="99" text-anchor="middle" fill="#f59e0b" font-family="'Space Grotesk', monospace" font-size="3.5" font-weight="700">240 GSM</text>
          ` : ''}

          <!-- Main Oversized Streetwear T-Shirt Body -->
          <path d="M 200 95 
                   ${viewType === 'front' ? 'C 220 114, 280 114, 300 95' : 'C 225 102, 275 102, 300 95'}
                   L 410 160 
                   L 455 255 
                   L 390 285 
                   L 370 260 
                   L 370 535 
                   C 300 540, 200 540, 130 535 
                   L 130 260 
                   L 110 285 
                   L 45 255 
                   L 90 160 
                   Z" 
                fill="url(#teeBodyGrad_${uniqueId})" 
                stroke="${strokeCol}" 
                stroke-width="1.2"/>

          <!-- 1.25" Heavy Rib Collar -->
          <path d="M 197 94 C 220 120, 280 120, 303 94" 
                fill="none" 
                stroke="${ribFill}" 
                stroke-width="11" 
                stroke-linecap="round"/>
          <path d="M 197 94 C 220 120, 280 120, 303 94" 
                fill="none" 
                stroke="${strokeCol}" 
                stroke-width="1.5" 
                stroke-linecap="round"/>

          <!-- Dropped Shoulder Seam Detail -->
          <line x1="90" y1="160" x2="130" y2="260" stroke="${stitchCol}" stroke-width="1.2" stroke-dasharray="4,2"/>
          <line x1="410" y1="160" x2="370" y2="260" stroke="${stitchCol}" stroke-width="1.2" stroke-dasharray="4,2"/>

          <!-- Sleeve Cuff Stitching -->
          <line x1="48" y1="250" x2="112" y2="280" stroke="${stitchCol}" stroke-width="1" stroke-dasharray="3,2"/>
          <line x1="452" y1="250" x2="388" y2="280" stroke="${stitchCol}" stroke-width="1" stroke-dasharray="3,2"/>

          <!-- Hemline Double Stitching -->
          <path d="M 132 527 C 200 532, 300 532, 368 527" fill="none" stroke="${stitchCol}" stroke-width="1" stroke-dasharray="4,2"/>
        </g>

        <!-- Graphic Artwork Print Layer -->
        ${artworkMarkup}

        <!-- Technical Corner Badges (Editorial Luxury Aesthetic) -->
        <text x="25" y="32" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="8.5" font-weight="700" letter-spacing="2">BRAVADIAN // [240 GSM]</text>
        <text x="475" y="32" text-anchor="end" fill="#777" font-family="'Space Grotesk', monospace" font-size="8.5" font-weight="700" letter-spacing="2">VIEW: ${viewType.toUpperCase()}</text>
        <text x="25" y="605" fill="#555" font-family="'Space Grotesk', monospace" font-size="8" letter-spacing="1.5">HEAVYWEIGHT OVERSIZED SILHOUETTE</text>
        <text x="475" y="605" text-anchor="end" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="8" font-weight="700" letter-spacing="2">BHARAT ARCHIVE</text>
      </svg>
    `.trim();

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  /* ==========================================================================
     ARCHITECTURAL SVG DIAGRAM GENERATOR FOR UNIVERSE WALL CHAPTERS
     --------------------------------------------------------------------------
     Produces clean, technical vector diagrams (3:4 aspect ratio) for all 10
     Civilizational Chapters without using photographic image files.
     ========================================================================== */
  function createUniverseDiagramSVG(num, name, chapterName, category = 'active') {
    const isVault = category === 'vault';
    const strokeColor = isVault ? 'rgba(107, 106, 105, 0.7)' : '#FFA000';
    const glowColor = isVault ? 'rgba(107, 106, 105, 0.2)' : 'rgba(255, 160, 0, 0.35)';
    const textColor = isVault ? '#6B6A69' : '#FFA000';
    const mutedText = isVault ? '#484848' : '#888888';
    const bgFill = isVault ? '#09090C' : '#0B0B0E';

    let emblemMarkup = '';
    switch (String(num).padStart(2, '0')) {
      case '01': // HERITAGE - Hoysala temple shikhara & stepped shrine relief
        emblemMarkup = `
          <g stroke="${strokeColor}" stroke-width="1.6" fill="none">
            <polygon points="150,90 220,180 80,180" />
            <polygon points="150,110 205,180 95,180" opacity="0.6"/>
            <polygon points="150,130 190,180 110,180" opacity="0.4"/>
            <rect x="70" y="180" width="160" height="24" stroke="${strokeColor}"/>
            <rect x="85" y="204" width="130" height="24" stroke="${strokeColor}"/>
            <rect x="100" y="228" width="100" height="24" stroke="${strokeColor}"/>
            <rect x="135" y="192" width="30" height="60" fill="${strokeColor}" fill-opacity="0.15"/>
            <circle cx="150" cy="190" r="8" fill="${strokeColor}" fill-opacity="0.3"/>
            <line x1="150" y1="65" x2="150" y2="90" stroke="${strokeColor}" stroke-width="2"/>
            <circle cx="150" cy="65" r="4" fill="${strokeColor}"/>
            <text x="150" y="280" text-anchor="middle" fill="${strokeColor}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="3">HOYSALA // ORIGIN</text>
          </g>
        `;
        break;

      case '02': // GARUDA - Sovereign avian winged dissent
        emblemMarkup = `
          <g stroke="${strokeColor}" stroke-width="1.6" fill="none">
            <path d="M 150 110 L 240 135 L 210 175 L 260 190 L 190 215 L 150 245 L 110 215 L 40 190 L 90 175 L 60 135 Z" fill="${strokeColor}" fill-opacity="0.1"/>
            <line x1="150" y1="125" x2="225" y2="150"/>
            <line x1="150" y1="140" x2="200" y2="175"/>
            <line x1="150" y1="125" x2="75" y2="150"/>
            <line x1="150" y1="140" x2="100" y2="175"/>
            <circle cx="150" cy="145" r="14" stroke="${strokeColor}" stroke-width="1.8"/>
            <circle cx="150" cy="145" r="5" fill="${strokeColor}"/>
            <line x1="150" y1="80" x2="150" y2="110" stroke-width="2"/>
            <polygon points="150,75 145,85 155,85" fill="${strokeColor}"/>
            <text x="150" y="280" text-anchor="middle" fill="${strokeColor}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="3">SOVEREIGN SKY</text>
          </g>
        `;
        break;

      case '03': // ASURA - Solar shadows & chaos duality
        emblemMarkup = `
          <g stroke="${strokeColor}" stroke-width="1.6" fill="none">
            <circle cx="150" cy="165" r="55" stroke="${strokeColor}" stroke-dasharray="4,3"/>
            <circle cx="150" cy="165" r="40" stroke="${strokeColor}"/>
            <circle cx="150" cy="165" r="24" fill="${strokeColor}" fill-opacity="0.15"/>
            <path d="M 150 95 L 150 80 M 150 235 L 150 250 M 80 165 L 65 165 M 220 165 L 235 165" stroke-width="2"/>
            <path d="M 100 115 L 90 105 M 200 215 L 210 225 M 100 215 L 90 225 M 200 115 L 210 105" stroke-width="2"/>
            <path d="M 105 130 C 120 95, 180 95, 195 130" stroke-width="2"/>
            <polygon points="150,150 160,170 140,170" fill="${strokeColor}"/>
            <text x="150" y="280" text-anchor="middle" fill="${strokeColor}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="3">SOLAR SHADOWS</text>
          </g>
        `;
        break;

      case '04': // BERUNDA - Symmetrical twin-headed royal eagle
        emblemMarkup = `
          <g stroke="${strokeColor}" stroke-width="1.6" fill="none">
            <path d="M 150 115 L 205 140 L 195 210 L 150 245 L 105 210 L 95 140 Z" fill="${strokeColor}" fill-opacity="0.12"/>
            <path d="M 140 120 C 130 95, 105 100, 95 120 L 85 115 L 95 128" stroke-width="2"/>
            <circle cx="112" cy="115" r="2.5" fill="${strokeColor}"/>
            <path d="M 160 120 C 170 95, 195 100, 205 120 L 215 115 L 205 128" stroke-width="2"/>
            <circle cx="188" cy="115" r="2.5" fill="${strokeColor}"/>
            <path d="M 135 90 L 142 100 L 150 85 L 158 100 L 165 90 L 165 108 L 135 108 Z" stroke-width="1.8" fill="${strokeColor}" fill-opacity="0.3"/>
            <line x1="150" y1="130" x2="150" y2="225" stroke-width="1.8" stroke-dasharray="3,2"/>
            <text x="150" y="280" text-anchor="middle" fill="${strokeColor}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="3">DOUBLE VISION</text>
          </g>
        `;
        break;

      case '05': // CHOLA - Maritime bronze dominion
        emblemMarkup = `
          <g stroke="${strokeColor}" stroke-width="1.6" fill="none">
            <path d="M 85 185 C 95 240, 205 240, 215 185" stroke-width="2.5"/>
            <line x1="150" y1="90" x2="150" y2="235" stroke-width="2.5"/>
            <line x1="110" y1="125" x2="190" y2="125" stroke-width="2.5"/>
            <circle cx="150" cy="85" r="14" stroke-width="2.2"/>
            <path d="M 135 75 L 150 60 L 165 75"/>
            <line x1="150" y1="60" x2="150" y2="72"/>
            <path d="M 100 215 Q 125 205, 150 215 T 200 215" stroke-width="1.2" opacity="0.6"/>
            <text x="150" y="280" text-anchor="middle" fill="${strokeColor}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="3">BRONZE AGE</text>
          </g>
        `;
        break;

      case '06': // SIMHA - Sovereign Lion Crest of Ashoka Pillars
        emblemMarkup = `
          <g stroke="${strokeColor}" stroke-width="1.6" fill="none">
            <path d="M 150 100 C 185 100, 215 125, 210 165 C 205 195, 185 220, 150 230 C 115 220, 95 195, 90 165 C 85 125, 115 100, 150 100 Z" fill="${strokeColor}" fill-opacity="0.08"/>
            <circle cx="150" cy="165" r="45" stroke-dasharray="3,3" opacity="0.7"/>
            <path d="M 125 210 L 120 235 M 140 215 L 140 240 M 160 215 L 160 240 M 175 210 L 180 235" stroke-width="2"/>
            <line x1="90" y1="245" x2="210" y2="245" stroke-width="2"/>
            <text x="150" y="280" text-anchor="middle" fill="${strokeColor}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="3">PRIDE &amp; CLAW</text>
          </g>
        `;
        break;

      case '07': // NAGARA - Sacred Coil & Spire
        emblemMarkup = `
          <g stroke="${strokeColor}" stroke-width="1.6" fill="none">
            <path d="M 150 190 A 25 25 0 0 1 175 215 A 40 40 0 0 1 135 255 A 55 55 0 0 1 95 200 A 70 70 0 0 1 165 145" stroke-width="2"/>
            <polygon points="150,75 180,165 120,165" stroke-width="1.8" fill="${strokeColor}" fill-opacity="0.1"/>
            <line x1="150" y1="55" x2="150" y2="75" stroke-width="2"/>
            <circle cx="150" cy="55" r="4" fill="${strokeColor}"/>
            <line x1="130" y1="140" x2="170" y2="140"/>
            <line x1="140" y1="115" x2="160" y2="115"/>
            <text x="150" y="280" text-anchor="middle" fill="${strokeColor}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="3">COIL &amp; SPIRE</text>
          </g>
        `;
        break;

      case '08': // KALPA - Cosmic infinite loop / dual toruses
        emblemMarkup = `
          <g stroke="${strokeColor}" stroke-width="1.6" fill="none">
            <path d="M 150 165 C 120 120, 80 120, 80 165 C 80 210, 120 210, 150 165 C 180 120, 220 120, 220 165 C 220 210, 180 210, 150 165 Z" stroke-width="2.5" fill="${strokeColor}" fill-opacity="0.08"/>
            <circle cx="105" cy="165" r="15" stroke-dasharray="3,2"/>
            <circle cx="195" cy="165" r="15" stroke-dasharray="3,2"/>
            <circle cx="105" cy="165" r="4" fill="${strokeColor}"/>
            <circle cx="195" cy="165" r="4" fill="${strokeColor}"/>
            <circle cx="150" cy="165" r="6" fill="${strokeColor}"/>
            <text x="150" y="280" text-anchor="middle" fill="${strokeColor}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="3">INFINITE LOOP</text>
          </g>
        `;
        break;

      case '09': // AYUDHA - Archival blades & crossed tridents
        emblemMarkup = `
          <g stroke="${strokeColor}" stroke-width="1.6" fill="none">
            <line x1="90" y1="100" x2="210" y2="230" stroke-width="2.2"/>
            <line x1="210" y1="100" x2="90" y2="230" stroke-width="2.2"/>
            <polygon points="150,115 190,145 180,205 150,230 120,205 110,145" stroke-width="2" fill="${strokeColor}" fill-opacity="0.15"/>
            <polygon points="150,140 165,165 150,190 135,165" fill="${strokeColor}"/>
            <text x="150" y="280" text-anchor="middle" fill="${strokeColor}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="3">ARCHIVAL BLADES</text>
          </g>
        `;
        break;

      case '10': // DRAVIDA - Stepped towering gopuram pyramid
        emblemMarkup = `
          <g stroke="${strokeColor}" stroke-width="1.6" fill="none">
            <rect x="75" y="225" width="150" height="24" stroke-width="2" fill="${strokeColor}" fill-opacity="0.08"/>
            <rect x="90" y="195" width="120" height="24" stroke-width="1.8"/>
            <rect x="105" y="165" width="90" height="24" stroke-width="1.8"/>
            <rect x="120" y="135" width="60" height="24" stroke-width="1.8"/>
            <rect x="135" y="105" width="30" height="24" stroke-width="1.8"/>
            <line x1="140" y1="90" x2="140" y2="105" stroke-width="1.5"/>
            <line x1="150" y1="85" x2="150" y2="105" stroke-width="2"/>
            <line x1="160" y1="90" x2="160" y2="105" stroke-width="1.5"/>
            <path d="M 140 249 L 140 220 Q 150 210 160 220 L 160 249" fill="${strokeColor}" fill-opacity="0.3"/>
            <text x="150" y="280" text-anchor="middle" fill="${strokeColor}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="3">RISING TOWERS</text>
          </g>
        `;
        break;

      default:
        emblemMarkup = `
          <circle cx="150" cy="165" r="50" stroke="${strokeColor}" stroke-width="2" fill="none"/>
          <text x="150" y="280" text-anchor="middle" fill="${strokeColor}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700">${name}</text>
        `;
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 375" width="100%" height="100%">
        <defs>
          <pattern id="diagGrid_${num}" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="${strokeColor}" stroke-opacity="0.07" stroke-width="1"/>
          </pattern>
          <radialGradient id="radialGlow_${num}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${glowColor}" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="${glowColor}" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="300" height="375" fill="${bgFill}"/>
        <rect width="300" height="375" fill="url(#diagGrid_${num})"/>
        <circle cx="150" cy="165" r="110" fill="url(#radialGlow_${num})"/>
        <line x1="20" y1="20" x2="35" y2="20" stroke="${strokeColor}" stroke-width="1.5"/>
        <line x1="20" y1="20" x2="20" y2="35" stroke="${strokeColor}" stroke-width="1.5"/>
        <line x1="280" y1="20" x2="265" y2="20" stroke="${strokeColor}" stroke-width="1.5"/>
        <line x1="280" y1="20" x2="280" y2="35" stroke="${strokeColor}" stroke-width="1.5"/>
        <line x1="20" y1="355" x2="35" y2="355" stroke="${strokeColor}" stroke-width="1.5"/>
        <line x1="20" y1="355" x2="20" y2="340" stroke="${strokeColor}" stroke-width="1.5"/>
        <line x1="280" y1="355" x2="265" y2="355" stroke="${strokeColor}" stroke-width="1.5"/>
        <line x1="280" y1="355" x2="280" y2="340" stroke="${strokeColor}" stroke-width="1.5"/>
        <line x1="140" y1="165" x2="160" y2="165" stroke="${strokeColor}" stroke-width="1" stroke-opacity="0.4"/>
        <line x1="150" y1="155" x2="150" y2="175" stroke="${strokeColor}" stroke-width="1" stroke-opacity="0.4"/>
        <text x="25" y="38" fill="${textColor}" font-family="'Space Grotesk', monospace" font-size="8" font-weight="700" letter-spacing="2">CHAPTER // ${num}</text>
        <text x="275" y="38" text-anchor="end" fill="${mutedText}" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="600" letter-spacing="1.5">RELIC SPEC [240 GSM]</text>
        ${emblemMarkup}
        <line x1="25" y1="325" x2="275" y2="325" stroke="${strokeColor}" stroke-width="1" stroke-opacity="0.2"/>
        <text x="25" y="342" fill="${mutedText}" font-family="'Space Grotesk', monospace" font-size="7.5" letter-spacing="1.5">SPEC: BOX FIT // 100% COMBED</text>
        <text x="275" y="342" text-anchor="end" fill="${textColor}" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="700" letter-spacing="2">BHARAT ARMORED</text>
      </svg>
    `.trim();

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // DEFAULT COLLECTIONS (Canon Chapters)
  const DEFAULT_COLLECTIONS = [
    { id: 'c-all', name: 'ALL', slug: 'all', description: 'Browse and secure your relics from our structural multi-chapter manifest. Every garment is heavily engineered and strictly numbered.', isActive: true, order: 0 },
    { id: 'c-heritage', name: 'HERITAGE', slug: 'heritage', description: 'Rooted in the earth of Bharat. Cultural brutalism and ancient stone friezes.', isActive: true, order: 1 },
    { id: 'c-garuda', name: 'GARUDA', slug: 'garuda', description: 'Geometric winged dissent. Sovereign avian iconography on 240+ GSM drape.', isActive: true, order: 2 },
    { id: 'c-asura', name: 'ASURA', slug: 'asura', description: 'Chaos doctrine // Duality. Underground mythological armor and sun-burnt patinas.', isActive: true, order: 3 },
    { id: 'c-berunda', name: 'BERUNDA', slug: 'berunda', description: 'Twin-headed sovereignty. Heavy canvas and monumental bullion embroidery.', isActive: true, order: 4 },
    { id: 'c-chola', name: 'CHOLA', slug: 'chola', description: 'Maritime dominion in bronze. Imperial temple armor and tactical outer shells.', isActive: true, order: 5 },
    { id: 'c-simha', name: 'SIMHA', slug: 'simha', description: 'Lion crest of sovereign pillars. Heavyweight armor forged in stone silence.', isActive: false, order: 6 },
    { id: 'c-nagara', name: 'NAGARA', slug: 'nagara', description: 'Spires reaching toward heavens. Serpent coil geometry and architectural relief.', isActive: false, order: 7 },
    { id: 'c-kalpa', name: 'KALPA', slug: 'kalpa', description: 'Cycles of cosmic dissolution. Monolithic granite block with geometric engravings.', isActive: false, order: 8 },
    { id: 'c-ayudha', name: 'AYUDHA', slug: 'ayudha', description: 'Weapons forged in stone silence. Dark techwear accessory with high-spec modular straps.', isActive: false, order: 9 },
    { id: 'c-dravida', name: 'DRAVIDA', slug: 'dravida', description: 'Brutalist temple gopuram tower silhouette towering vertically into midnight sky.', isActive: false, order: 10 }
  ];

  /* ==========================================================================
     THE TEN UNIVERSE CHAPTERS (MATCHING FIGMA SPECIFICATION)
     --------------------------------------------------------------------------
     Row 1: ACTIVE DROP CHAPTERS (01–05)
     Row 2: LOCK-DOWN VAULT STAGES (06–10)
     ========================================================================== */
  const DEFAULT_UNIVERSE_CHAPTERS = [
    { num: '01', name: 'HERITAGE', slug: 'heritage', chapter: 'CHAPTER 01: ORIGIN', category: 'active', statusBadge: '4 PIECES ACTIVE', isLive: true, image: null, description: 'Rooted in the earth of Bharat. Cultural brutalism and ancient stone friezes.' },
    { num: '02', name: 'GARUDA', slug: 'garuda', chapter: 'CHAPTER 02: SOVEREIGN SKY', category: 'active', statusBadge: '4 PIECES ACTIVE', isLive: true, image: null, description: 'Geometric winged dissent. Sovereign avian iconography on 240+ GSM drape.' },
    { num: '03', name: 'ASURA', slug: 'asura', chapter: 'CHAPTER 03: SOLAR SHADOWS', category: 'active', statusBadge: '4 PIECES ACTIVE', isLive: false, image: null, description: 'Chaos doctrine // Duality. Underground mythological armor and sun-burnt patinas.' },
    { num: '04', name: 'BERUNDA', slug: 'berunda', chapter: 'CHAPTER 04: DOUBLE VISION', category: 'active', statusBadge: '4 PIECES ACTIVE', isLive: false, image: null, description: 'Twin-headed sovereignty. Heavy canvas and monumental bullion embroidery.' },
    { num: '05', name: 'CHOLA', slug: 'chola', chapter: 'CHAPTER 05: BRONZE AGE', category: 'active', statusBadge: '4 PIECES ACTIVE', isLive: false, image: null, description: 'Maritime dominion in bronze. Imperial temple armor and tactical outer shells.' },
    { num: '06', name: 'SIMHA', slug: 'simha', chapter: 'CHAPTER 06: PRIDE & CLAW', category: 'vault', statusBadge: 'COMING SOON', isLive: false, image: null, description: 'Lion crest of sovereign pillars. Heavyweight armor forged in stone silence.' },
    { num: '07', name: 'NAGARA', slug: 'nagara', chapter: 'CHAPTER 07: COIL & SPIRE', category: 'vault', statusBadge: 'COMING SOON', isLive: false, image: null, description: 'Spires reaching toward heavens. Serpent coil geometry and architectural relief.' },
    { num: '08', name: 'KALPA', slug: 'kalpa', chapter: 'CHAPTER 08: INFINITE LOOP', category: 'vault', statusBadge: 'COMING SOON', isLive: false, image: null, description: 'Cycles of cosmic dissolution. Monolithic granite block with geometric engravings.' },
    { num: '09', name: 'AYUDHA', slug: 'ayudha', chapter: 'CHAPTER 09: ARCHIVAL BLADES', category: 'vault', statusBadge: 'COMING SOON', isLive: false, image: null, description: 'Weapons forged in stone silence. Dark techwear accessory with high-spec modular straps.' },
    { num: '10', name: 'DRAVIDA', slug: 'dravida', chapter: 'CHAPTER 10: RISING TOWERS', category: 'vault', statusBadge: 'COMING SOON', isLive: false, image: null, description: 'Brutalist temple gopuram tower silhouette towering vertically into midnight sky.' }
  ];

  /* ==========================================================================
     THE TEN ARCHIVE EDITIONS CONFIGURATION
     --------------------------------------------------------------------------
     Easily add or activate collections for future launches:
     - status: 'active'  => Live drop, clickable link with [+] and hover effects
     - status: 'next'    => Upcoming drop with [NEXT] badge, non-interactive
     - status: 'vault'   => Locked edition, dimmed with [VAULT] badge, non-interactive
     ========================================================================== */
  const TEN_ARCHIVE_EDITIONS = [
    { num: '01', title: 'HERITAGE', desc: 'CHAPTER 01: ORIGIN', status: 'active', slug: 'heritage' },
    { num: '02', title: 'GARUDA', desc: 'CHAPTER 02: SOVEREIGN SKY', status: 'active', slug: 'garuda' },
    { num: '03', title: 'ASURA', desc: 'CHAPTER 03: SOLAR SHADOWS', status: 'vault', slug: 'asura' },
    { num: '04', title: 'BERUNDA', desc: 'CHAPTER 04: DOUBLE VISION', status: 'vault', slug: 'berunda' },
    { num: '05', title: 'CHOLA', desc: 'CHAPTER 05: BRONZE AGE', status: 'vault', slug: 'chola' },
    { num: '06', title: 'SIMHA', desc: 'CHAPTER 06: PRIDE & CLAW', status: 'vault', slug: 'simha' },
    { num: '07', title: 'NAGARA', desc: 'CHAPTER 07: COIL & SPIRE', status: 'vault', slug: 'nagara' },
    { num: '08', title: 'KALPA', desc: 'CHAPTER 08: INFINITE LOOP', status: 'vault', slug: 'kalpa' },
    { num: '09', title: 'AYUDHA', desc: 'CHAPTER 09: ARCHIVAL BLADES', status: 'vault', slug: 'ayudha' },
    { num: '10', title: 'DRAVIDA', desc: 'CHAPTER 10: RISING TOWERS', status: 'vault', slug: 'dravida' }
  ];

  // DEFAULT SIZE GUIDE
  const DEFAULT_SIZE_GUIDE = [
    { size: 'S', chest: 44.0, length: 28.5, shoulder: 21.5, sleeve: 8.5 },
    { size: 'M', chest: 46.0, length: 29.5, shoulder: 22.5, sleeve: 9.0 },
    { size: 'L', chest: 48.0, length: 30.5, shoulder: 23.5, sleeve: 9.5 },
    { size: 'XL', chest: 50.0, length: 31.5, shoulder: 24.5, sleeve: 10.0 },
    { size: 'XXL', chest: 52.0, length: 32.5, shoulder: 25.5, sleeve: 10.5 }
  ];

  // DEFAULT SITE SETTINGS
  const DEFAULT_SETTINGS = {
    brandName: 'BRAVADIAN',
    tagline: 'BRAVE INDIAN',
    currency: '₹',
    whatsappNumber: '917975362526',
    instagramUrl: 'https://instagram.com/bravadian',
    supportEmail: 'bravadian.clothing@gmail.com',
    shippingFee: 99,
    freeShippingThreshold: 1999,
    estimatedDays: '3–5 Business Days',
    supabaseUrl: '',
    supabaseAnonKey: ''
  };

  // DEFAULT PRODUCTS with Variant-Level Inventory
  const DEFAULT_PRODUCTS = [
    {
      id: 'prod-001',
      name: 'HOYSALA OVERSIZED RELIC TEE',
      slug: 'hoysala-oversized-relic-tee',
      description: 'A severe tactical garment engineered from 280 GSM heavyweight French Terry. Imprinted with sacred architectural friezes from the historic Halebidu temple complex, modified as modern metropolitan armor.',
      price: 4800,
      comparePrice: 5800,
      collection: 'heritage',
      tags: ['oversized', 'hoysala', 'heavyweight', '280gsm', 'heritage'],
      fabric: '280 GSM HEAVYWEIGHT FRENCH TERRY',
      gsm: 280,
      fit: 'Oversized Boxy',
      material: '280 GSM Long-Staple Indian Combed Cotton',
      relicTag: 'RELIC 01',
      relicBadge: 'PRE-ORDER ACTIVATED',
      sku: 'BRVD-HYS-01',
      featured: true,
      newDrop: true,
      isComingSoon: false,
      status: 'PUBLISHED',
      colors: ['Obsidian Black', 'Bone Ecru'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('HOYSALA OVERSIZED RELIC TEE', 'Heritage', '#111116', '#FFA000', 'front'),
        back: createTeeSVG('HOYSALA OVERSIZED RELIC TEE', 'Heritage', '#111116', '#FFA000', 'back'),
        closeup: createTeeSVG('HOYSALA OVERSIZED RELIC TEE', 'Heritage', '#111116', '#FFA000', 'closeup'),
        lifestyle: createTeeSVG('HOYSALA OVERSIZED RELIC TEE', 'Heritage', '#111116', '#FFA000', 'lifestyle')
      },
      variants: [
        { color: 'Obsidian Black', size: 'S', stock: 8 },
        { color: 'Obsidian Black', size: 'M', stock: 15 },
        { color: 'Obsidian Black', size: 'L', stock: 12 },
        { color: 'Obsidian Black', size: 'XL', stock: 6 },
        { color: 'Obsidian Black', size: 'XXL', stock: 4 },
        { color: 'Bone Ecru', size: 'S', stock: 4 },
        { color: 'Bone Ecru', size: 'M', stock: 8 },
        { color: 'Bone Ecru', size: 'L', stock: 6 },
        { color: 'Bone Ecru', size: 'XL', stock: 0 },
        { color: 'Bone Ecru', size: 'XXL', stock: 2 }
      ]
    },
    {
      id: 'prod-002',
      name: 'HOYSALA LINGESHWARA RELIC TEE',
      slug: 'hoysala-lingeshwara-relic-tee',
      description: 'Engineered boxy heavyweight silhouette featuring the sacred Lingeshwara stone sanctuary geometry across dropped shoulder lines.',
      price: 3200,
      comparePrice: 3800,
      collection: 'heritage',
      tags: ['heritage', 'hoysala', 'lingeshwara', 'heavyweight', '240gsm'],
      fabric: '240 GSM FRENCH TERRY // BOX FIT SILHOUETTE',
      gsm: 240,
      fit: 'Boxy Drop Shoulder',
      material: '240 GSM Long-Staple Combed Cotton',
      relicTag: 'RELIC 02',
      relicBadge: '300 NUMBERED',
      sku: 'BRVD-LNG-02',
      featured: true,
      newDrop: true,
      isComingSoon: false,
      status: 'PUBLISHED',
      colors: ['Washed Black', 'Charcoal'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('HOYSALA LINGESHWARA', 'Heritage', '#111116', '#FFA000', 'front'),
        back: createTeeSVG('HOYSALA LINGESHWARA', 'Heritage', '#111116', '#FFA000', 'back'),
        closeup: createTeeSVG('HOYSALA LINGESHWARA', 'Heritage', '#111116', '#FFA000', 'closeup'),
        lifestyle: createTeeSVG('HOYSALA LINGESHWARA', 'Heritage', '#111116', '#FFA000', 'lifestyle')
      },
      variants: [
        { color: 'Washed Black', size: 'S', stock: 6 },
        { color: 'Washed Black', size: 'M', stock: 10 },
        { color: 'Washed Black', size: 'L', stock: 8 },
        { color: 'Washed Black', size: 'XL', stock: 4 },
        { color: 'Washed Black', size: 'XXL', stock: 3 },
        { color: 'Charcoal', size: 'S', stock: 5 },
        { color: 'Charcoal', size: 'M', stock: 6 },
        { color: 'Charcoal', size: 'L', stock: 4 },
        { color: 'Charcoal', size: 'XL', stock: 0 },
        { color: 'Charcoal', size: 'XXL', stock: 2 }
      ]
    },
    {
      id: 'prod-003',
      name: 'SRI YOGA SARASVATHESHWARA TEE',
      slug: 'sri-yoga-sarasvatheshwara-tee',
      description: 'Monumental archival 300 GSM cotton tee presenting the multi-armed Yogic sovereign deity in pure metallic gold foil screenprint.',
      price: 3600,
      comparePrice: 4200,
      collection: 'garuda',
      tags: ['garuda', 'mythology', 'gold-foil', '300gsm', 'yoga'],
      fabric: '300 GSM ARCHIVAL COTTON // GOLD FOIL PRINT',
      gsm: 300,
      fit: 'Architectural Boxy',
      material: '300 GSM 100% Archival Cotton',
      relicTag: 'RELIC 03',
      relicBadge: 'EDITION NUMBERED',
      sku: 'BRVD-YOG-03',
      featured: true,
      newDrop: true,
      isComingSoon: false,
      status: 'PUBLISHED',
      colors: ['Obsidian Black'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('SRI YOGA SARASVATHESHWARA', 'Garuda', '#0c0c10', '#FFA000', 'front'),
        back: createTeeSVG('SRI YOGA SARASVATHESHWARA', 'Garuda', '#0c0c10', '#FFA000', 'back'),
        closeup: createTeeSVG('SRI YOGA SARASVATHESHWARA', 'Garuda', '#0c0c10', '#FFA000', 'closeup'),
        lifestyle: createTeeSVG('SRI YOGA SARASVATHESHWARA', 'Garuda', '#0c0c10', '#FFA000', 'lifestyle')
      },
      variants: [
        { color: 'Obsidian Black', size: 'S', stock: 7 },
        { color: 'Obsidian Black', size: 'M', stock: 12 },
        { color: 'Obsidian Black', size: 'L', stock: 9 },
        { color: 'Obsidian Black', size: 'XL', stock: 5 },
        { color: 'Obsidian Black', size: 'XXL', stock: 3 }
      ]
    },
    {
      id: 'prod-004',
      name: 'NRITYA PRIMACY DESCENSION JACKET',
      slug: 'nritya-primacy-descension-jacket',
      description: 'Heavyweight tactical bomber constructed in 450 GSM canvas shell with custom antique brass zippers, rib knit cuffs, and tonal warrior embroidery.',
      price: 6500,
      comparePrice: 7999,
      collection: 'chola',
      tags: ['chola', 'jacket', 'bomber', 'nritya', '450gsm', 'heritage'],
      fabric: '450 GSM DUCK CANVAS // BOMBER ARCHITECTURE',
      gsm: 450,
      fit: 'Bomber Flight Cut',
      material: '450 GSM Heavy Canvas & Satin Lining',
      relicTag: 'ARTIFACT 04',
      relicBadge: '150 VAULT EDITION',
      sku: 'BRVD-NRT-04',
      featured: true,
      newDrop: true,
      isComingSoon: false,
      status: 'PUBLISHED',
      colors: ['Pitch Black'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('NRITYA PRIMACY BOMBER', 'Chola', '#121218', '#f59e0b', 'front'),
        back: createTeeSVG('NRITYA PRIMACY BOMBER', 'Chola', '#121218', '#f59e0b', 'back'),
        closeup: createTeeSVG('NRITYA PRIMACY BOMBER', 'Chola', '#121218', '#f59e0b', 'closeup'),
        lifestyle: createTeeSVG('NRITYA PRIMACY BOMBER', 'Chola', '#121218', '#f59e0b', 'lifestyle')
      },
      variants: [
        { color: 'Pitch Black', size: 'S', stock: 5 },
        { color: 'Pitch Black', size: 'M', stock: 8 },
        { color: 'Pitch Black', size: 'L', stock: 6 },
        { color: 'Pitch Black', size: 'XL', stock: 3 },
        { color: 'Pitch Black', size: 'XXL', stock: 2 }
      ]
    },
    {
      id: 'prod-005',
      name: 'ASURA SOLAR FIRE OVERSIZED TEE',
      slug: 'asura-solar-fire-oversized-tee',
      description: 'Sun-burnt charcoal compact jersey featuring high-density sacred Sanskrit hymn "ॐ सह नाववतु" and radiating solar celestial sigil.',
      price: 2900,
      comparePrice: 3500,
      collection: 'asura',
      tags: ['asura', 'mythology', 'solar-fire', '280gsm', 'oversized'],
      fabric: '280 GSM COMPACT JERSEY // SUN BURNT PATINA',
      gsm: 280,
      fit: 'Relaxed Drop-Shoulder',
      material: '280 GSM 100% Combed Cotton',
      relicTag: 'RELIC 05',
      relicBadge: 'PROTOTYPE LOCKED',
      sku: 'BRVD-ASR-05',
      featured: true,
      newDrop: true,
      isComingSoon: false,
      status: 'PUBLISHED',
      colors: ['Washed Charcoal'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('ASURA SOLAR FIRE', 'Asura', '#1a1816', '#ff5722', 'front'),
        back: createTeeSVG('ASURA SOLAR FIRE', 'Asura', '#1a1816', '#ff5722', 'back'),
        closeup: createTeeSVG('ASURA SOLAR FIRE', 'Asura', '#1a1816', '#ff5722', 'closeup'),
        lifestyle: createTeeSVG('ASURA SOLAR FIRE', 'Asura', '#1a1816', '#ff5722', 'lifestyle')
      },
      variants: [
        { color: 'Washed Charcoal', size: 'S', stock: 7 },
        { color: 'Washed Charcoal', size: 'M', stock: 11 },
        { color: 'Washed Charcoal', size: 'L', stock: 8 },
        { color: 'Washed Charcoal', size: 'XL', stock: 4 },
        { color: 'Washed Charcoal', size: 'XXL', stock: 2 }
      ]
    },
    {
      id: 'prod-006',
      name: 'BERUNDA DUAL VISION ARMOR TEE',
      slug: 'berunda-dual-vision-armor-tee',
      description: '280 GSM heavyweight cotton tee with monumental twin-headed Gandaberunda imperial crest rendered in antique gold embroidery.',
      price: 3500,
      comparePrice: 4200,
      collection: 'berunda',
      tags: ['berunda', 'heritage', 'embroidery', '280gsm', 'armor'],
      fabric: '280 GSM HEAVY TERRY // GOLD EMBROIDERY',
      gsm: 280,
      fit: 'Oversized',
      material: '100% Combed Heavy Cotton',
      relicTag: 'RELIC 06',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-BRD-06',
      featured: true,
      newDrop: true,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Pitch Black'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('BERUNDA DUAL VISION', 'Berunda', '#0a0a0e', '#FFA000', 'front'),
        back: createTeeSVG('BERUNDA DUAL VISION', 'Berunda', '#0a0a0e', '#FFA000', 'back'),
        closeup: createTeeSVG('BERUNDA DUAL VISION', 'Berunda', '#0a0a0e', '#FFA000', 'closeup'),
        lifestyle: createTeeSVG('BERUNDA DUAL VISION', 'Berunda', '#0a0a0e', '#FFA000', 'lifestyle')
      },
      variants: [
        { color: 'Pitch Black', size: 'S', stock: 5 },
        { color: 'Pitch Black', size: 'M', stock: 8 },
        { color: 'Pitch Black', size: 'L', stock: 6 },
        { color: 'Pitch Black', size: 'XL', stock: 3 },
        { color: 'Pitch Black', size: 'XXL', stock: 2 }
      ]
    },
    {
      id: 'prod-007',
      name: 'BRAVADIAN NINETAILS',
      slug: 'bravadian-ninetails',
      description: '240 GSM heavyweight oversized silhouette featuring high-density back-print of the mythical celestial fox spirit. Constructed with double-combed long-staple yarns for architectural boxy drape.',
      price: 1499,
      comparePrice: 1999,
      collection: 'heritage',
      tags: ['oversized', 'anime', 'heavyweight', '240gsm'],
      fabric: '240 GSM INTERLOCK COTTON',
      gsm: 240,
      fit: 'Oversized',
      material: '100% Combed Heavy Interlock Cotton',
      relicTag: 'ARCHIVE 07',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-NT-07',
      featured: false,
      newDrop: false,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Black', 'White'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('BRAVADIAN NINETAILS', 'Anime', '#121216', '#ff4d00', 'front'),
        back: createTeeSVG('BRAVADIAN NINETAILS', 'Anime', '#121216', '#ff4d00', 'back'),
        closeup: createTeeSVG('BRAVADIAN NINETAILS', 'Anime', '#121216', '#ff4d00', 'closeup'),
        lifestyle: createTeeSVG('BRAVADIAN NINETAILS', 'Anime', '#121216', '#ff4d00', 'lifestyle')
      },
      variants: [
        { color: 'Black', size: 'S', stock: 8 },
        { color: 'Black', size: 'M', stock: 12 },
        { color: 'Black', size: 'L', stock: 0 },
        { color: 'Black', size: 'XL', stock: 5 },
        { color: 'Black', size: 'XXL', stock: 2 },
        { color: 'White', size: 'S', stock: 0 },
        { color: 'White', size: 'M', stock: 6 },
        { color: 'White', size: 'L', stock: 9 },
        { color: 'White', size: 'XL', stock: 4 },
        { color: 'White', size: 'XXL', stock: 1 }
      ]
    },
    {
      id: 'prod-008',
      name: 'BRAVADIAN GARUDA REBEL',
      slug: 'bravadian-garuda-rebel',
      description: 'An ode to the supreme avian sovereign. Geometric feathered wingspan printed in reflective metallic pigments across dropped shoulder seams on 240 GSM heavy French cotton.',
      price: 1699,
      comparePrice: 2199,
      collection: 'garuda',
      tags: ['mythology', 'garuda', 'heavyweight', '240gsm'],
      fabric: '240 GSM HEAVYWEIGHT FRENCH COTTON',
      gsm: 240,
      fit: 'Oversized',
      material: '100% Combed Cotton Heavy Interlock',
      relicTag: 'ARCHIVE 08',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-GRD-08',
      featured: true,
      newDrop: false,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Charcoal', 'Black'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('BRAVADIAN GARUDA', 'Mythology', '#16161c', '#f59e0b', 'front'),
        back: createTeeSVG('BRAVADIAN GARUDA', 'Mythology', '#16161c', '#f59e0b', 'back'),
        closeup: createTeeSVG('BRAVADIAN GARUDA', 'Mythology', '#16161c', '#f59e0b', 'closeup'),
        lifestyle: createTeeSVG('BRAVADIAN GARUDA', 'Mythology', '#16161c', '#f59e0b', 'lifestyle')
      },
      variants: [
        { color: 'Charcoal', size: 'S', stock: 5 },
        { color: 'Charcoal', size: 'M', stock: 8 },
        { color: 'Charcoal', size: 'L', stock: 6 },
        { color: 'Charcoal', size: 'XL', stock: 0 },
        { color: 'Charcoal', size: 'XXL', stock: 3 },
        { color: 'Black', size: 'S', stock: 7 },
        { color: 'Black', size: 'M', stock: 10 },
        { color: 'Black', size: 'L', stock: 4 },
        { color: 'Black', size: 'XL', stock: 3 },
        { color: 'Black', size: 'XXL', stock: 0 }
      ]
    },
    {
      id: 'prod-009',
      name: 'BRAVADIAN MONOLITH BHARAT',
      slug: 'bravadian-monolith-bharat',
      description: 'Rooted in Indian soil. 240 GSM high-density knit featuring brutalist longitude coordinates (28°36 N 77°12 E) and architectural Ashoka geometry across the back yoke.',
      price: 1599,
      comparePrice: 2099,
      collection: 'heritage',
      tags: ['heritage', 'bharat', 'oversized', '240gsm'],
      fabric: '240 GSM HIGH DENSITY KNIT',
      gsm: 240,
      fit: 'Oversized',
      material: '100% Combed Cotton',
      relicTag: 'ARCHIVE 09',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-BHT-09',
      featured: true,
      newDrop: true,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Black', 'Off-White'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('BRAVADIAN BHARAT', 'Heritage', '#101014', '#ff4d00', 'front'),
        back: createTeeSVG('BRAVADIAN BHARAT', 'Heritage', '#101014', '#ff4d00', 'back'),
        closeup: createTeeSVG('BRAVADIAN BHARAT', 'Heritage', '#101014', '#ff4d00', 'closeup'),
        lifestyle: createTeeSVG('BRAVADIAN BHARAT', 'Heritage', '#101014', '#ff4d00', 'lifestyle')
      },
      variants: [
        { color: 'Black', size: 'S', stock: 12 },
        { color: 'Black', size: 'M', stock: 15 },
        { color: 'Black', size: 'L', stock: 8 },
        { color: 'Black', size: 'XL', stock: 6 },
        { color: 'Black', size: 'XXL', stock: 4 },
        { color: 'Off-White', size: 'S', stock: 6 },
        { color: 'Off-White', size: 'M', stock: 7 },
        { color: 'Off-White', size: 'L', stock: 5 },
        { color: 'Off-White', size: 'XL', stock: 0 },
        { color: 'Off-White', size: 'XXL', stock: 2 }
      ]
    },
    {
      id: 'prod-010',
      name: 'BRAVADIAN CYBER REBEL',
      slug: 'bravadian-cyber-rebel',
      description: 'Underground dystopian Indian streetwear. High-impact typography with anti-surveillance warning tapes engineered on 240 GSM ultra-heavy cotton.',
      price: 1499,
      comparePrice: 1899,
      collection: 'chola',
      tags: ['street', 'cyber', 'oversized', '240gsm', 'chola'],
      fabric: '240 GSM ULTRA-HEAVY COTTON',
      gsm: 240,
      fit: 'Oversized',
      material: '100% Combed Cotton',
      relicTag: 'ARCHIVE 10',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-CR-10',
      featured: false,
      newDrop: false,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Pitch Black', 'Acid Charcoal'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('BRAVADIAN CYBER', 'Street', '#0a0a0e', '#ff4d00', 'front'),
        back: createTeeSVG('BRAVADIAN CYBER', 'Street', '#0a0a0e', '#ff4d00', 'back'),
        closeup: createTeeSVG('BRAVADIAN CYBER', 'Street', '#0a0a0e', '#ff4d00', 'closeup'),
        lifestyle: createTeeSVG('BRAVADIAN CYBER', 'Street', '#0a0a0e', '#ff4d00', 'lifestyle')
      },
      variants: [
        { color: 'Pitch Black', size: 'S', stock: 4 },
        { color: 'Pitch Black', size: 'M', stock: 6 },
        { color: 'Pitch Black', size: 'L', stock: 3 },
        { color: 'Pitch Black', size: 'XL', stock: 2 },
        { color: 'Pitch Black', size: 'XXL', stock: 0 },
        { color: 'Acid Charcoal', size: 'S', stock: 3 },
        { color: 'Acid Charcoal', size: 'M', stock: 5 },
        { color: 'Acid Charcoal', size: 'L', stock: 0 },
        { color: 'Acid Charcoal', size: 'XL', stock: 4 },
        { color: 'Acid Charcoal', size: 'XXL', stock: 1 }
      ]
    },
    {
      id: 'prod-011',
      name: 'BRAVADIAN ESSENTIAL 240',
      slug: 'bravadian-essential-240',
      description: 'Zero graphics. Zero noise. Pure structural drape, thick 1.25" Lycra rib collar, and drop-shoulder presence. Designed to outlast seasonal trends.',
      price: 1299,
      comparePrice: 1599,
      collection: 'heritage',
      tags: ['minimal', 'essential', 'plain', '240gsm', 'heritage'],
      fabric: '240 GSM COMBED INTERLOCK',
      gsm: 240,
      fit: 'Oversized',
      material: '100% Combed Cotton Heavy Interlock',
      relicTag: 'ARCHIVE 11',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-ES-11',
      featured: false,
      newDrop: false,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Pure Black', 'Bone Ecru'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('BRAVADIAN ESSENTIAL', 'Minimal', '#0e0e12', '#ffffff', 'front'),
        back: createTeeSVG('BRAVADIAN ESSENTIAL', 'Minimal', '#0e0e12', '#ffffff', 'back'),
        closeup: createTeeSVG('BRAVADIAN ESSENTIAL', 'Minimal', '#0e0e12', '#ffffff', 'closeup'),
        lifestyle: createTeeSVG('BRAVADIAN ESSENTIAL', 'Minimal', '#0e0e12', '#ffffff', 'lifestyle')
      },
      variants: [
        { color: 'Pure Black', size: 'S', stock: 20 },
        { color: 'Pure Black', size: 'M', stock: 25 },
        { color: 'Pure Black', size: 'L', stock: 18 },
        { color: 'Pure Black', size: 'XL', stock: 15 },
        { color: 'Pure Black', size: 'XXL', stock: 8 },
        { color: 'Bone Ecru', size: 'S', stock: 10 },
        { color: 'Bone Ecru', size: 'M', stock: 14 },
        { color: 'Bone Ecru', size: 'L', stock: 9 },
        { color: 'Bone Ecru', size: 'XL', stock: 5 },
        { color: 'Bone Ecru', size: 'XXL', stock: 4 }
      ]
    },
    {
      id: 'prod-012',
      name: 'BRAVADIAN ASHOKA EMBER',
      slug: 'bravadian-ashoka-ember',
      description: 'Unreleased archive drop. 24-spoke Solar Chakra motif in neon solar ember across the chest and oversized drop spine. Limited to 500 numbered pieces.',
      price: 1799,
      comparePrice: 2299,
      collection: 'asura',
      tags: ['asura', 'ashoka', 'limited', '240gsm'],
      fabric: '240 GSM COMBED HEAVY COTTON',
      gsm: 240,
      fit: 'Oversized',
      material: '100% Combed Heavy Cotton',
      relicTag: 'ARCHIVE 12',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-ASH-12',
      featured: true,
      newDrop: true,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Black Ember'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('BRAVADIAN ASHOKA', 'New Drop', '#0c0c10', '#ff4d00', 'front'),
        back: createTeeSVG('BRAVADIAN ASHOKA', 'New Drop', '#0c0c10', '#ff4d00', 'back'),
        closeup: createTeeSVG('BRAVADIAN ASHOKA', 'New Drop', '#0c0c10', '#ff4d00', 'closeup'),
        lifestyle: createTeeSVG('BRAVADIAN ASHOKA', 'New Drop', '#0c0c10', '#ff4d00', 'lifestyle')
      },
      variants: [
        { color: 'Black Ember', size: 'S', stock: 5 },
        { color: 'Black Ember', size: 'M', stock: 7 },
        { color: 'Black Ember', size: 'L', stock: 4 },
        { color: 'Black Ember', size: 'XL', stock: 0 },
        { color: 'Black Ember', size: 'XXL', stock: 2 }
      ]
    }
  ];

  // BRAVADIAN DATA STORAGE CONTROLLER
  const BravadianDB = {
    supabaseClient: null,

    init() {
      // Auto-Migration to ensure new luxury mockups, products, and collections load immediately
      const DATA_VERSION = '3.1.0';
      const storedVer = localStorage.getItem('bravadian_data_version');
      const storedProds = localStorage.getItem('bravadian_products');
      const hasStaleJpg = storedProds && (storedProds.includes('images/relics') || storedProds.includes('.jpg'));

      if (storedVer !== DATA_VERSION || hasStaleJpg) {
        localStorage.setItem('bravadian_data_version', DATA_VERSION);
        // Refresh cached products with pristine diagrams and collections
        localStorage.removeItem('bravadian_products');
        localStorage.removeItem('bravadian_collections');
        // Update contact details in existing stored settings
        const storedSettings = localStorage.getItem('bravadian_settings');
        if (storedSettings) {
          try {
            const s = JSON.parse(storedSettings);
            s.whatsappNumber = '917975362526';
            s.supportEmail = 'bravadian.clothing@gmail.com';
            localStorage.setItem('bravadian_settings', JSON.stringify(s));
          } catch (e) {
            localStorage.removeItem('bravadian_settings');
          }
        }
      }

      // Load saved settings
      const settings = this.getSettings();
      let sUrl = settings.supabaseUrl ? settings.supabaseUrl.trim() : '';
      if (sUrl && !sUrl.startsWith('http://') && !sUrl.startsWith('https://')) {
        sUrl = `https://${sUrl.replace(/\.supabase\.co.*$/, '')}.supabase.co`;
      }
      const sKey = settings.supabaseAnonKey ? settings.supabaseAnonKey.trim() : '';

      if (sUrl && sKey && window.supabase) {
        try {
          this.supabaseClient = window.supabase.createClient(sUrl, sKey);
          console.log('[BRAVADIAN] Connected to Supabase Data Layer:', sUrl);
          this.fetchRemoteCatalog();
        } catch (err) {
          console.warn('[BRAVADIAN] Supabase Init Error:', err);
        }
      }
    },

    isSupabaseConnected() {
      return !!this.supabaseClient;
    },

    // PRODUCTS
    getProducts(filters = {}) {
      let prods = [];
      const stored = localStorage.getItem('bravadian_products');
      if (stored) {
        try { prods = JSON.parse(stored); } catch (e) { prods = DEFAULT_PRODUCTS; }
      } else {
        prods = DEFAULT_PRODUCTS;
        localStorage.setItem('bravadian_products', JSON.stringify(prods));
      }

      // Apply Filters
      if (filters.collection && filters.collection !== 'all') {
        const cSlug = filters.collection.toLowerCase();
        // Data-driven collection alias map — add new aliases here
        const COLLECTION_ALIASES = {
          'garuda': ['mythology'],
          'asura': ['mythology'],
          'berunda': ['heritage'],
          'chola': ['heritage']
        };
        const aliases = COLLECTION_ALIASES[cSlug] || [];
        prods = prods.filter(p => {
          const pCol = (p.collection || '').toLowerCase();
          return pCol === cSlug ||
            aliases.includes(pCol) ||
            (p.tags && p.tags.some(t => t.toLowerCase() === cSlug));
        });
      }
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        prods = prods.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
        );
      }
      if (filters.color) {
        prods = prods.filter(p => p.colors && p.colors.includes(filters.color));
      }
      if (filters.size) {
        prods = prods.filter(p => p.variants && p.variants.some(v => v.size === filters.size && v.stock > 0));
      }
      if (filters.inStockOnly) {
        prods = prods.filter(p => p.variants && p.variants.some(v => v.stock > 0));
      }

      // Sort
      if (filters.sort === 'price-low') {
        prods.sort((a, b) => a.price - b.price);
      } else if (filters.sort === 'price-high') {
        prods.sort((a, b) => b.price - a.price);
      } else if (filters.sort === 'newest') {
        prods.sort((a, b) => (b.newDrop ? 1 : 0) - (a.newDrop ? 1 : 0));
      }

      return prods;
    },

    getProductBySlug(slug) {
      const prods = this.getProducts();
      return prods.find(p => p.slug === slug || p.id === slug) || null;
    },

    saveProduct(product) {
      const prods = this.getProducts();
      const existingIdx = prods.findIndex(p => p.id === product.id || p.slug === product.slug);
      
      if (existingIdx >= 0) {
        prods[existingIdx] = { ...prods[existingIdx], ...product };
      } else {
        if (!product.id) product.id = 'prod-' + Date.now();
        if (!product.slug) product.slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        prods.unshift(product);
      }

      localStorage.setItem('bravadian_products', JSON.stringify(prods));

      // If Supabase is active, async sync
      if (this.supabaseClient) {
        this.syncProductToSupabase(product);
      }
      return product;
    },

    deleteProduct(id) {
      let prods = this.getProducts();
      prods = prods.filter(p => p.id !== id && p.slug !== id);
      localStorage.setItem('bravadian_products', JSON.stringify(prods));
      if (this.supabaseClient) {
        this.deleteProductFromSupabase(id);
      }
      return true;
    },

    // VARIANT INVENTORY
    updateVariantStock(productId, color, size, newStock) {
      const prods = this.getProducts();
      const p = prods.find(item => item.id === productId || item.slug === productId);
      if (!p || !p.variants) return false;

      const variant = p.variants.find(v => v.color.toLowerCase() === color.toLowerCase() && v.size === size);
      if (variant) {
        variant.stock = Math.max(0, parseInt(newStock, 10) || 0);
      } else {
        p.variants.push({ color, size, stock: Math.max(0, parseInt(newStock, 10) || 0) });
      }

      localStorage.setItem('bravadian_products', JSON.stringify(prods));
      if (this.supabaseClient) {
        this.syncProductToSupabase(p);
      }
      return true;
    },

    // COLLECTIONS
    getCollections() {
      const stored = localStorage.getItem('bravadian_collections');
      if (stored) {
        try { return JSON.parse(stored); } catch (e) {}
      }
      localStorage.setItem('bravadian_collections', JSON.stringify(DEFAULT_COLLECTIONS));
      return DEFAULT_COLLECTIONS;
    },

    saveCollections(cols) {
      localStorage.setItem('bravadian_collections', JSON.stringify(cols));
      if (this.supabaseClient) {
        this.syncCollectionsToSupabase(cols);
      }
      return cols;
    },

    // THE TEN ARCHIVE EDITIONS
    getArchiveEditions() {
      return TEN_ARCHIVE_EDITIONS;
    },

    // THE TEN UNIVERSE CHAPTERS (FIGMA UNIVERSE WALL SPEC)
    getUniverseChapters() {
      const stored = localStorage.getItem('bravadian_universe_chapters');
      let chapters = DEFAULT_UNIVERSE_CHAPTERS;
      if (stored) {
        try { chapters = JSON.parse(stored); } catch (e) {}
      }

      // Check if remote collections from Supabase have images
      const remoteCols = this.getCollections();
      const colMap = {};
      if (remoteCols && remoteCols.length > 0) {
        remoteCols.forEach(rc => {
          if (rc.slug) colMap[rc.slug.toLowerCase()] = rc;
        });
      }

      return chapters.map(c => {
        const rc = colMap[c.slug.toLowerCase()];
        const remoteImage = (rc && (rc.image_url || rc.image || rc.imageUrl)) ? (rc.image_url || rc.image || rc.imageUrl) : null;
        return {
          ...c,
          image: remoteImage || c.image || null,
          diagram: createUniverseDiagramSVG(c.num, c.name, c.chapter, c.category)
        };
      });
    },

    // SIZE GUIDE
    getSizeGuide() {
      const stored = localStorage.getItem('bravadian_size_guide');
      if (stored) {
        try { return JSON.parse(stored); } catch (e) {}
      }
      localStorage.setItem('bravadian_size_guide', JSON.stringify(DEFAULT_SIZE_GUIDE));
      return DEFAULT_SIZE_GUIDE;
    },

    saveSizeGuide(guide) {
      localStorage.setItem('bravadian_size_guide', JSON.stringify(guide));
      if (this.supabaseClient) {
        this.syncSizeGuideToSupabase(guide);
      }
      return guide;
    },

    // SETTINGS
    getSettings() {
      const stored = localStorage.getItem('bravadian_settings');
      if (stored) {
        try { return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }; } catch (e) {}
      }
      return DEFAULT_SETTINGS;
    },

    saveSettings(newSettings) {
      const current = this.getSettings();
      const merged = { ...current, ...newSettings };
      localStorage.setItem('bravadian_settings', JSON.stringify(merged));
      this.init(); // re-init Supabase if keys changed
      if (this.supabaseClient) {
        this.syncSettingsToSupabase(merged);
      }
      return merged;
    },

    // DATA EXPORT & IMPORT
    exportAllData() {
      return {
        timestamp: new Date().toISOString(),
        brand: 'BRAVADIAN',
        version: '2.0.0',
        settings: this.getSettings(),
        collections: this.getCollections(),
        sizeGuide: this.getSizeGuide(),
        products: this.getProducts()
      };
    },

    importData(dataObj) {
      if (!dataObj || typeof dataObj !== 'object') throw new Error('Invalid JSON data format');
      if (dataObj.settings) localStorage.setItem('bravadian_settings', JSON.stringify(dataObj.settings));
      if (dataObj.collections) localStorage.setItem('bravadian_collections', JSON.stringify(dataObj.collections));
      if (dataObj.sizeGuide) localStorage.setItem('bravadian_size_guide', JSON.stringify(dataObj.sizeGuide));
      if (dataObj.products) localStorage.setItem('bravadian_products', JSON.stringify(dataObj.products));
      this.init();
      return true;
    },

    resetToFactoryDefaults() {
      localStorage.removeItem('bravadian_products');
      localStorage.removeItem('bravadian_collections');
      localStorage.removeItem('bravadian_size_guide');
      localStorage.removeItem('bravadian_settings');
      this.init();
      return true;
    },

    // SUPABASE SYNC HELPERS
    async syncCollectionsToSupabase(collections) {
      if (!this.supabaseClient) return;
      try {
        const rows = collections
          .map((c, idx) => {
            const row = {
              name: c.name,
              slug: c.slug,
              description: c.description || '',
              is_active: c.isActive !== false,
              display_order: typeof c.order === 'number' ? c.order : idx
            };
            if (c.id) {
              row.id = c.id;
            }
            return row;
          });

        if (rows.length > 0) {
          const { error } = await this.supabaseClient
            .from('collections')
            .upsert(rows, { onConflict: 'slug' });
          if (error) {
            console.error('[Supabase Collections Sync Error]:', error);
            throw error;
          }
        }
      } catch (e) {
        console.error('[Supabase Collections Exception]:', e);
        throw e;
      }
    },

    async deleteProductFromSupabase(idOrSlug) {
      if (!this.supabaseClient) return;
      try {
        const { error } = await this.supabaseClient
          .from('products')
          .delete()
          .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
        if (error) {
          console.warn('[Supabase Delete Product Notice]:', error);
        } else {
          console.log(`[BRAVADIAN] Deleted product ${idOrSlug} from Supabase.`);
        }
      } catch (e) {
        console.warn('[Supabase Delete Product Exception]:', e);
      }
    },

    async syncProductToSupabase(product) {
      if (!this.supabaseClient) return;
      try {
        const prodData = {
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          compare_price: product.comparePrice,
          collection_slug: product.collection,
          tags: product.tags || [],
          fabric: product.fabric,
          gsm: product.gsm || 240,
          fit: product.fit,
          material: product.material,
          sku: product.sku,
          is_featured: !!product.featured,
          is_new_drop: !!product.newDrop,
          is_coming_soon: !!product.isComingSoon,
          status: product.status || 'PUBLISHED'
        };

        if (product.relicTag) prodData.relic_tag = product.relicTag;
        if (product.relicBadge) prodData.relic_badge = product.relicBadge;
        if (product.images) prodData.images = product.images;
        if (product.variants) prodData.variants = product.variants;

        if (product.id) {
          prodData.id = product.id;
        }

        let { data: savedProd, error } = await this.supabaseClient
          .from('products')
          .upsert(prodData, { onConflict: 'slug' })
          .select()
          .single();

        if (error) {
          console.warn('[Supabase Sync Notice]: Retrying with core columns:', error.message);
          delete prodData.is_coming_soon;
          delete prodData.relic_tag;
          delete prodData.relic_badge;
          delete prodData.images;
          delete prodData.variants;
          const retry = await this.supabaseClient
            .from('products')
            .upsert(prodData, { onConflict: 'slug' })
            .select()
            .single();
          if (retry.error) {
            console.error('[Supabase Sync Retry Error]:', retry.error);
            throw retry.error;
          }
          savedProd = retry.data;
        }

        const productId = (savedProd && savedProd.id) ? savedProd.id : product.id;

        // Sync to relational product_images table if valid
        if (productId && product.images && typeof product.images === 'object') {
          try {
            const imgRows = Object.entries(product.images)
              .filter(([_, url]) => url && typeof url === 'string')
              .map(([vType, url], idx) => ({
                product_id: productId,
                image_url: url,
                view_type: ['hero', 'front', 'back', 'closeup', 'lifestyle', 'detail'].includes(vType) ? vType : 'front',
                display_order: idx + 1
              }));
            if (imgRows.length > 0) {
              await this.supabaseClient.from('product_images').upsert(imgRows, { onConflict: 'id' }).catch(() => {});
            }
          } catch (imgErr) {
            console.warn('[Supabase Images Sync Notice]:', imgErr);
          }
        }

        // Sync to relational product_variants & inventory if valid
        if (productId && Array.isArray(product.variants) && product.variants.length > 0) {
          try {
            for (const v of product.variants) {
              const varRow = {
                product_id: productId,
                color: v.color,
                size: v.size
              };
              const { data: savedVar } = await this.supabaseClient
                .from('product_variants')
                .upsert(varRow, { onConflict: 'product_id,color,size' })
                .select()
                .single();

              if (savedVar && savedVar.id && typeof v.stock === 'number') {
                await this.supabaseClient
                  .from('inventory')
                  .upsert({
                    variant_id: savedVar.id,
                    stock_quantity: v.stock
                  }, { onConflict: 'variant_id' }).catch(() => {});
              }
            }
          } catch (varErr) {
            console.warn('[Supabase Variants Sync Notice]:', varErr);
          }
        }
      } catch (e) {
        console.error('[Supabase Exception]:', e);
        throw e;
      }
    },

    async syncSettingsToSupabase(settings) {
      if (!this.supabaseClient) return;
      try {
        const rows = [
          { key: 'general', value: { brand_name: settings.brandName, tagline: settings.tagline, currency: settings.currency, support_email: settings.supportEmail } },
          { key: 'whatsapp', value: { phone_number: settings.whatsappNumber, business_name: 'BRAVADIAN Official' } },
          { key: 'shipping', value: { shipping_charge: settings.shippingFee, free_shipping_threshold: settings.freeShippingThreshold, estimated_days: settings.estimatedDays } },
          { key: 'social', value: { instagram: settings.instagramUrl } }
        ];
        await this.supabaseClient.from('site_settings').upsert(rows, { onConflict: 'key' });
      } catch (e) {
        console.warn('[Supabase Settings Sync Warning]:', e);
      }
    },

    async syncSizeGuideToSupabase(guide) {
      if (!this.supabaseClient) return;
      try {
        const rows = guide.map((g, idx) => ({
          size: g.size,
          chest_inches: g.chest,
          length_inches: g.length,
          shoulder_inches: g.shoulder,
          sleeve_inches: g.sleeve,
          display_order: idx + 1
        }));
        await this.supabaseClient.from('size_guide').upsert(rows, { onConflict: 'size' });
      } catch (e) {
        console.warn('[Supabase Size Guide Sync Warning]:', e);
      }
    },

    async fetchRemoteCatalog() {
      if (!this.supabaseClient) return { success: false, message: 'Supabase client not connected.' };
      const summary = { collections: 0, products: 0, sizeGuide: 0, settings: 0 };
      try {
        // 1. Fetch Collections
        try {
          const { data: cols, error: colErr } = await this.supabaseClient
            .from('collections')
            .select('*')
            .order('display_order', { ascending: true });

          if (!colErr && cols && cols.length > 0) {
            const mappedCols = cols.map(c => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              description: c.description || '',
              isActive: c.is_active !== false,
              order: c.display_order ?? 0
            }));
            localStorage.setItem('bravadian_collections', JSON.stringify(mappedCols));
            summary.collections = mappedCols.length;
          }
        } catch (colEx) {
          console.warn('[BRAVADIAN] Remote collections fetch notice:', colEx);
        }

        // 2. Fetch Products
        try {
          const { data: prods, error } = await this.supabaseClient
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

          // Also pull from product_images table if present in Supabase
          const relImagesMap = {};
          try {
            const { data: imgRows } = await this.supabaseClient
              .from('product_images')
              .select('*')
              .order('display_order', { ascending: true });
            if (imgRows && imgRows.length > 0) {
              imgRows.forEach(r => {
                if (!relImagesMap[r.product_id]) relImagesMap[r.product_id] = {};
                relImagesMap[r.product_id][r.view_type] = r.image_url;
              });
            }
          } catch (imgErr) {
            // Relational images optional
          }

          if (!error && prods && prods.length > 0) {
            const mapped = prods.map(p => {
              const relImgs = relImagesMap[p.id] || {};
              let dbImgs = {};
              if (p.images) {
                if (typeof p.images === 'string') {
                  try { dbImgs = JSON.parse(p.images); } catch (e) { dbImgs = {}; }
                } else if (Array.isArray(p.images)) {
                  dbImgs = {
                    front: p.images[0] || null,
                    back: p.images[1] || null,
                    closeup: p.images[2] || null,
                    lifestyle: p.images[3] || null
                  };
                } else if (typeof p.images === 'object') {
                  dbImgs = p.images;
                }
              }
              const mergedImgs = { ...relImgs, ...dbImgs };

              // Check if images are valid remote URLs (http/https) and not legacy mock paths
              const isValidImg = (url) => url && typeof url === 'string' && url.trim().length > 0 && !url.includes('images/relics');

              const front = isValidImg(mergedImgs.front) ? mergedImgs.front : createTeeSVG(p.name, p.collection_slug || 'Heritage', '#111116', '#FFA000', 'front');
              const back = isValidImg(mergedImgs.back) ? mergedImgs.back : createTeeSVG(p.name, p.collection_slug || 'Heritage', '#111116', '#FFA000', 'back');
              const closeup = isValidImg(mergedImgs.closeup) ? mergedImgs.closeup : createTeeSVG(p.name, p.collection_slug || 'Heritage', '#111116', '#FFA000', 'closeup');
              const lifestyle = isValidImg(mergedImgs.lifestyle) ? mergedImgs.lifestyle : createTeeSVG(p.name, p.collection_slug || 'Heritage', '#111116', '#FFA000', 'lifestyle');

              return {
                id: p.id,
                name: p.name,
                slug: p.slug,
                description: p.description || '',
                price: Number(p.price),
                comparePrice: p.compare_price ? Number(p.compare_price) : null,
                collection: p.collection_slug,
                tags: p.tags || [],
                fabric: p.fabric,
                gsm: p.gsm || 240,
                fit: p.fit,
                material: p.material,
                sku: p.sku,
                featured: !!p.is_featured,
                newDrop: !!p.is_new_drop,
                isComingSoon: !!p.is_coming_soon,
                relicTag: p.relic_tag,
                relicBadge: p.relic_badge,
                status: p.status || 'PUBLISHED',
                colors: (p.variants && Array.isArray(p.variants) && p.variants.length > 0)
                  ? Array.from(new Set(p.variants.map(v => v.color)))
                  : (p.colors || ['Black', 'White']),
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                images: {
                  front,
                  back,
                  closeup,
                  lifestyle
                },
                variants: p.variants || [
                  { color: 'Black', size: 'S', stock: 5 },
                  { color: 'Black', size: 'M', stock: 5 },
                  { color: 'Black', size: 'L', stock: 5 },
                  { color: 'Black', size: 'XL', stock: 5 },
                  { color: 'Black', size: 'XXL', stock: 5 }
                ]
              };
            });

            if (mapped.length > 0) {
              localStorage.setItem('bravadian_products', JSON.stringify(mapped));
              summary.products = mapped.length;
              console.log(`[BRAVADIAN] Loaded ${mapped.length} products from Supabase cloud.`);
            }
          }
        } catch (prodEx) {
          console.warn('[BRAVADIAN] Remote products fetch notice:', prodEx);
        }

        // 3. Fetch Size Guide
        try {
          const { data: sg, error: sgErr } = await this.supabaseClient
            .from('size_guide')
            .select('*')
            .order('display_order', { ascending: true });

          if (!sgErr && sg && sg.length > 0) {
            const mappedGuide = sg.map(s => ({
              size: s.size,
              chest: Number(s.chest_inches),
              length: Number(s.length_inches),
              shoulder: Number(s.shoulder_inches),
              sleeve: Number(s.sleeve_inches)
            }));
            localStorage.setItem('bravadian_size_guide', JSON.stringify(mappedGuide));
            summary.sizeGuide = mappedGuide.length;
          }
        } catch (sgEx) {
          console.warn('[BRAVADIAN] Remote size guide fetch notice:', sgEx);
        }

        // 4. Fetch Site Settings
        try {
          const { data: sets, error: setErr } = await this.supabaseClient
            .from('site_settings')
            .select('*');

          if (!setErr && sets && sets.length > 0) {
            const current = this.getSettings();
            const remoteSettings = { ...current };
            for (const s of sets) {
              if (s.key === 'general' && s.value) {
                if (s.value.brand_name) remoteSettings.brandName = s.value.brand_name;
                if (s.value.tagline) remoteSettings.tagline = s.value.tagline;
                if (s.value.currency) remoteSettings.currency = s.value.currency;
                if (s.value.support_email) remoteSettings.supportEmail = s.value.support_email;
              } else if (s.key === 'whatsapp' && s.value && s.value.phone_number) {
                remoteSettings.whatsappNumber = s.value.phone_number;
              } else if (s.key === 'shipping' && s.value) {
                if (s.value.shipping_charge !== undefined) remoteSettings.shippingFee = Number(s.value.shipping_charge);
                if (s.value.free_shipping_threshold !== undefined) remoteSettings.freeShippingThreshold = Number(s.value.free_shipping_threshold);
                if (s.value.estimated_days) remoteSettings.estimatedDays = s.value.estimated_days;
              } else if (s.key === 'social' && s.value && s.value.instagram) {
                remoteSettings.instagramUrl = s.value.instagram;
              }
            }
            localStorage.setItem('bravadian_settings', JSON.stringify(remoteSettings));
            summary.settings = sets.length;
          }
        } catch (setEx) {
          console.warn('[BRAVADIAN] Remote settings fetch notice:', setEx);
        }

        return { success: true, summary };
      } catch (e) {
        console.warn('[BRAVADIAN] Remote catalog fetch notice:', e);
        return { success: false, error: e.message || e };
      }
    }
  };

  // Auto-initialize
  BravadianDB.init();

  // Export to window
  window.BravadianDB = BravadianDB;
  window.TEN_ARCHIVE_EDITIONS = TEN_ARCHIVE_EDITIONS;
  window.DEFAULT_UNIVERSE_CHAPTERS = DEFAULT_UNIVERSE_CHAPTERS;
  window.createUniverseDiagramSVG = createUniverseDiagramSVG;
  window.BravadianDefaults = {
    DEFAULT_PRODUCTS,
    DEFAULT_COLLECTIONS,
    DEFAULT_UNIVERSE_CHAPTERS,
    TEN_ARCHIVE_EDITIONS,
    DEFAULT_SIZE_GUIDE,
    DEFAULT_SETTINGS,
    createTeeSVG,
    createUniverseDiagramSVG
  };

})(window);
