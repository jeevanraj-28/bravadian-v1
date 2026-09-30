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
    const accent = accentHex || '#ED1C24';
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
              <stop offset="100%" stop-color="#000000"/>
            </radialGradient>
            <pattern id="knitPattern_${uniqueId}" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M0 4 L4 0 L8 4 L4 8 Z" fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1"/>
            </pattern>
          </defs>

          <!-- Deep Studio Canvas -->
          <rect width="100%" height="100%" fill="url(#macroGrad_${uniqueId})"/>
          <rect width="100%" height="100%" fill="url(#knitPattern_${uniqueId})"/>

          <!-- Header Specs -->
          <text x="35" y="45" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="3">[ FABRIC CLOSE-UP ]</text>
          <text x="35" y="65" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="18" font-weight="900" letter-spacing="2">240 GSM FRENCH TERRY</text>
          <line x1="35" y1="78" x2="465" y2="78" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>

          <!-- 1.25" High Tension Rib Collar Contour -->
          <path d="M -40 180 Q 250 330 540 180" fill="none" stroke="${accent}" stroke-width="56" opacity="0.18"/>
          <path d="M -40 180 Q 250 330 540 180" fill="none" stroke="#121217" stroke-width="48"/>
          <path d="M -40 180 Q 250 330 540 180" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="48" stroke-dasharray="2,3"/>
          <path d="M -40 206 Q 250 356 540 206" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="5,4"/>

          <!-- Woven Luxury Damask Neck Label -->
          <g transform="translate(140, 270)">
            <rect x="0" y="0" width="220" height="135" rx="4" fill="#09090d" stroke="#ED1C24" stroke-width="1.2" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.9))"/>
            <rect x="6" y="6" width="208" height="123" rx="2" fill="none" stroke="rgba(237, 28, 36,0.25)" stroke-width="1" stroke-dasharray="3,2"/>
            
            <text x="110" y="36" text-anchor="middle" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="15" font-weight="900" letter-spacing="4">BRAVADIAN</text>
            <text x="110" y="52" text-anchor="middle" fill="#ED1C24" font-family="'Space Grotesk', monospace" font-size="8.5" font-weight="700" letter-spacing="3">BRAVE INDIAN</text>
            
            <line x1="30" y1="62" x2="190" y2="62" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>

            <text x="110" y="80" text-anchor="middle" fill="#ddd" font-family="'Space Grotesk', monospace" font-size="9" font-weight="700" letter-spacing="2">240 GSM FRENCH TERRY</text>
            <text x="110" y="96" text-anchor="middle" fill="#888" font-family="'Space Grotesk', monospace" font-size="8" letter-spacing="1.5">FRENCH TERRY COTTON</text>
            <text x="110" y="112" text-anchor="middle" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="700" letter-spacing="3">MADE IN INDIA</text>
          </g>

          <!-- Technical Spec Badges -->
          <g transform="translate(35, 460)">
            <rect x="0" y="0" width="430" height="115" rx="4" fill="#0d0d12" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
            
            <circle cx="25" cy="30" r="4" fill="${accent}"/>
            <text x="40" y="34" fill="#fff" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700">THICK RIB COLLAR</text>
            <text x="40" y="48" fill="#888" font-family="'Space Grotesk', monospace" font-size="8.5">Bio + silicone washed, so it feels soft from the first wear.</text>

            <circle cx="25" cy="72" r="4" fill="#ED1C24"/>
            <text x="40" y="76" fill="#fff" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700">240 GSM FRENCH TERRY · WASHED SOFT</text>
            <text x="40" y="90" fill="#888" font-family="'Space Grotesk', monospace" font-size="8.5">Heavy 240 GSM cotton that holds its shape and never clings.</text>
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
          <text x="40" y="55" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" letter-spacing="4">HOW IT FITS</text>
          <text x="40" y="85" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="28" font-weight="900" letter-spacing="3">BRAVADIAN</text>
          <text x="40" y="108" fill="#aaa" font-family="'Space Grotesk', monospace" font-size="10" font-weight="600" letter-spacing="2">OVERSIZED, DROP SHOULDER</text>

          <!-- Center Spec Wheel -->
          <circle cx="250" cy="360" r="85" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="4,4"/>
          <circle cx="250" cy="360" r="60" fill="none" stroke="${accent}" stroke-width="1.2" opacity="0.5"/>
          <text x="250" y="355" text-anchor="middle" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="14" font-weight="900" letter-spacing="2">OVERSIZED</text>
          <text x="250" y="375" text-anchor="middle" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="9" font-weight="700" letter-spacing="2">240 GSM</text>

          <!-- Footer Metadata -->
          <line x1="40" y1="580" x2="460" y2="580" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <text x="40" y="602" fill="#777" font-family="'Space Grotesk', monospace" font-size="8.5" letter-spacing="2">OVERSIZED · DROP SHOULDER</text>
          <text x="460" y="602" text-anchor="end" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="8.5" font-weight="700" letter-spacing="2">EST. 2026 · INDIA</text>
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
            <text x="10" y="44" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="6" font-weight="700" letter-spacing="1">CELESTIAL FOX</text>
          </g>
          <!-- Woven Hem Tag -->
          <rect x="131" y="510" width="16" height="8" rx="1" fill="${accent}"/>
          <text x="139" y="516" text-anchor="middle" fill="#000" font-family="'Space Grotesk', monospace" font-size="4.5" font-weight="900">BRVD</text>
        `;
      } else if (upperTitle.includes('HOYSALA')) {
        artworkMarkup = `
          <!-- Hoysala Stone Inscription Chest Crest -->
          <g transform="translate(170, 195)">
            <rect x="0" y="0" width="76" height="50" rx="2" fill="#08080c" stroke="#ED1C24" stroke-width="1.2"/>
            <text x="38" y="18" text-anchor="middle" fill="#ED1C24" font-family="'Bebas Neue', sans-serif" font-size="9" font-weight="900" letter-spacing="1.5">HOYSALA</text>
            <text x="38" y="30" text-anchor="middle" fill="#fff" font-family="'Space Grotesk', monospace" font-size="6.5" font-weight="700">ROOTED IN STONE</text>
            <line x1="10" y1="36" x2="66" y2="36" stroke="#ED1C24" stroke-width="0.8"/>
            <text x="38" y="44" text-anchor="middle" fill="#888" font-family="'Space Grotesk', monospace" font-size="5.5">MADE IN INDIA</text>
          </g>
        `;
      } else if (upperTitle.includes('ASURA')) {
        artworkMarkup = `
          <!-- Asura Mythological Chest Sigil -->
          <g transform="translate(180, 195)">
            <circle cx="26" cy="26" r="24" fill="#0a0a0f" stroke="#ED1C24" stroke-width="1.2"/>
            <polygon points="26,10 38,36 14,36" fill="none" stroke="#ED1C24" stroke-width="1"/>
            <text x="26" y="30" text-anchor="middle" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="7" font-weight="900">ASURA</text>
            <text x="26" y="42" text-anchor="middle" fill="#ED1C24" font-family="'Space Grotesk', monospace" font-size="5" font-weight="700">240 GSM</text>
          </g>
        `;
      } else if (upperTitle.includes('BERUNDA')) {
        artworkMarkup = `
          <!-- Berunda Tonal Twin-Eagle Pocket Patch -->
          <g transform="translate(170, 195)">
            <rect x="0" y="0" width="76" height="50" rx="2" fill="#08080c" stroke="#ED1C24" stroke-width="1"/>
            <circle cx="28" cy="20" r="8" fill="none" stroke="#ED1C24" stroke-width="1"/>
            <circle cx="48" cy="20" r="8" fill="none" stroke="#ED1C24" stroke-width="1"/>
            <text x="38" y="36" text-anchor="middle" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="8" font-weight="900">BERUNDA</text>
            <text x="38" y="44" text-anchor="middle" fill="#ED1C24" font-family="'Space Grotesk', monospace" font-size="5" font-weight="700">HERITAGE</text>
          </g>
        `;
      } else if (upperTitle.includes('GARUDA')) {
        artworkMarkup = `
          <!-- Sacred Solar Feather Crest -->
          <g transform="translate(180, 195)">
            <circle cx="26" cy="26" r="24" fill="#0a0a0f" stroke="#ED1C24" stroke-width="1.2"/>
            <circle cx="26" cy="26" r="18" fill="none" stroke="rgba(237, 28, 36,0.3)" stroke-width="0.8" stroke-dasharray="2,2"/>
            <text x="26" y="24" text-anchor="middle" fill="#ED1C24" font-family="'Tiro Devanagari Hindi', serif" font-size="14" font-weight="700">गरुड़</text>
            <text x="26" y="35" text-anchor="middle" fill="#fff" font-family="'Space Grotesk', monospace" font-size="5" font-weight="800" letter-spacing="1">ESSENTIAL 240</text>
          </g>
        `;
      } else if (upperTitle.includes('BHARAT') || upperTitle.includes('MONOLITH')) {
        artworkMarkup = `
          <!-- Brutalist Longitude Badge -->
          <g transform="translate(170, 195)">
            <rect x="0" y="0" width="80" height="46" rx="2" fill="#08080c" stroke="${accent}" stroke-width="1"/>
            <text x="10" y="18" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="9" font-weight="900" letter-spacing="1.5">BHARAT</text>
            <text x="10" y="29" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="6.5" font-weight="700">28°36'N 77°12'E</text>
            <text x="10" y="39" fill="${textSub}" font-family="'Space Grotesk', monospace" font-size="5.5" letter-spacing="1">240 GSM COTTON</text>
          </g>
        `;
      } else if (upperTitle.includes('CYBER')) {
        artworkMarkup = `
          <!-- Industrial Hazard Barcode -->
          <g transform="translate(170, 195)">
            <rect x="0" y="0" width="76" height="48" rx="2" fill="#08080c" stroke="${accent}" stroke-width="1.2"/>
            <rect x="0" y="0" width="76" height="6" fill="${accent}"/>
            <text x="38" y="5" text-anchor="middle" fill="#000" font-family="'Space Grotesk', monospace" font-size="4.5" font-weight="900">240 GSM COTTON</text>
            <text x="8" y="24" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="9" font-weight="900" letter-spacing="1">CYBER REBEL</text>
            <line x1="8" y1="32" x2="68" y2="32" stroke="${textCol}" stroke-width="2" stroke-dasharray="1,2,3,1,2"/>
            <text x="8" y="42" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="6" font-weight="700">[ CYBER REBEL ]</text>
          </g>
        `;
      } else if (upperTitle.includes('ASHOKA')) {
        artworkMarkup = `
          <!-- Solar Chakra Mini Chest Disc -->
          <g transform="translate(185, 200)">
            <circle cx="22" cy="22" r="20" fill="#0a0a0f" stroke="#ED1C24" stroke-width="1.2"/>
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
            <circle cx="90" cy="95" r="52" fill="none" stroke="rgba(237, 28, 36,0.25)" stroke-width="1.5" stroke-dasharray="3,3"/>
            <circle cx="90" cy="95" r="42" fill="none" stroke="rgba(237, 28, 36,0.4)" stroke-width="1"/>

            <!-- 9 Radiant Flame Tails (Multi-layered vector curves) -->
            <path d="M 90 120 C 70 80, 20 70, 30 35 C 45 45, 65 75, 80 100" fill="${accent}" opacity="0.9"/>
            <path d="M 90 120 C 60 70, 40 40, 55 20 C 70 35, 80 65, 85 100" fill="#ED1C24" opacity="0.95"/>
            <path d="M 90 120 C 75 60, 65 30, 80 12 C 90 30, 92 65, 90 100" fill="#ED1C24" opacity="0.9"/>
            
            <path d="M 90 120 C 110 80, 160 70, 150 35 C 135 45, 115 75, 100 100" fill="${accent}" opacity="0.9"/>
            <path d="M 90 120 C 120 70, 140 40, 125 20 C 110 35, 100 65, 95 100" fill="#ED1C24" opacity="0.95"/>
            <path d="M 90 120 C 105 60, 115 30, 100 12 C 90 30, 88 65, 90 100" fill="#ED1C24" opacity="0.9"/>

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

            <text x="90" y="205" text-anchor="middle" fill="#ccc" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="700" letter-spacing="2">THE NINE-TAILED FOX</text>
            <text x="90" y="218" text-anchor="middle" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="7" font-weight="700" letter-spacing="2.5">[ 240 GSM FRENCH TERRY ]</text>
          </g>
        `;
      } else if (upperTitle.includes('HOYSALA')) {
        artworkMarkup = `
          <!-- Hoysala Architectural Temple Relief -->
          <g transform="translate(160, 160)">
            <rect x="0" y="0" width="180" height="230" rx="4" fill="#08080c" stroke="#ED1C24" stroke-width="1.2"/>
            <path d="M 90 35 L 45 80 L 60 80 L 60 120 L 120 120 L 120 80 L 135 80 Z" fill="none" stroke="#ED1C24" stroke-width="1.5"/>
            <rect x="75" y="90" width="30" height="30" fill="#ED1C24" opacity="0.3"/>
            <text x="90" y="150" text-anchor="middle" fill="#ffffff" font-family="'Bebas Neue', sans-serif" font-size="16" font-weight="900" letter-spacing="3">HOYSALA</text>
            <text x="90" y="170" text-anchor="middle" fill="#ED1C24" font-family="'Space Grotesk', monospace" font-size="9" font-weight="700" letter-spacing="2.5">ROOTED IN STONE</text>
            <line x1="30" y1="184" x2="150" y2="184" stroke="#ED1C24" stroke-width="1.2"/>
            <text x="90" y="202" text-anchor="middle" fill="#aaa" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="700" letter-spacing="2">TEMPLE RELIEF</text>
            <text x="90" y="216" text-anchor="middle" fill="#ED1C24" font-family="'Space Grotesk', monospace" font-size="7" font-weight="700" letter-spacing="2.5">240 GSM HEAVYWEIGHT</text>
          </g>
        `;
      } else if (upperTitle.includes('ASURA')) {
        artworkMarkup = `
          <!-- Asura Mythological Warrior Frieze -->
          <g transform="translate(160, 160)">
            <rect x="0" y="0" width="180" height="230" rx="4" fill="#08080c" stroke="#ED1C24" stroke-width="1.2"/>
            <circle cx="90" cy="75" r="32" fill="none" stroke="#ED1C24" stroke-width="1.2" stroke-dasharray="3,2"/>
            <polygon points="90,45 105,75 75,75" fill="#ED1C24" opacity="0.8"/>
            <text x="90" y="150" text-anchor="middle" fill="#ffffff" font-family="'Bebas Neue', sans-serif" font-size="18" font-weight="900" letter-spacing="3">ASURA</text>
            <text x="90" y="170" text-anchor="middle" fill="#ED1C24" font-family="'Space Grotesk', monospace" font-size="8.5" font-weight="700" letter-spacing="2">WARRIOR</text>
            <line x1="30" y1="184" x2="150" y2="184" stroke="#ED1C24" stroke-width="1.2"/>
            <text x="90" y="202" text-anchor="middle" fill="#aaa" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="700" letter-spacing="2">CITY WALLS</text>
            <text x="90" y="216" text-anchor="middle" fill="#ED1C24" font-family="'Space Grotesk', monospace" font-size="7" font-weight="700" letter-spacing="2.5">240 GSM FRENCH TERRY</text>
          </g>
        `;
      } else if (upperTitle.includes('BERUNDA')) {
        artworkMarkup = `
          <!-- Gandaberunda Twin-Headed Eagle Crest -->
          <g transform="translate(160, 160)">
            <rect x="0" y="0" width="180" height="230" rx="4" fill="#08080c" stroke="#ED1C24" stroke-width="1.2"/>
            <circle cx="72" cy="70" r="14" fill="none" stroke="#ED1C24" stroke-width="1.5"/>
            <circle cx="108" cy="70" r="14" fill="none" stroke="#ED1C24" stroke-width="1.5"/>
            <path d="M 60 70 L 40 45 L 90 90 L 140 45 L 120 70 Z" fill="#ED1C24" opacity="0.75"/>
            <text x="90" y="150" text-anchor="middle" fill="#ffffff" font-family="'Bebas Neue', sans-serif" font-size="16" font-weight="900" letter-spacing="3">BERUNDA</text>
            <text x="90" y="170" text-anchor="middle" fill="#ED1C24" font-family="'Space Grotesk', monospace" font-size="8.5" font-weight="700" letter-spacing="2">GANDABERUNDA</text>
            <line x1="30" y1="184" x2="150" y2="184" stroke="#ED1C24" stroke-width="1.2"/>
            <text x="90" y="202" text-anchor="middle" fill="#aaa" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="700" letter-spacing="2">HERITAGE</text>
            <text x="90" y="216" text-anchor="middle" fill="#ED1C24" font-family="'Space Grotesk', monospace" font-size="7" font-weight="700" letter-spacing="2.5">ORIGINAL ARTWORK</text>
          </g>
        `;
      } else if (upperTitle.includes('GARUDA')) {
        artworkMarkup = `
          <!-- Monumental Garuda Sovereign Wingspan -->
          <g transform="translate(160, 160)">
            <rect x="0" y="0" width="180" height="230" rx="4" fill="#08080c" stroke="#ED1C24" stroke-width="1.2" stroke-dasharray="4,4"/>
            
            <!-- Wingspan Art -->
            <path d="M 90 90 L 20 40 L 40 70 L 15 65 L 35 90 L 90 115 L 145 90 L 165 65 L 140 70 L 160 40 Z" fill="#ED1C24" opacity="0.9"/>
            <circle cx="90" cy="80" r="28" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="2,2"/>
            <text x="90" y="85" text-anchor="middle" fill="#fff" font-family="'Tiro Devanagari Hindi', serif" font-size="14" font-weight="700">गरुड़</text>

            <text x="90" y="155" text-anchor="middle" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="18" font-weight="900" letter-spacing="3">GARUDA</text>
            <text x="90" y="175" text-anchor="middle" fill="#ED1C24" font-family="'Bebas Neue', sans-serif" font-size="13" font-weight="900" letter-spacing="2">240 GSM COTTON</text>
            <line x1="30" y1="188" x2="150" y2="188" stroke="#ED1C24" stroke-width="1.5"/>
            <text x="90" y="205" text-anchor="middle" fill="#ccc" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="700" letter-spacing="2">MYTHOLOGY</text>
            <text x="90" y="218" text-anchor="middle" fill="#ED1C24" font-family="'Space Grotesk', monospace" font-size="7" font-weight="700" letter-spacing="2.5">ORIGINAL ARTWORK</text>
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
            <text x="90" y="202" text-anchor="middle" fill="#ccc" font-family="'Space Grotesk', monospace" font-size="8" font-weight="700" letter-spacing="2">28°36'N 77°12'E · DELHI</text>
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
            <text x="90" y="55" text-anchor="middle" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="16" font-weight="900" letter-spacing="2">LOUD & PROUD</text>
            <text x="90" y="78" text-anchor="middle" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="8" font-weight="700" letter-spacing="3">[ STREET CULTURE ]</text>
            
            <!-- Inverted Brutalist Seal -->
            <polygon points="90,95 65,135 115,135" fill="none" stroke="${accent}" stroke-width="2"/>
            <text x="90" y="125" text-anchor="middle" fill="#fff" font-family="'Space Grotesk', monospace" font-size="12" font-weight="900">!</text>

            <text x="90" y="170" text-anchor="middle" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="15" font-weight="900" letter-spacing="3">BRAVADIAN</text>
            <text x="90" y="190" text-anchor="middle" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="9" font-weight="700" letter-spacing="2">STREET CULTURE</text>
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
            <text x="90" y="140" text-anchor="middle" fill="#bbb" font-family="'Space Grotesk', monospace" font-size="8.5" font-weight="700" letter-spacing="2">OVERSIZED FIT</text>
            <text x="90" y="165" text-anchor="middle" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="700" letter-spacing="3">[ 240 GSM FRENCH TERRY ]</text>
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
            <rect x="232" y="85" width="36" height="18" rx="1.5" fill="#050508" stroke="#ED1C24" stroke-width="0.8"/>
            <text x="250" y="93" text-anchor="middle" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="4" font-weight="900" letter-spacing="0.5">BRAVADIAN</text>
            <text x="250" y="99" text-anchor="middle" fill="#ED1C24" font-family="'Space Grotesk', monospace" font-size="3.5" font-weight="700">240 GSM</text>
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
        <text x="25" y="32" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="8.5" font-weight="700" letter-spacing="2">BRAVADIAN · 240 GSM</text>
        <text x="475" y="32" text-anchor="end" fill="#777" font-family="'Space Grotesk', monospace" font-size="8.5" font-weight="700" letter-spacing="2">VIEW: ${viewType.toUpperCase()}</text>
        <text x="25" y="605" fill="#555" font-family="'Space Grotesk', monospace" font-size="8" letter-spacing="1.5">HEAVY, OVERSIZED FIT</text>
        <text x="475" y="605" text-anchor="end" fill="${accent}" font-family="'Space Grotesk', monospace" font-size="8" font-weight="700" letter-spacing="2">MADE IN INDIA</text>
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
    const strokeColor = isVault ? 'rgba(107, 106, 105, 0.7)' : '#ED1C24';
    const glowColor = isVault ? 'rgba(107, 106, 105, 0.2)' : 'rgba(237, 28, 36, 0.35)';
    const textColor = isVault ? '#6B6A69' : '#ED1C24';
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
        <text x="25" y="38" fill="${textColor}" font-family="'Space Grotesk', monospace" font-size="8" font-weight="700" letter-spacing="2">ADHYAYA // ${num}</text>
        <text x="275" y="38" text-anchor="end" fill="${mutedText}" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="600" letter-spacing="1.5">240 GSM COTTON</text>
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
      ivory: { name: 'IVORY', body: '#ece3d2', rib: '#ded4c0', highlight: '#faf5eb', print: '#14120e', accent: '#ED1C24', bg: '#1c1b18' },
      red:   { name: 'RED',   body: '#c81d25', rib: '#a8141b', highlight: '#e52b34', print: '#ffffff', accent: '#ED1C24', bg: '#1a090b' },
      blue:  { name: 'BLUE',  body: '#1852b8', rib: '#103b8a', highlight: '#2563eb', print: '#ffffff', accent: '#ED1C24', bg: '#09101d' },
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
          <rect x="232" y="85" width="36" height="18" rx="1.5" fill="#050508" stroke="#ED1C24" stroke-width="0.8"/>
          <text x="250" y="93" text-anchor="middle" fill="#fff" font-family="'Bebas Neue', sans-serif" font-size="4" font-weight="900" letter-spacing="0.5">BRAVADIAN</text>
          <text x="250" y="99" text-anchor="middle" fill="#ED1C24" font-family="'Space Grotesk', monospace" font-size="3.5" font-weight="700">240 GSM</text>

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
          <path d="M 200 95 C 220 114, 280 114, 300 95 C 280 84, 220 84, 200 95 Z" fill="${config.rib}" stroke="#ED1C24" stroke-width="1"/>

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
    { id: 'c-all', name: 'ALL', slug: 'all', description: 'Every Bravadian tee in one place. Original Indian artwork on heavy, oversized cotton.', isActive: true, order: 0 },
    { id: 'c-anime', name: 'ANIME', slug: 'anime', description: 'Anime characters and manga-inspired artwork, drawn in the style of Japanese animation.', isActive: true, order: 1 },
    { id: 'c-mythology', name: 'MYTHOLOGY', slug: 'mythology', description: 'Krishna, Shiva, Hanuman, the Ramayana and the Mahabharata. The gods and epics we grew up with, drawn bold.', isActive: true, order: 2 },
    { id: 'c-heritage', name: 'HERITAGE', slug: 'heritage', description: 'Indian crafts, folk art, traditional patterns, architecture and the cultural symbols of every region.', isActive: true, order: 3 },
    { id: 'c-street-culture', name: 'STREET CULTURE', slug: 'street-culture', description: 'Graffiti, urban graphics, hip-hop and bold typography. Rebellious, contemporary designs.', isActive: true, order: 4 },
    { id: 'c-minimal', name: 'MINIMAL', slug: 'minimal', description: 'Simple typography, subtle symbols and clean graphics. Understated designs for every day.', isActive: true, order: 5 }
  ];

  /* ==========================================================================
     THE ARCHIVE UNIVERSE CHAPTERS
     ========================================================================== */
  const DEFAULT_UNIVERSE_CHAPTERS = [
    { num: '01', name: 'ANIME', slug: 'anime', chapter: 'ANIME & MANGA', category: 'active', statusBadge: 'ACTIVE DROP', isLive: true, image: null, description: 'Anime characters and manga-inspired artwork, drawn in the style of Japanese animation.' },
    { num: '02', name: 'MYTHOLOGY', slug: 'mythology', chapter: 'GODS & EPICS', category: 'active', statusBadge: 'ACTIVE DROP', isLive: true, image: null, description: 'Krishna, Shiva, Hanuman, the Ramayana and the Mahabharata. The gods and epics we grew up with, drawn bold.' },
    { num: '03', name: 'HERITAGE', slug: 'heritage', chapter: 'CRAFTS & TRADITIONS', category: 'active', statusBadge: 'ACTIVE DROP', isLive: true, image: null, description: 'Indian crafts, folk art, traditional patterns, architecture and the cultural symbols of every region.' },
    { num: '04', name: 'STREET CULTURE', slug: 'street-culture', chapter: 'GRAFFITI & HIP-HOP', category: 'active', statusBadge: 'ACTIVE DROP', isLive: true, image: null, description: 'Graffiti, urban graphics, hip-hop and bold typography. Rebellious, contemporary designs.' },
    { num: '05', name: 'MINIMAL', slug: 'minimal', chapter: 'SIMPLE & UNDERSTATED', category: 'active', statusBadge: 'ACTIVE DROP', isLive: true, image: null, description: 'Simple typography, subtle symbols and clean graphics. Understated designs for every day.' }
  ];

  /* ==========================================================================
     THE ARCHIVE EDITIONS CONFIGURATION
     ========================================================================== */
  const TEN_ARCHIVE_EDITIONS = [
    { num: '01', title: 'ANIME', desc: 'ANIME & MANGA', status: 'active', slug: 'anime' },
    { num: '02', title: 'MYTHOLOGY', desc: 'GODS & EPICS', status: 'active', slug: 'mythology' },
    { num: '03', title: 'HERITAGE', desc: 'CRAFTS & TRADITIONS', status: 'active', slug: 'heritage' },
    { num: '04', title: 'STREET CULTURE', desc: 'GRAFFITI & HIP-HOP', status: 'active', slug: 'street-culture' },
    { num: '05', title: 'MINIMAL', desc: 'SIMPLE & UNDERSTATED', status: 'active', slug: 'minimal' }
  ];

  // DEFAULT SIZE GUIDE
  // Garment measurements in inches (chest all the way round, laid flat ×2). Kept in step with the
  // size_guide table so the first screen before Supabase answers shows the real chart.
  const DEFAULT_SIZE_GUIDE = [
    { size: 'S', chest: 44, length: 28.5, shoulder: 21.5, sleeve: 8.5 },
    { size: 'M', chest: 46, length: 29.5, shoulder: 22.5, sleeve: 9 },
    { size: 'L', chest: 48, length: 30.5, shoulder: 23.5, sleeve: 9.5 },
    { size: 'XL', chest: 50, length: 31.5, shoulder: 24.5, sleeve: 10 },
    { size: 'XXL', chest: 52, length: 32.5, shoulder: 25.5, sleeve: 10.5 }
  ];

  // DEFAULT SITE SETTINGS
  const DEFAULT_SETTINGS = {
    brandName: 'BRAVADIAN',
    tagline: 'BRAVE INDIAN',
    currency: '₹',
    whatsappNumber: '917975362526',
    instagramUrl: 'https://www.instagram.com/bravadian.in',
    supportEmail: 'bravadian.clothing@gmail.com',
    shippingFee: 0,
    launchEndsAt: '',
    freeShippingThreshold: 0,
    estimatedDays: '3–5 working days',
    supabaseUrl: '',
    supabaseAnonKey: '',
    // Marketing copy (admin → Site & WhatsApp). These are what the site shows until the admin
    // changes them, and what it falls back to if a field is left empty.
    announcementEnabled: true,
    announcementText: '🇮🇳 FREE DELIVERY ACROSS INDIA ✦ CUSTOM & PERSONALISED TEES ON WHATSAPP ✦ YOUR NAME, YOUR DESIGN, YOUR SIZE ✦ ORIGINAL INDIAN ARTWORK',
    announcementWaText: 'CUSTOM ORDERS ON WHATSAPP',
    heroTag: '[ 🇮🇳 INDIAN ROOTS. MODERN FORM. ]',
    heroTitle: 'WEAR YOUR | ROOTS LOUD',
    heroDesc: 'Original Indian art on heavy, oversized cotton tees. Every design carries a story, from temple walls to folk paintings. Soft to wear, made to last, delivered free across India.',
    heroBgImage: '',
    heroTicker: '🇮🇳 A STORY WORTH WEARING ✦ ORIGINAL INDIAN ARTWORK ✦ HEAVY 240 GSM COTTON ✦ WASHED SOFT ✦ MADE IN INDIA ✦ FREE DELIVERY ACROSS INDIA',
    vipMessageTemplate: 'Hello Bravadian,\n\nPlease let me know when this design launches.\n\nProduct: {productName}\nPreferred color:\nPreferred size:\n\nThank you.'
  };

  // DEFAULT PRODUCTS with Variant-Level Inventory
  const DEFAULT_PRODUCTS = [
    {
      id: 'prod-018',
      name: 'TRINETRA TEE',
      slug: 'trinetra-tee',
      description: 'Shiva\'s third eye rises over the Himalaya, circled by the moon and the words See Beyond. Printed large across the back, with a small BRAVADIAN mark on the left chest. Oversized fit in heavy 240 GSM cotton, washed soft.',
      story: "Past, present, future, within. The third eye sees what the other two miss. A reminder to look past the obvious.",
      price: 699,
      comparePrice: 999,
      collection: 'mythology',
      tags: ['trinetra', 'shiva', 'third eye', 'mythology', 'oversized', '240gsm'],
      fabric: '240 GSM French Terry cotton, bio + silicone washed',
      gsm: 240,
      fit: 'Oversized, drop shoulder',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'DESIGN 06',
      relicBadge: 'NEW DROP',
      sku: 'BRVD-TRN-06',
      featured: true,
      newDrop: true,
      isComingSoon: false,
      status: 'PUBLISHED',
      colors: ['Black', 'White'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: '/images/products/trinetra/preview.webp'
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
        { color: 'White', size: 'XXL', stock: 10 }
      ]
    },
    {
      id: 'prod-017',
      name: 'HARA HARA MAHADEVA TEE',
      slug: 'hara-hara-mahadeva-tee',
      description: 'Om Namah Shivaya in Devanagari beneath a trishul, printed as one vertical line down the left chest, over the heart. Plain back. Oversized fit in heavy 240 GSM cotton, washed soft.',
      story: "A chant worn close to the heart. The trishul leads and the five syllables follow, running down the left chest like a quiet prayer.",
      price: 699,
      comparePrice: 999,
      collection: 'mythology',
      tags: ['shiva', 'om namah shivaya', 'trishul', 'mythology', 'oversized', '240gsm'],
      fabric: '240 GSM French Terry cotton, bio + silicone washed',
      gsm: 240,
      fit: 'Oversized, drop shoulder',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'DESIGN 05',
      relicBadge: 'NEW DROP',
      sku: 'BRVD-HHM-05',
      featured: true,
      newDrop: true,
      isComingSoon: false,
      status: 'PUBLISHED',
      colors: ['Black', 'Ivory', 'Red', 'Royal Blue', 'White'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: '/images/products/hara-hara-mahadeva/black-front.webp',
        closeup: '/images/products/hara-hara-mahadeva/black-closeup.webp',
        lifestyle: '/images/products/hara-hara-mahadeva/black-model.webp',
        lifestyle2: '/images/products/hara-hara-mahadeva/black-model2.webp',
        colors: {
          'Black': { front: '/images/products/hara-hara-mahadeva/black-front.webp', model: '/images/products/hara-hara-mahadeva/black-model.webp', model2: '/images/products/hara-hara-mahadeva/black-model2.webp', closeup: '/images/products/hara-hara-mahadeva/black-closeup.webp' },
          'Ivory': { front: '/images/products/hara-hara-mahadeva/ivory-front.webp', model: '/images/products/hara-hara-mahadeva/ivory-model.webp' },
          'Red': { front: '/images/products/hara-hara-mahadeva/red-front.webp', model: '/images/products/hara-hara-mahadeva/red-model.webp' },
          'Royal Blue': { front: '/images/products/hara-hara-mahadeva/royal-blue-front.webp', model: '/images/products/hara-hara-mahadeva/royal-blue-model.webp' },
          'White': { front: '/images/products/hara-hara-mahadeva/white-front.webp', model: '/images/products/hara-hara-mahadeva/white-model.webp' }
        }
      },
      variants: [
        { color: 'Black', size: 'S', stock: 10 },
        { color: 'Black', size: 'M', stock: 10 },
        { color: 'Black', size: 'L', stock: 10 },
        { color: 'Black', size: 'XL', stock: 10 },
        { color: 'Black', size: 'XXL', stock: 10 },
        { color: 'Ivory', size: 'S', stock: 10 },
        { color: 'Ivory', size: 'M', stock: 10 },
        { color: 'Ivory', size: 'L', stock: 10 },
        { color: 'Ivory', size: 'XL', stock: 10 },
        { color: 'Ivory', size: 'XXL', stock: 10 },
        { color: 'Red', size: 'S', stock: 10 },
        { color: 'Red', size: 'M', stock: 10 },
        { color: 'Red', size: 'L', stock: 10 },
        { color: 'Red', size: 'XL', stock: 10 },
        { color: 'Red', size: 'XXL', stock: 10 },
        { color: 'Royal Blue', size: 'S', stock: 10 },
        { color: 'Royal Blue', size: 'M', stock: 10 },
        { color: 'Royal Blue', size: 'L', stock: 10 },
        { color: 'Royal Blue', size: 'XL', stock: 10 },
        { color: 'Royal Blue', size: 'XXL', stock: 10 },
        { color: 'White', size: 'S', stock: 10 },
        { color: 'White', size: 'M', stock: 10 },
        { color: 'White', size: 'L', stock: 10 },
        { color: 'White', size: 'XL', stock: 10 },
        { color: 'White', size: 'XXL', stock: 10 }
      ]
    },
    {
      id: 'prod-016',
      name: 'GANESHA TEE',
      slug: 'ganesha-tee',
      description: 'Lord Ganesha seated before a red sun, with Om and Vakratunda in brush-stroke Devanagari across the back. Oversized fit in heavy 240 GSM cotton, washed soft.',
      story: "The remover of obstacles, drawn in ink and red. For every new start.",
      price: 699,
      comparePrice: 999,
      collection: 'mythology',
      tags: ['ganesha', 'vakratunda', 'om', 'mythology', 'oversized', '240gsm'],
      fabric: '240 GSM French Terry cotton, bio + silicone washed',
      gsm: 240,
      fit: 'Oversized, drop shoulder',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'DESIGN 04',
      relicBadge: 'NEW DROP',
      sku: 'BRVD-GNS-04',
      featured: true,
      newDrop: true,
      isComingSoon: false,
      status: 'PUBLISHED',
      colors: ['Black'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: '/images/products/ganesha/preview.webp'
      },
      variants: [
        { color: 'Black', size: 'S', stock: 10 },
        { color: 'Black', size: 'M', stock: 10 },
        { color: 'Black', size: 'L', stock: 10 },
        { color: 'Black', size: 'XL', stock: 10 },
        { color: 'Black', size: 'XXL', stock: 10 }
      ]
    },
    {
      id: 'prod-015',
      name: 'BORN TO RISE TEE',
      slug: 'born-to-rise-tee',
      description: 'A black eagle with blazing red wings under the words Born to Rise, printed large across the back, with a small BRAVADIAN mark on the left chest. Oversized fit in heavy 240 GSM cotton, washed soft.',
      story: "For the days you start again. An eagle rises against the wind, not away from it.",
      price: 699,
      comparePrice: 999,
      collection: 'street-culture',
      tags: ['eagle', 'born to rise', 'street culture', 'oversized', '240gsm'],
      fabric: '240 GSM French Terry cotton, bio + silicone washed',
      gsm: 240,
      fit: 'Oversized, drop shoulder',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'DESIGN 03',
      relicBadge: 'NEW DROP',
      sku: 'BRVD-BTR-03',
      featured: true,
      newDrop: true,
      isComingSoon: false,
      status: 'PUBLISHED',
      colors: ['Black', 'White'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: '/images/products/born-to-rise/black-back.webp',
        closeup: '/images/products/born-to-rise/black-closeup.webp',
        lifestyle: '/images/products/born-to-rise/black-model.webp',
        lifestyle2: '/images/products/born-to-rise/white-model.webp',
        colors: {
          'Black': { front: '/images/products/born-to-rise/black-back.webp', model: '/images/products/born-to-rise/black-model.webp', closeup: '/images/products/born-to-rise/black-closeup.webp' },
          'White': { front: '/images/products/born-to-rise/white-back.webp', model: '/images/products/born-to-rise/white-model.webp', closeup: '/images/products/born-to-rise/white-closeup.webp' }
        }
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
        { color: 'White', size: 'XXL', stock: 10 }
      ]
    },
    {
      id: 'prod-014',
      name: 'INDIAN CRAFT ATLAS TEE',
      slug: 'indian-craft-atlas-tee',
      description: 'A map of India drawn in its crafts. Kalamkari, Warli, Madhubani, Pattachitra, Phad, Gond, Cheriyal, Pichwai and Ikat come together around one elephant on the back. Oversized fit in heavy 240 GSM cotton, washed soft.',
      story: 'People, patterns, places, purpose. India lives in its crafts, and every region adds a pattern of its own. This design puts a dozen of them on one elephant, with the names listed alongside so you know what you are wearing.',
      motif: 'Kalamkari from Andhra Pradesh, Warli from Maharashtra, Madhubani from Bihar, Pattachitra from Odisha, Phad from Rajasthan, Gond from Madhya Pradesh, Cheriyal from Telangana, Pichwai from Nathdwara, Ikat from Odisha and Telangana, and more.',
      price: 699,
      comparePrice: 999,
      collection: 'heritage',
      tags: ['oversized', 'heritage', 'crafts', 'kalamkari', 'madhubani', 'warli', '240gsm'],
      fabric: '240 GSM French Terry cotton, bio + silicone washed',
      gsm: 240,
      fit: 'Oversized, drop shoulder',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'DESIGN 02',
      relicBadge: 'NEW DROP',
      sku: 'BRVD-ICA-02',
      featured: true,
      newDrop: true,
      isComingSoon: false,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: '/images/products/craft-atlas/back-print.webp?v=2',
        closeup: '/images/products/craft-atlas/closeup.webp',
        lifestyle: '/images/lookbook/lb-look-02.webp'
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
      id: 'prod-013',
      name: 'BHARAT SPIRIT TEE',
      slug: 'bharat-spirit-tee',
      description: 'The peacock, the tiger, the lotus and the elephant: four symbols of India drawn together as one story across the back, with a small BRAVADIAN mark on the chest. Oversized fit in heavy 240 GSM cotton, washed soft.',
      price: 699,
      comparePrice: 999,
      collection: 'heritage',
      tags: ['oversized', 'heritage', 'peacock', 'tiger', 'lotus', 'elephant', '240gsm'],
      fabric: '240 GSM French Terry cotton, bio + silicone washed',
      gsm: 240,
      fit: 'Oversized, drop shoulder',
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
        front: '/images/products/bharat-spirit/back-print.webp',
        back: '/images/products/bharat-spirit/front.webp',
        closeup: '/images/products/bharat-spirit/closeup.webp',
        lifestyle: '/images/products/bharat-spirit/worn-studio.webp?v=2',
        lifestyle2: '/images/products/bharat-spirit/worn-temple.webp?v=3'
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
      id: 'prod-003',
      name: 'SRI YOGA SARASVATHESHWARA TEE',
      slug: 'sri-yoga-sarasvatheshwara-tee',
      description: 'The many-armed goddess of learning, printed in gold. Oversized fit in heavy 240 GSM cotton, washed soft.',
      story: 'For the ones who never stop learning. Knowledge, music and art, held in many hands at once.',
      price: 699,
      comparePrice: 999,
      collection: 'mythology',
      tags: ['mythology', 'deities', 'krishna', 'shiva', 'gold-foil', '300gsm', 'yoga'],
      fabric: '240 GSM French Terry cotton, bio + silicone washed',
      gsm: 240,
      fit: 'Oversized, drop shoulder',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'DESIGN 13',
      relicBadge: 'NEW DROP',
      sku: 'BRVD-YOG-03',
      featured: true,
      newDrop: true,
      isComingSoon: false,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('SRI YOGA SARASVATHESHWARA', 'Mythology', '#0c0c10', '#ED1C24', 'front'),
        back: createTeeSVG('SRI YOGA SARASVATHESHWARA', 'Mythology', '#0c0c10', '#ED1C24', 'back'),
        closeup: createTeeSVG('SRI YOGA SARASVATHESHWARA', 'Mythology', '#0c0c10', '#ED1C24', 'closeup'),
        lifestyle: createTeeSVG('SRI YOGA SARASVATHESHWARA', 'Mythology', '#0c0c10', '#ED1C24', 'lifestyle')
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
      id: 'prod-005',
      name: 'ASURA SOLAR FIRE OVERSIZED TEE',
      slug: 'asura-solar-fire-oversized-tee',
      description: 'A blazing sun printed large on the back, with the Sanskrit line ॐ सह नाववतु (Om Saha Navavatu). Oversized fit in heavy 240 GSM cotton, washed soft.',
      story: 'Om Saha Navavatu is an old Sanskrit prayer that asks for protection together, teacher and student side by side. Here it sits beside a sun that never stops burning.',
      price: 699,
      comparePrice: 999,
      collection: 'mythology',
      tags: ['mythology', 'shiva', 'ramayana', 'solar-fire', '280gsm', 'oversized'],
      fabric: '240 GSM French Terry cotton, bio + silicone washed',
      gsm: 240,
      fit: 'Oversized, drop shoulder',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'DESIGN 14',
      relicBadge: 'NEW DROP',
      sku: 'BRVD-ASR-05',
      featured: true,
      newDrop: true,
      isComingSoon: false,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('ASURA SOLAR FIRE', 'Mythology', '#1a1816', '#ED1C24', 'front'),
        back: createTeeSVG('ASURA SOLAR FIRE', 'Mythology', '#1a1816', '#ED1C24', 'back'),
        closeup: createTeeSVG('ASURA SOLAR FIRE', 'Mythology', '#1a1816', '#ED1C24', 'closeup'),
        lifestyle: createTeeSVG('ASURA SOLAR FIRE', 'Mythology', '#1a1816', '#ED1C24', 'lifestyle')
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
      id: 'prod-007',
      name: 'BRAVADIAN NINETAILS',
      slug: 'bravadian-ninetails',
      description: 'The nine-tailed fox spirit from old legends, printed large across the back. Oversized fit in heavy 240 GSM cotton, washed soft.',
      story: 'A creature from old stories that grows wiser, and stronger, with every tail.',
      price: 699,
      comparePrice: 999,
      collection: 'anime',
      tags: ['anime', 'manga', 'japanese-animation', 'ninetails', 'oversized', '240gsm'],
      fabric: '240 GSM French Terry cotton, bio + silicone washed',
      gsm: 240,
      fit: 'Oversized, drop shoulder',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'DESIGN 07',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-NT-07',
      featured: false,
      newDrop: false,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('BRAVADIAN NINETAILS', 'Anime', '#121216', '#ED1C24', 'front'),
        back: createTeeSVG('BRAVADIAN NINETAILS', 'Anime', '#121216', '#ED1C24', 'back'),
        closeup: createTeeSVG('BRAVADIAN NINETAILS', 'Anime', '#121216', '#ED1C24', 'closeup'),
        lifestyle: createTeeSVG('BRAVADIAN NINETAILS', 'Anime', '#121216', '#ED1C24', 'lifestyle')
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
      description: 'Garuda, the great eagle of Indian mythology, printed wing to wing across the back. Oversized fit in heavy 240 GSM cotton, washed soft.',
      story: 'Garuda carries Vishnu across the sky and fears nothing. Wings wide open, always.',
      price: 699,
      comparePrice: 999,
      collection: 'mythology',
      tags: ['mythology', 'garuda', 'deities', 'mythological-stories', 'heavyweight', '240gsm'],
      fabric: '240 GSM French Terry cotton, bio + silicone washed',
      gsm: 240,
      fit: 'Oversized, drop shoulder',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'DESIGN 08',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-GRD-08',
      featured: true,
      newDrop: false,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('BRAVADIAN GARUDA', 'Mythology', '#16161c', '#ED1C24', 'front'),
        back: createTeeSVG('BRAVADIAN GARUDA', 'Mythology', '#16161c', '#ED1C24', 'back'),
        closeup: createTeeSVG('BRAVADIAN GARUDA', 'Mythology', '#16161c', '#ED1C24', 'closeup'),
        lifestyle: createTeeSVG('BRAVADIAN GARUDA', 'Mythology', '#16161c', '#ED1C24', 'lifestyle')
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
      description: 'A clean tee with the Ashoka chakra and the coordinates of Delhi on the back. Oversized fit in heavy 240 GSM cotton, washed soft.',
      story: 'Rooted in Indian soil. A quiet way to wear where you come from.',
      price: 699,
      comparePrice: 999,
      collection: 'heritage',
      tags: ['heritage', 'bharat', 'architecture', 'cultural-symbols', 'oversized', '240gsm'],
      fabric: '240 GSM French Terry cotton, bio + silicone washed',
      gsm: 240,
      fit: 'Oversized, drop shoulder',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'DESIGN 09',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-BHT-09',
      featured: true,
      newDrop: true,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('BRAVADIAN BHARAT', 'Heritage', '#101014', '#ED1C24', 'front'),
        back: createTeeSVG('BRAVADIAN BHARAT', 'Heritage', '#101014', '#ED1C24', 'back'),
        closeup: createTeeSVG('BRAVADIAN BHARAT', 'Heritage', '#101014', '#ED1C24', 'closeup'),
        lifestyle: createTeeSVG('BRAVADIAN BHARAT', 'Heritage', '#101014', '#ED1C24', 'lifestyle')
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
      description: 'Loud street typography inspired by the painted walls of Indian cities. Oversized fit in heavy 240 GSM cotton, washed soft.',
      story: 'Every Indian city talks through its walls: shop signs, posters, hand-painted letters. This one talks back.',
      price: 699,
      comparePrice: 999,
      collection: 'street-culture',
      tags: ['street-culture', 'typography', 'graffiti', 'urban', 'rebellious', 'oversized', '240gsm'],
      fabric: '240 GSM French Terry cotton, bio + silicone washed',
      gsm: 240,
      fit: 'Oversized, drop shoulder',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'DESIGN 10',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-CR-10',
      featured: false,
      newDrop: false,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('BRAVADIAN CYBER', 'Street Culture', '#0a0a0e', '#ED1C24', 'front'),
        back: createTeeSVG('BRAVADIAN CYBER', 'Street Culture', '#0a0a0e', '#ED1C24', 'back'),
        closeup: createTeeSVG('BRAVADIAN CYBER', 'Street Culture', '#0a0a0e', '#ED1C24', 'closeup'),
        lifestyle: createTeeSVG('BRAVADIAN CYBER', 'Street Culture', '#0a0a0e', '#ED1C24', 'lifestyle')
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
      description: 'No graphics, just a great tee. Thick rib collar, dropped shoulders and a relaxed oversized fit in heavy 240 GSM cotton, washed soft.',
      story: 'The tee you reach for every morning. Made to outlast the trend.',
      price: 699,
      comparePrice: 999,
      collection: 'minimal',
      tags: ['minimal', 'essential', 'clean-graphics', 'understated', 'simple-typography', '240gsm'],
      fabric: '240 GSM French Terry cotton, bio + silicone washed',
      gsm: 240,
      fit: 'Oversized, drop shoulder',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'DESIGN 11',
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
      description: 'The 24-spoke Ashoka chakra in glowing ember tones across the chest and back. Oversized fit in heavy 240 GSM cotton, washed soft.',
      story: 'Twenty-four spokes, one for every hour of the day. A reminder to keep moving forward.',
      price: 699,
      comparePrice: 999,
      collection: 'heritage',
      tags: ['heritage', 'ashoka', 'cultural-symbols', 'traditional-patterns', 'limited', '240gsm'],
      fabric: '240 GSM French Terry cotton, bio + silicone washed',
      gsm: 240,
      fit: 'Oversized, drop shoulder',
      material: '240 GSM French Terry Cotton, Bio + Silicone Washed',
      relicTag: 'DESIGN 12',
      relicBadge: 'COMING SOON',
      sku: 'BRVD-ASH-12',
      featured: true,
      newDrop: true,
      isComingSoon: true,
      status: 'PUBLISHED',
      colors: ['Black', 'White', 'Red', 'Royal Blue'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      images: {
        front: createTeeSVG('BRAVADIAN ASHOKA', 'Heritage', '#0c0c10', '#ED1C24', 'front'),
        back: createTeeSVG('BRAVADIAN ASHOKA', 'Heritage', '#0c0c10', '#ED1C24', 'back'),
        closeup: createTeeSVG('BRAVADIAN ASHOKA', 'Heritage', '#0c0c10', '#ED1C24', 'closeup'),
        lifestyle: createTeeSVG('BRAVADIAN ASHOKA', 'New Drop', '#0c0c10', '#ED1C24', 'lifestyle')
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
  // Live project: every deployed site uses this one.
  const SUPABASE_URL = 'https://ccmwfynsytaycfgfxjln.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_gkUGThWcvHoUWGM12t-Odg_OnySj07e'; // public key, safe in browser code
  // Test project: used only when the address has ?db=test (before any #). Everything else,
  // localhost included, works on the live project.
  const TEST_SUPABASE_URL = 'https://cstqxsxfcxbqcqljxlgd.supabase.co';
  const TEST_SUPABASE_ANON_KEY = 'sb_publishable_B-T7Hk7Nb2xwXPl9m6VoZA_abqrenF9'; // public key, safe in browser code
  const BUILD_ENV = (typeof import.meta !== 'undefined' && import.meta.env) || {};
  const USE_TEST_DB = /[?&]db=test\b/.test(window.location.search);

  // The site's address prefix: "/" in production, "/bravadian-v1/" on the GitHub Pages copy.
  // Photo paths are stored in the database without it ("/images/...") and get it when shown.
  const BASE = BUILD_ENV.BASE_URL || '/';
  // Written as '/' + 'images/' so the Pages build step (which prefixes "/images/" text) leaves it alone
  const IMAGES_ROOT = '/' + 'images/';
  const withBase = (u) => (BASE !== '/' && typeof u === 'string' && u.startsWith(IMAGES_ROOT)) ? BASE + u.slice(1) : u;
  const withoutBase = (u) => (BASE !== '/' && typeof u === 'string' && u.startsWith(BASE + 'images/')) ? '/' + u.slice(BASE.length) : u;
  const mapPhotos = (images, fn) => {
    if (!images || typeof images !== 'object') return images;
    const out = {};
    Object.entries(images).forEach(([k, v]) => {
      out[k] = k === 'colors' && v && typeof v === 'object'
        ? Object.fromEntries(Object.entries(v).map(([c, set]) => [c, Object.fromEntries(Object.entries(set || {}).map(([s, u]) => [s, fn(u)]))]))
        : fn(v);
    });
    return out;
  };
  const ACTIVE_SUPABASE_URL = USE_TEST_DB ? TEST_SUPABASE_URL : SUPABASE_URL;
  const ACTIVE_SUPABASE_KEY = USE_TEST_DB ? TEST_SUPABASE_ANON_KEY : SUPABASE_ANON_KEY;

  // Real photo addresses only. The site draws placeholder tees (data: URIs) itself when a view has
  // no photo, so those drawings are never stored in the database.
  const isDrawing = (v) => typeof v === 'string' && v.startsWith('data:');
  function photosOnly(images) {
    if (!images || typeof images !== 'object') return null;
    const out = {};
    Object.entries(images).forEach(([k, v]) => {
      if (k === 'colors' && v && typeof v === 'object') {
        const colors = {};
        Object.entries(v).forEach(([c, set]) => {
          const kept = Object.fromEntries(Object.entries(set || {})
            .filter(([, u]) => typeof u === 'string' && u && !isDrawing(u))
            .map(([s, u]) => [s, withoutBase(u)]));
          if (Object.keys(kept).length) colors[c] = kept;
        });
        if (Object.keys(colors).length) out.colors = colors;
      } else if (typeof v === 'string' && v && !isDrawing(v)) {
        out[k] = withoutBase(v);   // stored without the test copy's address prefix
      }
    });
    return Object.keys(out).length ? out : null;
  }

  // Admin settings stored together under site_settings key "content"
  const CONTENT_SETTING_KEYS = ['announcementText', 'announcementWaText', 'announcementEnabled', 'heroTag', 'heroTitle',
    'heroDesc', 'heroBgImage', 'heroTicker', 'vipMessageTemplate'];

  const BravadianDB = {
    supabaseClient: null,
    dbLabel: USE_TEST_DB ? 'TEST' : 'LIVE',
    dbUrl: ACTIVE_SUPABASE_URL,
    // "/images/x.webp" → the address it has on this copy of the site (adds "/bravadian-v1/" on GitHub Pages)
    assetUrl: withBase,

    init() {
      // Auto-Migration to ensure new luxury mockups, products, and collections load immediately
      const DATA_VERSION = '4.14.0';
      const storedVer = localStorage.getItem('bravadian_data_version');
      const storedProds = localStorage.getItem('bravadian_products');
      // Old caches from before the relic photos were retired. (Not ".jpg" in general: a JPG product
      // photo is valid and would otherwise wipe the saved catalog on every visit.)
      const hasRetiredPhotos = storedProds && storedProds.includes('images/relics');

      if (storedVer !== DATA_VERSION || hasRetiredPhotos) {
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
      let sUrl = (ACTIVE_SUPABASE_KEY ? ACTIVE_SUPABASE_URL : (SUPABASE_URL || settings.supabaseUrl || '')).trim();
      if (sUrl && !sUrl.startsWith('http://') && !sUrl.startsWith('https://')) {
        sUrl = `https://${sUrl.replace(/\.supabase\.co.*$/, '')}.supabase.co`;
      }
      const sKey = (ACTIVE_SUPABASE_KEY || SUPABASE_ANON_KEY || settings.supabaseAnonKey || '').trim();

      if (sUrl && sKey && window.supabase) {
        try {
          this.supabaseClient = window.supabase.createClient(sUrl, sKey);
          // detail.changed tells pages whether anything differs from the copy they already showed
          const snapshot = () => ['bravadian_products', 'bravadian_collections', 'bravadian_size_guide', 'bravadian_settings']
            .map(k => localStorage.getItem(k)).join('\u0000');
          const before = snapshot();
          this.fetchRemoteCatalog().then(res => {
            if (res && res.success) {
              window.dispatchEvent(new CustomEvent('bravadian:catalog-updated', { detail: { changed: snapshot() !== before } }));
            }
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

    // ORDERS (admins only: the orders table has no public read policy)
    async getOrders(limit = 500) {
      if (!this.supabaseClient) throw new Error('Supabase is not connected.');
      const { data, error } = await this.supabaseClient
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw new Error(error.message);
      return data || [];
    },

    // Stock goes back when an order is cancelled, and comes off again if it is un-cancelled (db/005)
    async updateOrderStatus(id, status) {
      if (!this.supabaseClient) throw new Error('Supabase is not connected.');
      const { data, error } = await this.supabaseClient
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
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

      // Drafts stay visible in the admin panel only
      if (!/admin/i.test(window.location.pathname)) {
        prods = prods.filter(p => p.status !== 'DRAFT');
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

    // Saves locally, then to Supabase. Resolves once Supabase has the product and throws if it refused,
    // so callers can report the real outcome. Stock of existing sizes is kept by the database (db/004).
    async saveProduct(product) {
      const prods = this.getProducts();
      // Match by id (a renamed slug is still the same product); by slug only for products without an id
      const existingIdx = product.id
        ? prods.findIndex(p => p.id === product.id)
        : prods.findIndex(p => p.slug === product.slug);
      
      if (existingIdx >= 0) {
        prods[existingIdx] = { ...prods[existingIdx], ...product };
      } else {
        if (!product.id) product.id = 'prod-' + Date.now();
        if (!product.slug) product.slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        prods.unshift(product);
      }

      localStorage.setItem('bravadian_products', JSON.stringify(prods));

      if (this.supabaseClient) {
        await this.syncProductToSupabase(product);
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
    // changes: [{ productId, color, size, stock }] for the sizes the admin edited, and nothing else.
    // With Supabase, one admin_set_stock call (db/004) changes only those sizes, so stock that orders
    // used up in the meantime is never overwritten. Throws if the database refuses.
    async setStock(changes) {
      if (!changes.length) return 0;
      const clean = changes.map(c => ({ ...c, stock: Math.max(0, parseInt(c.stock, 10) || 0) }));

      if (this.supabaseClient) {
        const { error } = await this.supabaseClient.rpc('admin_set_stock', { p_changes: clean });
        if (error) throw new Error(error.message);
      }

      const prods = this.getProducts();
      clean.forEach(({ productId, color, size, stock }) => {
        const p = prods.find(item => item.id === productId || item.slug === productId);
        if (!p) return;
        if (!p.variants) p.variants = [];
        const variant = p.variants.find(v => v.color.toLowerCase() === color.toLowerCase() && v.size === size);
        if (variant) variant.stock = stock;
        else p.variants.push({ color, size, stock });
      });
      localStorage.setItem('bravadian_products', JSON.stringify(prods));
      return clean.length;
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

    // Saves locally, then to Supabase; throws if Supabase refuses. Reconnects only when the
    // connection details themselves change (reconnecting reloads the catalog, which would
    // overwrite the settings just saved with the older copy from the database).
    async saveSettings(newSettings) {
      const merged = { ...this.getSettings(), ...newSettings };
      localStorage.setItem('bravadian_settings', JSON.stringify(merged));
      if ('supabaseUrl' in newSettings || 'supabaseAnonKey' in newSettings) {
        this.init();
        return merged;
      }
      if (this.supabaseClient) await this.syncSettingsToSupabase(merged);
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
        if (error) console.warn('[Supabase Delete Product Notice]:', error);
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

        // Only sent when known, so saving from the admin form (which has no story field) keeps them
        if (product.story !== undefined) prodData.story = product.story || null;
        if (product.motif !== undefined) prodData.motif = product.motif || null;
        if (product.relicTag) prodData.relic_tag = product.relicTag;
        if (product.relicBadge) prodData.relic_badge = product.relicBadge;
        if (product.images) prodData.images = photosOnly(product.images);
        if (product.variants) prodData.variants = product.variants;

        if (product.id) {
          prodData.id = product.id;
        }
        // By id, so changing a product's slug updates it instead of clashing with its own id
        const conflictKey = prodData.id ? 'id' : 'slug';

        let { data: savedProd, error } = await this.supabaseClient
          .from('products')
          .upsert(prodData, { onConflict: conflictKey })
          .select()
          .single();

        if (error) {
          console.warn('[Supabase Sync Notice]: Retrying with core columns:', error.message);
          delete prodData.is_coming_soon;
          delete prodData.story;
          delete prodData.motif;
          delete prodData.relic_tag;
          delete prodData.relic_badge;
          delete prodData.images;
          delete prodData.variants;
          const retry = await this.supabaseClient
            .from('products')
            .upsert(prodData, { onConflict: conflictKey })
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
            const imgRows = Object.entries(photosOnly(product.images) || {})
              .filter(([_, url]) => url && typeof url === 'string')
              .map(([vType, url], idx) => ({
                product_id: productId,
                image_url: url,
                view_type: ['hero', 'front', 'back', 'closeup', 'lifestyle', 'detail'].includes(vType) ? vType : 'front',
                display_order: idx + 1
              }));
            // Replace this product's rows (they have no stable id, so an upsert would only add duplicates)
            await this.supabaseClient.from('product_images').delete().eq('product_id', productId);
            if (imgRows.length > 0) {
              const { error: imgError } = await this.supabaseClient.from('product_images').insert(imgRows);
              if (imgError) console.warn('[Supabase Images Sync Notice]:', imgError.message);
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
                // Only creates missing rows; existing counts are changed by orders and admin_set_stock
                const { error: invError } = await this.supabaseClient
                  .from('inventory')
                  .upsert({
                    variant_id: savedVar.id,
                    stock_quantity: v.stock
                  }, { onConflict: 'variant_id', ignoreDuplicates: true });
                if (invError) console.warn('[Supabase Inventory Sync Notice]:', invError.message);
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
      const rows = [
        { key: 'general', value: { brand_name: settings.brandName, tagline: settings.tagline, currency: settings.currency, support_email: settings.supportEmail } },
        { key: 'whatsapp', value: { phone_number: settings.whatsappNumber, business_name: 'BRAVADIAN Official' } },
        { key: 'shipping', value: { shipping_charge: settings.shippingFee, free_shipping_threshold: settings.freeShippingThreshold, estimated_days: settings.estimatedDays } },
        { key: 'social', value: { instagram: settings.instagramUrl } },
        { key: 'launch', value: { ends_at: settings.launchEndsAt || null } },
        // Announcement bar, hero copy and message template from the admin settings form
        { key: 'content', value: Object.fromEntries(CONTENT_SETTING_KEYS.filter(k => settings[k] !== undefined).map(k => [k, k === 'heroBgImage' ? withoutBase(settings[k]) : settings[k]])) }
      ];
      const { error } = await this.supabaseClient.from('site_settings').upsert(rows, { onConflict: 'key' });
      if (error) throw new Error(error.message);
    },

    async syncSizeGuideToSupabase(guide, { throwOnError = false } = {}) {
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
        // supabase-js reports a refused write in `error` rather than throwing
        const { error } = await this.supabaseClient.from('size_guide').upsert(rows, { onConflict: 'size' });
        if (error) throw new Error(error.message);
      } catch (e) {
        console.warn('[Supabase Size Guide Sync Warning]:', e);
        if (throwOnError) throw e;
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
              const mergedImgs = mapPhotos({ ...relImgs, ...dbImgs }, withBase);

              // Check if images are valid remote URLs (http/https) and not legacy mock paths
              const isValidImg = (url) => url && typeof url === 'string' && url.trim().length > 0 && !url.includes('images/relics');

              const front = isValidImg(mergedImgs.front) ? mergedImgs.front : createTeeSVG(p.name, p.collection_slug || 'Heritage', '#111116', '#ED1C24', 'front');
              const back = isValidImg(mergedImgs.back) ? mergedImgs.back : createTeeSVG(p.name, p.collection_slug || 'Heritage', '#111116', '#ED1C24', 'back');
              const closeup = isValidImg(mergedImgs.closeup) ? mergedImgs.closeup : createTeeSVG(p.name, p.collection_slug || 'Heritage', '#111116', '#ED1C24', 'closeup');
              const lifestyle = isValidImg(mergedImgs.lifestyle) ? mergedImgs.lifestyle : createTeeSVG(p.name, p.collection_slug || 'Heritage', '#111116', '#ED1C24', 'lifestyle');

              return {
                id: p.id,
                name: p.name,
                slug: p.slug,
                description: p.description || '',
                story: p.story || '',
                motif: p.motif || '',
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
                  ...mapPhotos(dbImgs, withBase),
                  front,
                  back,
                  closeup,
                  lifestyle
                },
                // No stock rows means nothing to sell: show it sold out rather than invent stock
                variants: Array.isArray(p.variants) ? p.variants : []
              };
            });

            if (mapped.length > 0) {
              localStorage.setItem('bravadian_products', JSON.stringify(mapped));
              summary.products = mapped.length;
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
            // A blank cell stays blank (Number(null) would show as 0")
            const num = (v) => (v === null || v === undefined || v === '' || isNaN(Number(v))) ? null : Number(v);
            const mappedGuide = sg.map(s => ({
              size: s.size,
              chest: num(s.chest_inches),
              length: num(s.length_inches),
              shoulder: num(s.shoulder_inches),
              sleeve: num(s.sleeve_inches)
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
              } else if (s.key === 'content' && s.value) {
                CONTENT_SETTING_KEYS.forEach(k => { if (s.value[k] !== undefined) remoteSettings[k] = s.value[k]; });
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
