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
          <text x="35" y="65" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="18" font-weight="900" letter-spacing="2">240 GSM FRENCH TERRY</text>
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
            
            <text x="110" y="36" text-anchor="middle" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="15" font-weight="900" letter-spacing="4">BRAVADIAN</text>
            <text x="110" y="52" text-anchor="middle" fill="#f59e0b" font-family="'Space Grotesk', monospace" font-size="8.5" font-weight="700" letter-spacing="3">BRAVE INDIAN</text>
            
            <line x1="30" y1="62" x2="190" y2="62" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>

            <text x="110" y="80" text-anchor="middle" fill="#ddd" font-family="'Space Grotesk', monospace" font-size="9" font-weight="700" letter-spacing="2">240 GSM FRENCH TERRY</text>
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
            <text x="40" y="76" fill="#fff" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700">240 GSM FRENCH TERRY // BIO WASH</text>
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
          <text x="40" y="85" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="28" font-weight="900" letter-spacing="3">BRAVADIAN</text>
          <text x="40" y="108" fill="#aaa" font-family="'Space Grotesk', monospace" font-size="10" font-weight="600" letter-spacing="2">240 GSM ARCHITECTURAL CUT</text>

          <!-- Center Spec Wheel -->
          <circle cx="250" cy="360" r="85" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="4,4"/>
          <circle cx="250" cy="360" r="60" fill="none" stroke="${accent}" stroke-width="1.2" opacity="0.5"/>
          <text x="250" y="355" text-anchor="middle" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="14" font-weight="900" letter-spacing="2">OVERSIZED</text>
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
            <text x="12" y="24" fill="${accent}" font-family="'Bebas Neue', sans-serif" font-size="16" font-weight="900">九尾</text>
            <text x="36" y="19" fill="${textCol}" font-family="'Bebas Neue', sans-serif" font-size="7" font-weight="800" letter-spacing="1">BRVD</text>
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
            <text x="38" y="18" text-anchor="middle" fill="#FFA000" font-family="'Bebas Neue', sans-serif" font-size="9" font-weight="900" letter-spacing="1.5">HOYSALA</text>
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
            <text x="26" y="30" text-anchor="middle" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="7" font-weight="900">ASURA</text>
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
            <text x="38" y="36" text-anchor="middle" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="8" font-weight="900">BERUNDA</text>
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
            <text x="10" y="18" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="9" font-weight="900" letter-spacing="1.5">BHARAT</text>
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
            <text x="8" y="24" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="9" font-weight="900" letter-spacing="1">CYBER REBEL</text>
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
            <text x="35" y="18" text-anchor="middle" fill="${textCol}" font-family="'Bebas Neue', sans-serif" font-size="7.5" font-weight="800" letter-spacing="2">BRAVADIAN</text>
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
            <text x="18" y="70" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="10" font-weight="900" opacity="0.8">勇</text>
            <text x="18" y="86" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="10" font-weight="900" opacity="0.8">敢</text>
            <text x="18" y="102" fill="${accent}" font-family="'Bebas Neue', sans-serif" font-size="10" font-weight="900">狐</text>

            <!-- Heavy Typography Block -->
            <text x="90" y="160" text-anchor="middle" fill="#ffffff" font-family="'Bebas Neue', sans-serif" font-size="18" font-weight="900" letter-spacing="4">BRAVADIAN</text>
            <text x="90" y="178" text-anchor="middle" fill="${accent}" font-family="'Bebas Neue', sans-serif" font-size="14" font-weight="900" letter-spacing="3">NINETAILS</text>
            
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
            <text x="90" y="150" text-anchor="middle" fill="#ffffff" font-family="'Bebas Neue', sans-serif" font-size="16" font-weight="900" letter-spacing="3">HOYSALA</text>
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
            <text x="90" y="150" text-anchor="middle" fill="#ffffff" font-family="'Bebas Neue', sans-serif" font-size="18" font-weight="900" letter-spacing="3">ASURA</text>
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
            <text x="90" y="150" text-anchor="middle" fill="#ffffff" font-family="'Bebas Neue', sans-serif" font-size="16" font-weight="900" letter-spacing="3">BERUNDA</text>
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

            <text x="90" y="155" text-anchor="middle" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="18" font-weight="900" letter-spacing="3">GARUDA DISTRESSED</text>
            <text x="90" y="175" text-anchor="middle" fill="#FFA000" font-family="'Bebas Neue', sans-serif" font-size="13" font-weight="900" letter-spacing="2">400 GSM FLEECE</text>
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
            
            <text x="90" y="150" text-anchor="middle" fill="#ffffff" font-family="'Bebas Neue', sans-serif" font-size="20" font-weight="900" letter-spacing="4">BHARAT</text>
            <text x="90" y="172" text-anchor="middle" fill="${accent}" font-family="'Bebas Neue', sans-serif" font-size="14" font-weight="900" letter-spacing="3">MONOLITH</text>
            <line x1="30" y1="185" x2="150" y2="185" stroke="${accent}" stroke-width="1.5"/>
            <text x="90" y="202" text-anchor="middle" fill="#ccc" font-family="'Space Grotesk', monospace" font-size="8" font-weight="700" letter-spacing="2">28°36'N 77°12'E // HERITAGE</text>
            <text x="90" y="216" text-anchor="middle" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="7" font-weight="700" letter-spacing="2.5">240 GSM FRENCH TERRY</text>
          </g>
        `;
      } else if (upperTitle.includes('CYBER')) {
        artworkMarkup = `
          <!-- Cyber Rebellion Dystopian Print -->
          <g transform="translate(160, 160)">
            <rect x="0" y="0" width="180" height="230" rx="4" fill="#08080c" stroke="${accent}" stroke-width="1.5"/>
            
            <!-- Hazard Cross Stripes -->
            <line x1="10" y1="15" x2="170" y2="15" stroke="${accent}" stroke-width="4" stroke-dasharray="6,4"/>
            <text x="90" y="55" text-anchor="middle" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="16" font-weight="900" letter-spacing="2">RAW REBELLION</text>
            <text x="90" y="78" text-anchor="middle" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="8" font-weight="700" letter-spacing="3">[ ANTI-SURVEILLANCE ]</text>
            
            <!-- Inverted Brutalist Seal -->
            <polygon points="90,95 65,135 115,135" fill="none" stroke="${accent}" stroke-width="2"/>
            <text x="90" y="125" text-anchor="middle" fill="#fff" font-family="'Space Grotesk', monospace" font-size="12" font-weight="900">!</text>

            <text x="90" y="170" text-anchor="middle" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="15" font-weight="900" letter-spacing="3">BRAVADIAN</text>
            <text x="90" y="190" text-anchor="middle" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="9" font-weight="700" letter-spacing="2">STREET ARCHIVE 2026</text>
            <text x="90" y="214" text-anchor="middle" fill="#888" font-family="'Space Grotesk', monospace" font-size="7" letter-spacing="2">[ 240 GSM OVERSIZED ]</text>
          </g>
        `;
      } else {
        // Minimal or Default Statement Back
        artworkMarkup = `
          <g transform="translate(160, 175)">
            <rect x="0" y="0" width="180" height="200" rx="4" fill="#08080c" stroke="${accent}" stroke-width="1" stroke-dasharray="5,4"/>
            <text x="90" y="65" text-anchor="middle" fill="#ffffff" font-family="'Bebas Neue', sans-serif" font-size="20" font-weight="900" letter-spacing="4">BRAVADIAN</text>
            <text x="90" y="95" text-anchor="middle" fill="${accent}" font-family="'Bebas Neue', sans-serif" font-size="16" font-weight="900" letter-spacing="3">BRAVE INDIAN</text>
            <line x1="30" y1="115" x2="150" y2="115" stroke="${accent}" stroke-width="1.5"/>
            <text x="90" y="140" text-anchor="middle" fill="#bbb" font-family="'Space Grotesk', monospace" font-size="8.5" font-weight="700" letter-spacing="2">ARCHITECTURAL SILHOUETTE</text>
            <text x="90" y="165" text-anchor="middle" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="700" letter-spacing="3">[ 240 GSM // FRENCH TERRY ]</text>
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


        <!-- Ambient Floor Spotlight Shadow -->
        <ellipse cx="250" cy="570" rx="150" ry="24" fill="#000000" opacity="0.6" filter="blur(10px)"/>

        <!-- T-SHIRT SILHOUETTE GROUP (Perfect Centered Framing, No Zooming, No Cropping) -->
        <g filter="url(#studioShadow_${uniqueId})">
          
          <!-- Inner Back Collar Scoop (visible from front) -->
          ${viewType === 'front' ? `
            <path d="M 200 95 C 220 78, 280 78, 300 95 C 280 114, 220 114, 200 95 Z" fill="${innerNeckFill}"/>
            <!-- Woven Inside Neck Brand Label -->
            <rect x="232" y="85" width="36" height="18" rx="1.5" fill="#050508" stroke="#f59e0b" stroke-width="0.8"/>
            <text x="250" y="93" text-anchor="middle" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="4" font-weight="900" letter-spacing="0.5">BRAVADIAN</text>
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
      case '01': // ANIME - Manga-inspired artwork & Japanese animation
        emblemMarkup = `
          <g stroke="${strokeColor}" stroke-width="1.6" fill="none">
            <!-- Anime katana blade & stylized geometric burst -->
            <path d="M 70 230 L 230 100 L 245 115 L 85 245 Z" fill="${strokeColor}" fill-opacity="0.12"/>
            <line x1="60" y1="240" x2="240" y2="90" stroke="${strokeColor}" stroke-width="2.5"/>
            <polygon points="150,85 165,115 135,115" fill="${strokeColor}" fill-opacity="0.5"/>
            <circle cx="150" cy="165" r="45" stroke="${strokeColor}" stroke-dasharray="6,4"/>
            <path d="M 120 165 L 180 165 M 150 135 L 150 195" stroke="${strokeColor}" stroke-width="1.5"/>
            <text x="150" y="280" text-anchor="middle" fill="${strokeColor}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="3">MANGA // ANIME</text>
          </g>
        `;
        break;

      case '02': // MYTHOLOGY - Krishna, Shiva, Hanuman, Ramayana, Mahabharata
        emblemMarkup = `
          <g stroke="${strokeColor}" stroke-width="1.6" fill="none">
            <!-- Sacred Trishula & Sudarshana Solar Mandala -->
            <circle cx="150" cy="160" r="50" stroke="${strokeColor}" stroke-dasharray="3,3" opacity="0.8"/>
            <path d="M 150 90 L 150 240" stroke="${strokeColor}" stroke-width="2.5"/>
            <path d="M 120 120 C 120 165, 180 165, 180 120" stroke="${strokeColor}" stroke-width="2.2"/>
            <line x1="105" y1="110" x2="195" y2="110" stroke="${strokeColor}" stroke-width="1.8"/>
            <circle cx="150" cy="160" r="12" fill="${strokeColor}" fill-opacity="0.25"/>
            <circle cx="150" cy="160" r="4" fill="${strokeColor}"/>
            <text x="150" y="280" text-anchor="middle" fill="${strokeColor}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="3">SACRED MYTHOLOGY</text>
          </g>
        `;
        break;

      case '03': // HERITAGE - Indian crafts, folk art, traditional patterns & architecture
        emblemMarkup = `
          <g stroke="${strokeColor}" stroke-width="1.6" fill="none">
            <!-- Hoysala temple stepped shikhara & shrine relief -->
            <polygon points="150,85 225,180 75,180" fill="${strokeColor}" fill-opacity="0.08"/>
            <polygon points="150,110 205,180 95,180" opacity="0.6"/>
            <polygon points="150,135 185,180 115,180" opacity="0.4"/>
            <rect x="70" y="180" width="160" height="22" stroke="${strokeColor}"/>
            <rect x="85" y="202" width="130" height="22" stroke="${strokeColor}"/>
            <rect x="100" y="224" width="100" height="22" stroke="${strokeColor}"/>
            <rect x="135" y="190" width="30" height="56" fill="${strokeColor}" fill-opacity="0.2"/>
            <circle cx="150" cy="65" r="5" fill="${strokeColor}"/>
            <line x1="150" y1="65" x2="150" y2="85" stroke="${strokeColor}" stroke-width="2"/>
            <text x="150" y="280" text-anchor="middle" fill="${strokeColor}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="3">BHARAT HERITAGE</text>
          </g>
        `;
        break;

      case '04': // STREET CULTURE - Graffiti, urban graphics, hip-hop, typography
        emblemMarkup = `
          <g stroke="${strokeColor}" stroke-width="1.6" fill="none">
            <!-- Urban cross-hair & stencil typography frame -->
            <rect x="85" y="105" width="130" height="130" stroke="${strokeColor}" stroke-width="2"/>
            <rect x="95" y="115" width="110" height="110" stroke="${strokeColor}" stroke-dasharray="4,3" fill="${strokeColor}" fill-opacity="0.08"/>
            <line x1="70" y1="170" x2="230" y2="170" stroke="${strokeColor}" stroke-width="1.8"/>
            <line x1="150" y1="90" x2="150" y2="250" stroke="${strokeColor}" stroke-width="1.8"/>
            <polygon points="150,140 180,170 150,200 120,170" fill="${strokeColor}" fill-opacity="0.3"/>
            <text x="150" y="280" text-anchor="middle" fill="${strokeColor}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="3">STREET CULTURE</text>
          </g>
        `;
        break;

      case '05': // MINIMAL - Simple typography, subtle symbols, clean graphics
        emblemMarkup = `
          <g stroke="${strokeColor}" stroke-width="1.6" fill="none">
            <!-- Monolithic clean geometric lines & golden ratio square -->
            <rect x="100" y="115" width="100" height="100" stroke="${strokeColor}" stroke-width="1.8" fill="${strokeColor}" fill-opacity="0.05"/>
            <line x1="100" y1="165" x2="200" y2="165" stroke="${strokeColor}" stroke-width="1.2"/>
            <circle cx="150" cy="165" r="25" stroke="${strokeColor}" stroke-width="1.2"/>
            <circle cx="150" cy="165" r="3" fill="${strokeColor}"/>
            <text x="150" y="280" text-anchor="middle" fill="${strokeColor}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="4">MINIMAL // RAW</text>
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

  /* ==========================================================================
     HERITAGE 5-COLORWAY SPINE SILHOUETTE GENERATOR
     ========================================================================== */
  function createSpineTeeSVG(colorKey) {
    const key = (colorKey || 'black').toLowerCase();
    const config = {
      black: { name: 'BLACK', body: '#121216', rib: '#0a0a0d', highlight: '#1e1e26', print: '#ffffff', accent: '#e53935', bg: '#08080c' },
      ivory: { name: 'IVORY', body: '#ece3d2', rib: '#ded4c0', highlight: '#faf5eb', print: '#14120e', accent: '#e67e00', bg: '#1c1b18' },
      red:   { name: 'RED',   body: '#c81d25', rib: '#a8141b', highlight: '#e52b34', print: '#ffffff', accent: '#ffa000', bg: '#1a090b' },
      blue:  { name: 'BLUE',  body: '#1852b8', rib: '#103b8a', highlight: '#2563eb', print: '#ffffff', accent: '#ffa000', bg: '#09101d' },
      white: { name: 'WHITE', body: '#f7f7fa', rib: '#e4e4ec', highlight: '#ffffff', print: '#14120e', accent: '#e53935', bg: '#1a1a20' }
    }[key] || { name: 'BLACK', body: '#121216', rib: '#0a0a0d', highlight: '#1e1e26', print: '#ffffff', accent: '#e53935', bg: '#08080c' };

    const uid = 'spineTee_' + key;
    const isLightTee = key === 'ivory' || key === 'white';

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 625" width="500" height="625">
        <defs>
          <radialGradient id="bgGrad_${uid}" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stop-color="#22222c"/>
            <stop offset="60%" stop-color="#111116"/>
            <stop offset="100%" stop-color="#07070a"/>
          </radialGradient>
          <linearGradient id="teeBodyGrad_${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${config.highlight}"/>
            <stop offset="40%" stop-color="${config.body}"/>
            <stop offset="100%" stop-color="${isLightTee ? '#dedee6' : '#0a0a0e'}"/>
          </linearGradient>
          <filter id="shadow_${uid}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000" flood-opacity="0.85"/>
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="url(#bgGrad_${uid})"/>
        <ellipse cx="250" cy="570" rx="140" ry="22" fill="#000000" opacity="0.65" filter="blur(10px)"/>

        <!-- T-SHIRT SILHOUETTE -->
        <g filter="url(#shadow_${uid})">
          <!-- Inner Back Scoop -->
          <path d="M 200 95 C 220 78, 280 78, 300 95 C 280 114, 220 114, 200 95 Z" fill="${isLightTee ? '#cfd0d8' : '#070709'}"/>
          <rect x="232" y="85" width="36" height="18" rx="1.5" fill="#050508" stroke="#f59e0b" stroke-width="0.8"/>
          <text x="250" y="93" text-anchor="middle" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="4" font-weight="900" letter-spacing="0.5">BRAVADIAN</text>
          <text x="250" y="99" text-anchor="middle" fill="#f59e0b" font-family="'Space Grotesk', monospace" font-size="3.5" font-weight="700">240 GSM</text>

          <!-- Main Body -->
          <path d="M 200 95 
                   C 220 114, 280 114, 300 95 
                   L 410 160 
                   L 380 280 
                   L 330 250 
                   L 335 550 
                   L 165 550 
                   L 170 250 
                   L 120 280 
                   L 90 160 Z" 
                fill="url(#teeBodyGrad_${uid})" 
                stroke="${isLightTee ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)'}" 
                stroke-width="1.2"/>

          <!-- High-Tension Rib Collar -->
          <path d="M 200 95 C 220 114, 280 114, 300 95 C 280 84, 220 84, 200 95 Z" fill="${config.rib}" stroke="#ffa000" stroke-width="1"/>

          <!-- Drop Shoulder & Sleeve Seams -->
          <line x1="170" y1="250" x2="335" y2="250" stroke="${isLightTee ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}" stroke-width="1"/>
          <line x1="200" y1="95" x2="170" y2="250" stroke="${isLightTee ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)'}" stroke-width="1.2"/>
          <line x1="300" y1="95" x2="330" y2="250" stroke="${isLightTee ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.08)'}" stroke-width="1.2"/>

          <!-- SACRED VERTICAL SPINE ARTWORK -->
          <g transform="translate(250, 140)">
            <!-- Top Sacred Trishul -->
            <path d="M 0 0 L 0 30 M -12 8 C -12 24 12 24 12 8 L 12 0 M -12 0 L -12 8" fill="none" stroke="${config.print}" stroke-width="2.5" stroke-linecap="round"/>
            <polygon points="0,-4 3,0 -3,0" fill="${config.accent}"/>
            <circle cx="0" cy="18" r="3" fill="${config.accent}"/>

            <!-- Sacred Vertical Spine Text: हर हर महादेव -->
            <!-- HAR 1 -->
            <text x="0" y="55" text-anchor="middle" fill="${config.print}" font-family="'Tiro Devanagari Hindi', 'Noto Sans Devanagari', serif" font-size="22" font-weight="900">हर</text>
            <path d="M -24 50 C -16 46 -10 54 0 54 C 10 54 16 46 24 50" fill="none" stroke="${config.print}" stroke-width="1.2"/>
            <circle cx="0" cy="64" r="2.5" fill="${config.accent}"/>

            <!-- HAR 2 -->
            <text x="0" y="92" text-anchor="middle" fill="${config.print}" font-family="'Tiro Devanagari Hindi', 'Noto Sans Devanagari', serif" font-size="22" font-weight="900">हर</text>
            <path d="M -24 87 C -16 83 -10 91 0 91 C 10 91 16 83 24 87" fill="none" stroke="${config.print}" stroke-width="1.2"/>
            <circle cx="0" cy="101" r="2.5" fill="${config.accent}"/>

            <!-- MAHA -->
            <text x="0" y="130" text-anchor="middle" fill="${config.print}" font-family="'Tiro Devanagari Hindi', 'Noto Sans Devanagari', serif" font-size="22" font-weight="900">महा</text>
            <path d="M -26 125 C -18 120 -10 129 0 129 C 10 129 18 120 26 125" fill="none" stroke="${config.print}" stroke-width="1.2"/>
            <circle cx="0" cy="139" r="2.5" fill="${config.accent}"/>

            <!-- DEV -->
            <text x="0" y="168" text-anchor="middle" fill="${config.print}" font-family="'Tiro Devanagari Hindi', 'Noto Sans Devanagari', serif" font-size="22" font-weight="900">देव</text>
            <path d="M -26 163 C -18 158 -10 167 0 167 C 10 167 18 158 26 163" fill="none" stroke="${config.print}" stroke-width="1.2"/>
            <circle cx="0" cy="177" r="2.5" fill="${config.accent}"/>

            <!-- Vertebra Ribs Sequence -->
            <g transform="translate(0, 192)" stroke="${config.print}" stroke-width="1.5" fill="none">
              <path d="M 0 0 L -22 -6 M 0 0 L 22 -6"/>
              <path d="M 0 16 L -24 10 M 0 16 L 24 10"/>
              <path d="M 0 32 L -26 26 M 0 32 L 26 26"/>
              <path d="M 0 48 L -28 42 M 0 48 L 28 42"/>
              <path d="M 0 64 L -28 58 M 0 64 L 28 58"/>
              <path d="M 0 80 L -26 74 M 0 80 L 26 74"/>
              <path d="M 0 96 L -24 90 M 0 96 L 24 90"/>
              <line x1="0" y1="-8" x2="0" y2="108" stroke="${config.accent}" stroke-width="2"/>
            </g>

            <!-- Bottom Vajra / Spearhead Finial -->
            <g transform="translate(0, 316)">
              <polygon points="0,35 -14,10 -4,12 0,0 4,12 14,10" fill="${config.print}"/>
              <polygon points="0,28 -5,12 0,4 5,12" fill="${config.accent}"/>
              <path d="M -20 5 L -8 18 L 0 8 L 8 18 L 20 5" fill="none" stroke="${config.print}" stroke-width="1.5"/>
            </g>
          </g>
        </g>
      </svg>
    `.trim();

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // DEFAULT COLLECTIONS (Canon Chapters)
  const DEFAULT_COLLECTIONS = [
    { id: 'c-all', name: 'ALL', slug: 'all', description: 'Browse and secure your relics from our structural multi-chapter manifest. Every garment is heavily engineered in 240+ GSM and strictly numbered.', isActive: true, order: 0 },
    { id: 'c-anime', name: 'ANIME', slug: 'anime', description: 'Anime characters, manga-inspired artwork, Japanese animation.', isActive: true, order: 1 },
    { id: 'c-mythology', name: 'MYTHOLOGY', slug: 'mythology', description: 'Krishna, Shiva, Hanuman, Ramayana, Mahabharata, deities, mythological stories.', isActive: true, order: 2 },
    { id: 'c-heritage', name: 'HERITAGE', slug: 'heritage', description: 'Indian crafts, folk art, traditional patterns, architecture, cultural symbols, regional traditions.', isActive: true, order: 3 },
    { id: 'c-street-culture', name: 'STREET CULTURE', slug: 'street-culture', description: 'Graffiti, urban graphics, hip-hop, typography, rebellious/contemporary designs.', isActive: true, order: 4 },
    { id: 'c-minimal', name: 'MINIMAL', slug: 'minimal', description: 'Simple typography, subtle symbols, clean graphics, understated designs.', isActive: true, order: 5 }
  ];

  /* ==========================================================================
     THE ARCHIVE UNIVERSE CHAPTERS
     ========================================================================== */
  const DEFAULT_UNIVERSE_CHAPTERS = [
    { num: '01', name: 'ANIME', slug: 'anime', chapter: 'CHAPTER 01: MANGA & ANIME', category: 'active', statusBadge: 'ACTIVE DROP', isLive: true, image: null, description: 'Anime characters, manga-inspired artwork, Japanese animation.' },
    { num: '02', name: 'MYTHOLOGY', slug: 'mythology', chapter: 'CHAPTER 02: SACRED MYTHOLOGY', category: 'active', statusBadge: 'ACTIVE DROP', isLive: true, image: null, description: 'Krishna, Shiva, Hanuman, Ramayana, Mahabharata, deities, mythological stories.' },
    { num: '03', name: 'HERITAGE', slug: 'heritage', chapter: 'CHAPTER 03: BHARAT HERITAGE', category: 'active', statusBadge: 'ACTIVE DROP', isLive: true, image: null, description: 'Indian crafts, folk art, traditional patterns, architecture, cultural symbols, regional traditions.' },
    { num: '04', name: 'STREET CULTURE', slug: 'street-culture', chapter: 'CHAPTER 04: URBAN STREET CULTURE', category: 'active', statusBadge: 'ACTIVE DROP', isLive: true, image: null, description: 'Graffiti, urban graphics, hip-hop, typography, rebellious/contemporary designs.' },
    { num: '05', name: 'MINIMAL', slug: 'minimal', chapter: 'CHAPTER 05: MONOLITHIC MINIMAL', category: 'active', statusBadge: 'ACTIVE DROP', isLive: true, image: null, description: 'Simple typography, subtle symbols, clean graphics, understated designs.' }
  ];

  /* ==========================================================================
     THE ARCHIVE EDITIONS CONFIGURATION
     ========================================================================== */
  const TEN_ARCHIVE_EDITIONS = [
    { num: '01', title: 'ANIME', desc: 'CHAPTER 01: MANGA & ANIME', status: 'active', slug: 'anime' },
    { num: '02', title: 'MYTHOLOGY', desc: 'CHAPTER 02: SACRED MYTHOLOGY', status: 'active', slug: 'mythology' },
    { num: '03', title: 'HERITAGE', desc: 'CHAPTER 03: BHARAT HERITAGE', status: 'active', slug: 'heritage' },
    { num: '04', title: 'STREET CULTURE', desc: 'CHAPTER 04: URBAN STREET CULTURE', status: 'active', slug: 'street-culture' },
    { num: '05', title: 'MINIMAL', desc: 'CHAPTER 05: MONOLITHIC MINIMAL', status: 'active', slug: 'minimal' }
  ];

  // DEFAULT SIZE GUIDE
  const DEFAULT_SIZE_GUIDE = [
    { size: 'S', chest: 40, length: 26, shoulder: null, sleeve: null },
    { size: 'M', chest: 42, length: 27, shoulder: null, sleeve: null },
    { size: 'L', chest: 44, length: 28, shoulder: null, sleeve: null },
    { size: 'XL', chest: 46, length: 29, shoulder: null, sleeve: null },
    { size: 'XXL', chest: 48, length: 30, shoulder: null, sleeve: null }
  ];

  // DEFAULT SITE SETTINGS
  const DEFAULT_SETTINGS = {
    brandName: 'BRAVADIAN',
    tagline: 'BRAVE INDIAN',
    currency: '₹',
    whatsappNumber: '917975362526',
    instagramUrl: 'https://www.instagram.com/bravadian.in',
    supportEmail: 'bravadian.clothing@gmail.com',
    shippingFee: 99,
    launchEndsAt: '2026-10-01T23:59:59+05:30',
    freeShippingThreshold: 1999,
    estimatedDays: '3–5 Business Days',
    supabaseUrl: '',
    supabaseAnonKey: ''
  };

  // DEFAULT PRODUCTS with Variant-Level Inventory
  const DEFAULT_PRODUCTS = [
    {
      id: 'prod-013',
      name: 'BHARAT SPIRIT TEE',
      slug: 'bharat-spirit-tee',
      description: 'The peacock, the tiger, the lotus and the elephant, four symbols of India drawn together as one story. Oversized 240 GSM French Terry cotton, bio + silicone washed, with a large DTF back print and the Bi mark on the chest.',
      price: 699,
      comparePrice: 799,
      launchPrice: 649,
      collection: 'heritage',
      tags: ['oversized', 'heritage', 'peacock', 'tiger', 'lotus', 'elephant', '240gsm'],
      fabric: '240 GSM FRENCH TERRY // BIO + SILICONE WASH',
      gsm: 240,
      fit: 'Oversized Drop-Shoulder',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      story: 'Four symbols every Indian grows up with, drawn as one living composition. Built around the idea that pride in where you come from can be worn every day, not saved for special occasions.',
      motif: 'Peacock, the national bird, for grace. Tiger, the national animal, for courage. Lotus, the national flower, for rising clean from the mud. Elephant, the national heritage animal, for memory and strength.',
      relicTag: 'DESIGN 01',
      relicBadge: 'NEW DROP',
      sku: 'BRVD-BHS-01',
      featured: true,
      newDrop: true,
      isComingSoon: false,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: 'images/products/bharat-spirit/back-print.webp',
        back: 'images/products/bharat-spirit/front.webp',
        closeup: 'images/products/bharat-spirit/closeup.webp',
        lifestyle: 'images/products/bharat-spirit/worn-studio.webp',
        lifestyle2: 'images/products/bharat-spirit/worn-temple.webp?v=3'
      },
      variants: [
        { color: 'Black', size: 'S', stock: 10 },
        { color: 'Black', size: 'M', stock: 10 },
        { color: 'Black', size: 'L', stock: 10 },
        { color: 'Black', size: 'XL', stock: 10 },
        { color: 'Black', size: 'XXL', stock: 10 },
        { color: 'White', size: 'S', stock: 10 },
        { color: 'White', size: 'M', stock: 10 },
        { color: 'White', size: 'L', stock: 10 },
        { color: 'White', size: 'XL', stock: 10 },
        { color: 'White', size: 'XXL', stock: 10 },
        { color: 'Red', size: 'S', stock: 10 },
        { color: 'Red', size: 'M', stock: 10 },
        { color: 'Red', size: 'L', stock: 10 },
        { color: 'Red', size: 'XL', stock: 10 },
        { color: 'Red', size: 'XXL', stock: 10 },
        { color: 'Royal Blue', size: 'S', stock: 10 },
        { color: 'Royal Blue', size: 'M', stock: 10 },
        { color: 'Royal Blue', size: 'L', stock: 10 },
        { color: 'Royal Blue', size: 'XL', stock: 10 },
        { color: 'Royal Blue', size: 'XXL', stock: 10 }
      ]
    },
    {
      id: 'prod-001',
      name: 'HOYSALA OVERSIZED RELIC TEE',
      slug: 'hoysala-oversized-relic-tee',
      description: 'A severe tactical garment engineered from 240 GSM heavyweight French Terry. Imprinted with sacred architectural friezes from the historic Halebidu temple complex, modified as modern metropolitan armor.',
      price: 699,
      comparePrice: 799,
      launchPrice: 649,
      collection: 'heritage',
      tags: ['oversized', 'hoysala', 'heavyweight', '280gsm', 'heritage'],
      fabric: '240 GSM FRENCH TERRY // BIO + SILICONE WASH',
      gsm: 240,
      fit: 'Oversized Boxy',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'RELIC 01',
      relicBadge: 'NEW DROP',
      sku: 'BRVD-HYS-01',
      featured: true,
      newDrop: true,
      isComingSoon: false,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('HOYSALA OVERSIZED RELIC TEE', 'Heritage', '#111116', '#FFA000', 'front'),
        back: createTeeSVG('HOYSALA OVERSIZED RELIC TEE', 'Heritage', '#111116', '#FFA000', 'back'),
        closeup: createTeeSVG('HOYSALA OVERSIZED RELIC TEE', 'Heritage', '#111116', '#FFA000', 'closeup'),
        lifestyle: createTeeSVG('HOYSALA OVERSIZED RELIC TEE', 'Heritage', '#111116', '#FFA000', 'lifestyle')
      },
      variants: [
        { color: 'Black', size: 'S', stock: 8 },
        { color: 'Black', size: 'M', stock: 15 },
        { color: 'Black', size: 'L', stock: 12 },
        { color: 'Black', size: 'XL', stock: 6 },
        { color: 'Black', size: 'XXL', stock: 4 },
        { color: 'White', size: 'S', stock: 4 },
        { color: 'White', size: 'M', stock: 8 },
        { color: 'White', size: 'L', stock: 6 },
        { color: 'White', size: 'XL', stock: 0 },
        { color: 'White', size: 'XXL', stock: 2 },
        { color: 'Red', size: 'S', stock: 8 },
        { color: 'Red', size: 'M', stock: 15 },
        { color: 'Red', size: 'L', stock: 12 },
        { color: 'Red', size: 'XL', stock: 6 },
        { color: 'Red', size: 'XXL', stock: 4 },
        { color: 'Royal Blue', size: 'S', stock: 8 },
        { color: 'Royal Blue', size: 'M', stock: 15 },
        { color: 'Royal Blue', size: 'L', stock: 12 },
        { color: 'Royal Blue', size: 'XL', stock: 6 },
        { color: 'Royal Blue', size: 'XXL', stock: 4 }
      ]
    },
    {
      id: 'prod-002',
      name: 'HOYSALA LINGESHWARA RELIC TEE',
      slug: 'hoysala-lingeshwara-relic-tee',
      description: 'Engineered boxy heavyweight silhouette featuring the sacred Lingeshwara stone sanctuary geometry across dropped shoulder lines.',
      price: 699,
      comparePrice: 799,
      launchPrice: 649,
      collection: 'heritage',
      tags: ['heritage', 'hoysala', 'lingeshwara', 'heavyweight', '240gsm'],
      fabric: '240 GSM FRENCH TERRY // BIO + SILICONE WASH',
      gsm: 240,
      fit: 'Boxy Drop Shoulder',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'RELIC 02',
      relicBadge: 'NEW DROP',
      sku: 'BRVD-LNG-02',
      featured: true,
      newDrop: true,
      isComingSoon: false,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('HOYSALA LINGESHWARA', 'Heritage', '#111116', '#FFA000', 'front'),
        back: createTeeSVG('HOYSALA LINGESHWARA', 'Heritage', '#111116', '#FFA000', 'back'),
        closeup: createTeeSVG('HOYSALA LINGESHWARA', 'Heritage', '#111116', '#FFA000', 'closeup'),
        lifestyle: createTeeSVG('HOYSALA LINGESHWARA', 'Heritage', '#111116', '#FFA000', 'lifestyle')
      },
      variants: [
        { color: 'Black', size: 'S', stock: 6 },
        { color: 'Black', size: 'M', stock: 10 },
        { color: 'Black', size: 'L', stock: 8 },
        { color: 'Black', size: 'XL', stock: 4 },
        { color: 'Black', size: 'XXL', stock: 3 },
        { color: 'White', size: 'S', stock: 6 },
        { color: 'White', size: 'M', stock: 10 },
        { color: 'White', size: 'L', stock: 8 },
        { color: 'White', size: 'XL', stock: 4 },
        { color: 'White', size: 'XXL', stock: 3 },
        { color: 'Red', size: 'S', stock: 6 },
        { color: 'Red', size: 'M', stock: 10 },
        { color: 'Red', size: 'L', stock: 8 },
        { color: 'Red', size: 'XL', stock: 4 },
        { color: 'Red', size: 'XXL', stock: 3 },
        { color: 'Royal Blue', size: 'S', stock: 6 },
        { color: 'Royal Blue', size: 'M', stock: 10 },
        { color: 'Royal Blue', size: 'L', stock: 8 },
        { color: 'Royal Blue', size: 'XL', stock: 4 },
        { color: 'Royal Blue', size: 'XXL', stock: 3 }
      ]
    },
    {
      id: 'prod-003',
      name: 'SRI YOGA SARASVATHESHWARA TEE',
      slug: 'sri-yoga-sarasvatheshwara-tee',
      description: 'Monumental archival 240 GSM cotton tee presenting the multi-armed Yogic sovereign deity in pure metallic gold foil screenprint.',
      price: 699,
      comparePrice: 799,
      launchPrice: 649,
      collection: 'mythology',
      tags: ['mythology', 'deities', 'krishna', 'shiva', 'gold-foil', '300gsm', 'yoga'],
      fabric: '240 GSM FRENCH TERRY // BIO + SILICONE WASH',
      gsm: 240,
      fit: 'Architectural Boxy',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'RELIC 03',
      relicBadge: 'NEW DROP',
      sku: 'BRVD-YOG-03',
      featured: true,
      newDrop: true,
      isComingSoon: false,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('SRI YOGA SARASVATHESHWARA', 'Mythology', '#0c0c10', '#FFA000', 'front'),
        back: createTeeSVG('SRI YOGA SARASVATHESHWARA', 'Mythology', '#0c0c10', '#FFA000', 'back'),
        closeup: createTeeSVG('SRI YOGA SARASVATHESHWARA', 'Mythology', '#0c0c10', '#FFA000', 'closeup'),
        lifestyle: createTeeSVG('SRI YOGA SARASVATHESHWARA', 'Mythology', '#0c0c10', '#FFA000', 'lifestyle')
      },
      variants: [
        { color: 'Black', size: 'S', stock: 7 },
        { color: 'Black', size: 'M', stock: 12 },
        { color: 'Black', size: 'L', stock: 9 },
        { color: 'Black', size: 'XL', stock: 5 },
        { color: 'Black', size: 'XXL', stock: 3 },
        { color: 'White', size: 'S', stock: 7 },
        { color: 'White', size: 'M', stock: 12 },
        { color: 'White', size: 'L', stock: 9 },
        { color: 'White', size: 'XL', stock: 5 },
        { color: 'White', size: 'XXL', stock: 3 },
        { color: 'Red', size: 'S', stock: 7 },
        { color: 'Red', size: 'M', stock: 12 },
        { color: 'Red', size: 'L', stock: 9 },
        { color: 'Red', size: 'XL', stock: 5 },
        { color: 'Red', size: 'XXL', stock: 3 },
        { color: 'Royal Blue', size: 'S', stock: 7 },
        { color: 'Royal Blue', size: 'M', stock: 12 },
        { color: 'Royal Blue', size: 'L', stock: 9 },
        { color: 'Royal Blue', size: 'XL', stock: 5 },
        { color: 'Royal Blue', size: 'XXL', stock: 3 }
      ]
    },
    {
      id: 'prod-004',
      name: 'NRITYA PRIMACY DESCENSION JACKET',
      slug: 'nritya-primacy-descension-jacket',
      description: 'Heavyweight tactical bomber constructed in 450 GSM canvas shell with custom antique brass zippers, rib knit cuffs, and tonal warrior embroidery.',
      price: 6500,
      comparePrice: 7999,
      collection: 'heritage',
      tags: ['heritage', 'indian-craft', 'jacket', 'bomber', 'nritya', '450gsm'],
      fabric: '450 GSM DUCK CANVAS // BOMBER ARCHITECTURE',
      gsm: 450,
      fit: 'Bomber Flight Cut',
      material: '450 GSM Heavy Canvas & Satin Lining',
      relicTag: 'ARTIFACT 04',
      relicBadge: 'NEW DROP',
      sku: 'BRVD-NRT-04',
      featured: true,
      newDrop: true,
      isComingSoon: false,
      status: 'PUBLISHED',
      colors: ['Black'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('NRITYA PRIMACY BOMBER', 'Heritage', '#121218', '#f59e0b', 'front'),
        back: createTeeSVG('NRITYA PRIMACY BOMBER', 'Heritage', '#121218', '#f59e0b', 'back'),
        closeup: createTeeSVG('NRITYA PRIMACY BOMBER', 'Heritage', '#121218', '#f59e0b', 'closeup'),
        lifestyle: createTeeSVG('NRITYA PRIMACY BOMBER', 'Heritage', '#121218', '#f59e0b', 'lifestyle')
      },
      variants: [
        { color: 'Black', size: 'S', stock: 5 },
        { color: 'Black', size: 'M', stock: 8 },
        { color: 'Black', size: 'L', stock: 6 },
        { color: 'Black', size: 'XL', stock: 3 },
        { color: 'Black', size: 'XXL', stock: 2 }
      ]
    },
    {
      id: 'prod-005',
      name: 'ASURA SOLAR FIRE OVERSIZED TEE',
      slug: 'asura-solar-fire-oversized-tee',
      description: 'Sun-burnt charcoal compact jersey featuring high-density sacred Sanskrit hymn "ॐ सह नाववतु" and radiating solar celestial sigil.',
      price: 699,
      comparePrice: 799,
      launchPrice: 649,
      collection: 'mythology',
      tags: ['mythology', 'shiva', 'ramayana', 'solar-fire', '280gsm', 'oversized'],
      fabric: '240 GSM FRENCH TERRY // BIO + SILICONE WASH',
      gsm: 240,
      fit: 'Relaxed Drop-Shoulder',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'RELIC 05',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-ASR-05',
      featured: true,
      newDrop: true,
      isComingSoon: false,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('ASURA SOLAR FIRE', 'Mythology', '#1a1816', '#ff5722', 'front'),
        back: createTeeSVG('ASURA SOLAR FIRE', 'Mythology', '#1a1816', '#ff5722', 'back'),
        closeup: createTeeSVG('ASURA SOLAR FIRE', 'Mythology', '#1a1816', '#ff5722', 'closeup'),
        lifestyle: createTeeSVG('ASURA SOLAR FIRE', 'Mythology', '#1a1816', '#ff5722', 'lifestyle')
      },
      variants: [
        { color: 'Black', size: 'S', stock: 7 },
        { color: 'Black', size: 'M', stock: 11 },
        { color: 'Black', size: 'L', stock: 8 },
        { color: 'Black', size: 'XL', stock: 4 },
        { color: 'Black', size: 'XXL', stock: 2 },
        { color: 'White', size: 'S', stock: 7 },
        { color: 'White', size: 'M', stock: 11 },
        { color: 'White', size: 'L', stock: 8 },
        { color: 'White', size: 'XL', stock: 4 },
        { color: 'White', size: 'XXL', stock: 2 },
        { color: 'Red', size: 'S', stock: 7 },
        { color: 'Red', size: 'M', stock: 11 },
        { color: 'Red', size: 'L', stock: 8 },
        { color: 'Red', size: 'XL', stock: 4 },
        { color: 'Red', size: 'XXL', stock: 2 },
        { color: 'Royal Blue', size: 'S', stock: 7 },
        { color: 'Royal Blue', size: 'M', stock: 11 },
        { color: 'Royal Blue', size: 'L', stock: 8 },
        { color: 'Royal Blue', size: 'XL', stock: 4 },
        { color: 'Royal Blue', size: 'XXL', stock: 2 }
      ]
    },
    {
      id: 'prod-006',
      name: 'BERUNDA DUAL VISION ARMOR TEE',
      slug: 'berunda-dual-vision-armor-tee',
      description: '240 GSM heavyweight cotton tee with monumental twin-headed Gandaberunda imperial crest rendered in antique gold embroidery.',
      price: 699,
      comparePrice: 799,
      launchPrice: 649,
      collection: 'heritage',
      tags: ['heritage', 'berunda', 'traditional-patterns', 'cultural-symbols', 'embroidery', '280gsm', 'armor'],
      fabric: '240 GSM FRENCH TERRY // BIO + SILICONE WASH',
      gsm: 240,
      fit: 'Oversized',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'RELIC 06',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-BRD-06',
      featured: true,
      newDrop: true,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('BERUNDA DUAL VISION', 'Heritage', '#0a0a0e', '#FFA000', 'front'),
        back: createTeeSVG('BERUNDA DUAL VISION', 'Heritage', '#0a0a0e', '#FFA000', 'back'),
        closeup: createTeeSVG('BERUNDA DUAL VISION', 'Heritage', '#0a0a0e', '#FFA000', 'closeup'),
        lifestyle: createTeeSVG('BERUNDA DUAL VISION', 'Heritage', '#0a0a0e', '#FFA000', 'lifestyle')
      },
      variants: [
        { color: 'Black', size: 'S', stock: 5 },
        { color: 'Black', size: 'M', stock: 8 },
        { color: 'Black', size: 'L', stock: 6 },
        { color: 'Black', size: 'XL', stock: 3 },
        { color: 'Black', size: 'XXL', stock: 2 },
        { color: 'White', size: 'S', stock: 5 },
        { color: 'White', size: 'M', stock: 8 },
        { color: 'White', size: 'L', stock: 6 },
        { color: 'White', size: 'XL', stock: 3 },
        { color: 'White', size: 'XXL', stock: 2 },
        { color: 'Red', size: 'S', stock: 5 },
        { color: 'Red', size: 'M', stock: 8 },
        { color: 'Red', size: 'L', stock: 6 },
        { color: 'Red', size: 'XL', stock: 3 },
        { color: 'Red', size: 'XXL', stock: 2 },
        { color: 'Royal Blue', size: 'S', stock: 5 },
        { color: 'Royal Blue', size: 'M', stock: 8 },
        { color: 'Royal Blue', size: 'L', stock: 6 },
        { color: 'Royal Blue', size: 'XL', stock: 3 },
        { color: 'Royal Blue', size: 'XXL', stock: 2 }
      ]
    },
    {
      id: 'prod-007',
      name: 'BRAVADIAN NINETAILS',
      slug: 'bravadian-ninetails',
      description: '240 GSM heavyweight oversized silhouette featuring high-density back-print of the mythical celestial fox spirit. Constructed with double-combed long-staple yarns for architectural boxy drape.',
      price: 699,
      comparePrice: 799,
      launchPrice: 649,
      collection: 'anime',
      tags: ['anime', 'manga', 'japanese-animation', 'ninetails', 'oversized', '240gsm'],
      fabric: '240 GSM FRENCH TERRY // BIO + SILICONE WASH',
      gsm: 240,
      fit: 'Oversized',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'ARCHIVE 07',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-NT-07',
      featured: false,
      newDrop: false,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
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
        { color: 'White', size: 'XXL', stock: 1 },
        { color: 'Red', size: 'S', stock: 8 },
        { color: 'Red', size: 'M', stock: 12 },
        { color: 'Red', size: 'L', stock: 0 },
        { color: 'Red', size: 'XL', stock: 5 },
        { color: 'Red', size: 'XXL', stock: 2 },
        { color: 'Royal Blue', size: 'S', stock: 8 },
        { color: 'Royal Blue', size: 'M', stock: 12 },
        { color: 'Royal Blue', size: 'L', stock: 0 },
        { color: 'Royal Blue', size: 'XL', stock: 5 },
        { color: 'Royal Blue', size: 'XXL', stock: 2 }
      ]
    },
    {
      id: 'prod-008',
      name: 'BRAVADIAN GARUDA REBEL',
      slug: 'bravadian-garuda-rebel',
      description: 'An ode to the supreme avian sovereign. Geometric feathered wingspan printed in reflective metallic pigments across dropped shoulder seams on 240 GSM heavy French cotton.',
      price: 699,
      comparePrice: 799,
      launchPrice: 649,
      collection: 'mythology',
      tags: ['mythology', 'garuda', 'deities', 'mythological-stories', 'heavyweight', '240gsm'],
      fabric: '240 GSM FRENCH TERRY // BIO + SILICONE WASH',
      gsm: 240,
      fit: 'Oversized',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'ARCHIVE 08',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-GRD-08',
      featured: true,
      newDrop: false,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('BRAVADIAN GARUDA', 'Mythology', '#16161c', '#f59e0b', 'front'),
        back: createTeeSVG('BRAVADIAN GARUDA', 'Mythology', '#16161c', '#f59e0b', 'back'),
        closeup: createTeeSVG('BRAVADIAN GARUDA', 'Mythology', '#16161c', '#f59e0b', 'closeup'),
        lifestyle: createTeeSVG('BRAVADIAN GARUDA', 'Mythology', '#16161c', '#f59e0b', 'lifestyle')
      },
      variants: [
        { color: 'Black', size: 'S', stock: 7 },
        { color: 'Black', size: 'M', stock: 10 },
        { color: 'Black', size: 'L', stock: 4 },
        { color: 'Black', size: 'XL', stock: 3 },
        { color: 'Black', size: 'XXL', stock: 0 },
        { color: 'White', size: 'S', stock: 5 },
        { color: 'White', size: 'M', stock: 8 },
        { color: 'White', size: 'L', stock: 6 },
        { color: 'White', size: 'XL', stock: 0 },
        { color: 'White', size: 'XXL', stock: 3 },
        { color: 'Red', size: 'S', stock: 5 },
        { color: 'Red', size: 'M', stock: 8 },
        { color: 'Red', size: 'L', stock: 6 },
        { color: 'Red', size: 'XL', stock: 0 },
        { color: 'Red', size: 'XXL', stock: 3 },
        { color: 'Royal Blue', size: 'S', stock: 5 },
        { color: 'Royal Blue', size: 'M', stock: 8 },
        { color: 'Royal Blue', size: 'L', stock: 6 },
        { color: 'Royal Blue', size: 'XL', stock: 0 },
        { color: 'Royal Blue', size: 'XXL', stock: 3 }
      ]
    },
    {
      id: 'prod-009',
      name: 'BRAVADIAN MONOLITH BHARAT',
      slug: 'bravadian-monolith-bharat',
      description: 'Rooted in Indian soil. 240 GSM high-density knit featuring brutalist longitude coordinates (28°36 N 77°12 E) and architectural Ashoka geometry across the back yoke.',
      price: 699,
      comparePrice: 799,
      launchPrice: 649,
      collection: 'heritage',
      tags: ['heritage', 'bharat', 'architecture', 'cultural-symbols', 'oversized', '240gsm'],
      fabric: '240 GSM FRENCH TERRY // BIO + SILICONE WASH',
      gsm: 240,
      fit: 'Oversized',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'ARCHIVE 09',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-BHT-09',
      featured: true,
      newDrop: true,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
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
        { color: 'White', size: 'S', stock: 6 },
        { color: 'White', size: 'M', stock: 7 },
        { color: 'White', size: 'L', stock: 5 },
        { color: 'White', size: 'XL', stock: 0 },
        { color: 'White', size: 'XXL', stock: 2 },
        { color: 'Red', size: 'S', stock: 12 },
        { color: 'Red', size: 'M', stock: 15 },
        { color: 'Red', size: 'L', stock: 8 },
        { color: 'Red', size: 'XL', stock: 6 },
        { color: 'Red', size: 'XXL', stock: 4 },
        { color: 'Royal Blue', size: 'S', stock: 12 },
        { color: 'Royal Blue', size: 'M', stock: 15 },
        { color: 'Royal Blue', size: 'L', stock: 8 },
        { color: 'Royal Blue', size: 'XL', stock: 6 },
        { color: 'Royal Blue', size: 'XXL', stock: 4 }
      ]
    },
    {
      id: 'prod-010',
      name: 'BRAVADIAN CYBER REBEL',
      slug: 'bravadian-cyber-rebel',
      description: 'Underground dystopian Indian streetwear. High-impact typography with anti-surveillance warning tapes engineered on 240 GSM ultra-heavy cotton.',
      price: 699,
      comparePrice: 799,
      launchPrice: 649,
      collection: 'street-culture',
      tags: ['street-culture', 'typography', 'graffiti', 'urban', 'rebellious', 'oversized', '240gsm'],
      fabric: '240 GSM FRENCH TERRY // BIO + SILICONE WASH',
      gsm: 240,
      fit: 'Oversized',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'ARCHIVE 10',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-CR-10',
      featured: false,
      newDrop: false,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('BRAVADIAN CYBER', 'Street Culture', '#0a0a0e', '#ff4d00', 'front'),
        back: createTeeSVG('BRAVADIAN CYBER', 'Street Culture', '#0a0a0e', '#ff4d00', 'back'),
        closeup: createTeeSVG('BRAVADIAN CYBER', 'Street Culture', '#0a0a0e', '#ff4d00', 'closeup'),
        lifestyle: createTeeSVG('BRAVADIAN CYBER', 'Street Culture', '#0a0a0e', '#ff4d00', 'lifestyle')
      },
      variants: [
        { color: 'Black', size: 'S', stock: 4 },
        { color: 'Black', size: 'M', stock: 6 },
        { color: 'Black', size: 'L', stock: 3 },
        { color: 'Black', size: 'XL', stock: 2 },
        { color: 'Black', size: 'XXL', stock: 0 },
        { color: 'White', size: 'S', stock: 4 },
        { color: 'White', size: 'M', stock: 6 },
        { color: 'White', size: 'L', stock: 3 },
        { color: 'White', size: 'XL', stock: 2 },
        { color: 'White', size: 'XXL', stock: 0 },
        { color: 'Red', size: 'S', stock: 4 },
        { color: 'Red', size: 'M', stock: 6 },
        { color: 'Red', size: 'L', stock: 3 },
        { color: 'Red', size: 'XL', stock: 2 },
        { color: 'Red', size: 'XXL', stock: 0 },
        { color: 'Royal Blue', size: 'S', stock: 4 },
        { color: 'Royal Blue', size: 'M', stock: 6 },
        { color: 'Royal Blue', size: 'L', stock: 3 },
        { color: 'Royal Blue', size: 'XL', stock: 2 },
        { color: 'Royal Blue', size: 'XXL', stock: 0 }
      ]
    },
    {
      id: 'prod-011',
      name: 'BRAVADIAN ESSENTIAL 240',
      slug: 'bravadian-essential-240',
      description: 'Zero graphics. Zero noise. Pure structural drape, thick 1.25" Lycra rib collar, and drop-shoulder presence. Designed to outlast seasonal trends.',
      price: 699,
      comparePrice: 799,
      launchPrice: 649,
      collection: 'minimal',
      tags: ['minimal', 'essential', 'clean-graphics', 'understated', 'simple-typography', '240gsm'],
      fabric: '240 GSM FRENCH TERRY // BIO + SILICONE WASH',
      gsm: 240,
      fit: 'Oversized',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'ARCHIVE 11',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-ES-11',
      featured: false,
      newDrop: false,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('BRAVADIAN ESSENTIAL', 'Minimal', '#0e0e12', '#ffffff', 'front'),
        back: createTeeSVG('BRAVADIAN ESSENTIAL', 'Minimal', '#0e0e12', '#ffffff', 'back'),
        closeup: createTeeSVG('BRAVADIAN ESSENTIAL', 'Minimal', '#0e0e12', '#ffffff', 'closeup'),
        lifestyle: createTeeSVG('BRAVADIAN ESSENTIAL', 'Minimal', '#0e0e12', '#ffffff', 'lifestyle')
      },
      variants: [
        { color: 'Black', size: 'S', stock: 20 },
        { color: 'Black', size: 'M', stock: 25 },
        { color: 'Black', size: 'L', stock: 18 },
        { color: 'Black', size: 'XL', stock: 15 },
        { color: 'Black', size: 'XXL', stock: 8 },
        { color: 'White', size: 'S', stock: 10 },
        { color: 'White', size: 'M', stock: 14 },
        { color: 'White', size: 'L', stock: 9 },
        { color: 'White', size: 'XL', stock: 5 },
        { color: 'White', size: 'XXL', stock: 4 },
        { color: 'Red', size: 'S', stock: 20 },
        { color: 'Red', size: 'M', stock: 25 },
        { color: 'Red', size: 'L', stock: 18 },
        { color: 'Red', size: 'XL', stock: 15 },
        { color: 'Red', size: 'XXL', stock: 8 },
        { color: 'Royal Blue', size: 'S', stock: 20 },
        { color: 'Royal Blue', size: 'M', stock: 25 },
        { color: 'Royal Blue', size: 'L', stock: 18 },
        { color: 'Royal Blue', size: 'XL', stock: 15 },
        { color: 'Royal Blue', size: 'XXL', stock: 8 }
      ]
    },
    {
      id: 'prod-012',
      name: 'BRAVADIAN ASHOKA EMBER',
      slug: 'bravadian-ashoka-ember',
      description: 'Unreleased archive drop. 24-spoke Solar Chakra motif in neon solar ember across the chest and oversized drop spine. Limited to 500 numbered pieces.',
      price: 699,
      comparePrice: 799,
      launchPrice: 649,
      collection: 'heritage',
      tags: ['heritage', 'ashoka', 'cultural-symbols', 'traditional-patterns', 'limited', '240gsm'],
      fabric: '240 GSM FRENCH TERRY // BIO + SILICONE WASH',
      gsm: 240,
      fit: 'Oversized',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'ARCHIVE 12',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-ASH-12',
      featured: true,
      newDrop: true,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('BRAVADIAN ASHOKA', 'Heritage', '#0c0c10', '#ff4d00', 'front'),
        back: createTeeSVG('BRAVADIAN ASHOKA', 'Heritage', '#0c0c10', '#ff4d00', 'back'),
        closeup: createTeeSVG('BRAVADIAN ASHOKA', 'Heritage', '#0c0c10', '#ff4d00', 'closeup'),
        lifestyle: createTeeSVG('BRAVADIAN ASHOKA', 'New Drop', '#0c0c10', '#ff4d00', 'lifestyle')
      },
      variants: [
        { color: 'Black', size: 'S', stock: 5 },
        { color: 'Black', size: 'M', stock: 7 },
        { color: 'Black', size: 'L', stock: 4 },
        { color: 'Black', size: 'XL', stock: 0 },
        { color: 'Black', size: 'XXL', stock: 2 },
        { color: 'White', size: 'S', stock: 5 },
        { color: 'White', size: 'M', stock: 7 },
        { color: 'White', size: 'L', stock: 4 },
        { color: 'White', size: 'XL', stock: 0 },
        { color: 'White', size: 'XXL', stock: 2 },
        { color: 'Red', size: 'S', stock: 5 },
        { color: 'Red', size: 'M', stock: 7 },
        { color: 'Red', size: 'L', stock: 4 },
        { color: 'Red', size: 'XL', stock: 0 },
        { color: 'Red', size: 'XXL', stock: 2 },
        { color: 'Royal Blue', size: 'S', stock: 5 },
        { color: 'Royal Blue', size: 'M', stock: 7 },
        { color: 'Royal Blue', size: 'L', stock: 4 },
        { color: 'Royal Blue', size: 'XL', stock: 0 },
        { color: 'Royal Blue', size: 'XXL', stock: 2 }
      ]
    }
  ];

  // BRAVADIAN DATA STORAGE CONTROLLER
  // Public project URL + anon (publishable) key. Safe to ship: access is controlled by RLS.
  // Never put the service_role key here.
  const SUPABASE_URL = '';
  const SUPABASE_ANON_KEY = '';

  const BravadianDB = {
    supabaseClient: null,

    init() {
      // Auto-Migration to ensure new luxury mockups, products, and collections load immediately
      const DATA_VERSION = '4.8.0';
      const storedVer = localStorage.getItem('bravadian_data_version');
      const storedProds = localStorage.getItem('bravadian_products');
      const hasStaleJpg = storedProds && (storedProds.includes('images/relics') || storedProds.includes('.jpg'));

      if (storedVer !== DATA_VERSION || hasStaleJpg) {
        localStorage.setItem('bravadian_data_version', DATA_VERSION);
        // Refresh cached products with pristine diagrams and collections
        localStorage.removeItem('bravadian_products');
        localStorage.removeItem('bravadian_collections');
        localStorage.removeItem('bravadian_universe_chapters');
        localStorage.removeItem('bravadian_size_guide');
        // Update contact details in existing stored settings
        const storedSettings = localStorage.getItem('bravadian_settings');
        if (storedSettings) {
          try {
            const s = JSON.parse(storedSettings);
            s.whatsappNumber = '917975362526';
            s.supportEmail = 'bravadian.clothing@gmail.com';
            s.instagramUrl = 'https://www.instagram.com/bravadian.in';
            localStorage.setItem('bravadian_settings', JSON.stringify(s));
          } catch (e) {
            localStorage.removeItem('bravadian_settings');
          }
        }
      }

      // Load saved settings
      const settings = this.getSettings();
      let sUrl = (SUPABASE_URL || settings.supabaseUrl || '').trim();
      if (sUrl && !sUrl.startsWith('http://') && !sUrl.startsWith('https://')) {
        sUrl = `https://${sUrl.replace(/\.supabase\.co.*$/, '')}.supabase.co`;
      }
      const sKey = (SUPABASE_ANON_KEY || settings.supabaseAnonKey || '').trim();

      if (sUrl && sKey && window.supabase) {
        try {
          this.supabaseClient = window.supabase.createClient(sUrl, sKey);
          console.log('[BRAVADIAN] Connected to Supabase Data Layer:', sUrl);
          this.fetchRemoteCatalog().then(res => {
            if (res && res.success) window.dispatchEvent(new Event('bravadian:catalog-updated'));
          });
        } catch (err) {
          console.warn('[BRAVADIAN] Supabase Init Error:', err);
        }
      }
    },

    isSupabaseConnected() {
      return !!this.supabaseClient;
    },

    isLaunchActive(product) {
      const end = Date.parse(this.getSettings().launchEndsAt || '');
      return !!(product && product.launchPrice && !isNaN(end) && Date.now() < end);
    },

    effectivePrice(product) {
      return this.isLaunchActive(product) ? Number(product.launchPrice) : Number(product.price);
    },

    async toWebp(file, max = 1400) {
      const bmp = await createImageBitmap(file);
      const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bmp.width * scale);
      canvas.height = Math.round(bmp.height * scale);
      canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
      return new Promise(resolve => canvas.toBlob(b => resolve(b || file), 'image/webp', 0.82));
    },

    // Uploads to the public "product-images" bucket (admins only, see db/002) and returns its URL.
    async uploadProductImage(file, name) {
      if (!this.supabaseClient) throw new Error('Supabase is not connected. Add SUPABASE_URL and SUPABASE_ANON_KEY in js/data.js.');
      const blob = await this.toWebp(file);
      const path = `${name}-${Date.now()}.webp`;
      const bucket = this.supabaseClient.storage.from('product-images');
      const { error } = await bucket.upload(path, blob, { contentType: 'image/webp', upsert: true });
      if (error) throw new Error(error.message);
      return bucket.getPublicUrl(path).data.publicUrl;
    },

    // Returns { order } on success, { rejected, message } when the database refuses it
    // (e.g. out of stock), or { order: null } when offline so checkout can still use WhatsApp.
    async placeOrder(customer, items) {
      if (!this.supabaseClient) return { order: null };
      try {
        const { data, error } = await this.supabaseClient.rpc('place_order', { p_customer: customer, p_items: items });
        if (error) return { order: null, rejected: error.code === 'P0001', message: error.message };
        return { order: data };
      } catch (e) {
        return { order: null };
      }
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
        // Alias map for legacy URLs or tags
        const COLLECTION_ALIASES = {
          'garuda': ['mythology'],
          'asura': ['mythology'],
          'berunda': ['heritage'],
          'chola': ['heritage', 'street-culture'],
          'street': ['street-culture'],
          'manga': ['anime'],
          'traditional': ['heritage'],
          'urban': ['street-culture']
        };
        const aliases = COLLECTION_ALIASES[cSlug] || [];
        prods = prods.filter(p => {
          const pCol = (p.collection || '').toLowerCase();
          return pCol === cSlug ||
            aliases.includes(pCol) ||
            (p.tags && p.tags.some(t => t.toLowerCase() === cSlug || (COLLECTION_ALIASES[t.toLowerCase()] && COLLECTION_ALIASES[t.toLowerCase()].includes(cSlug))));
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
          launch_price: product.launchPrice || null,
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
          { key: 'social', value: { instagram: settings.instagramUrl } },
          { key: 'launch', value: { ends_at: settings.launchEndsAt || null } }
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
                launchPrice: p.launch_price ? Number(p.launch_price) : null,
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
              } else if (s.key === 'launch' && s.value) {
                remoteSettings.launchEndsAt = s.value.ends_at || '';
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
  window.createSpineTeeSVG = createSpineTeeSVG;
  window.BravadianDefaults = {
    DEFAULT_PRODUCTS,
    DEFAULT_COLLECTIONS,
    DEFAULT_UNIVERSE_CHAPTERS,
    TEN_ARCHIVE_EDITIONS,
    DEFAULT_SIZE_GUIDE,
    DEFAULT_SETTINGS,
    createTeeSVG,
    createSpineTeeSVG,
    createUniverseDiagramSVG
  };

})(window);
