/**
 * BRAVADIAN | BRAVE INDIAN
 * Core Data Engine & Supabase Abstraction Layer
 * Supports LocalStorage Offline First + Supabase Cloud Sync
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
      } else if (upperTitle.includes('GARUDA')) {
        artworkMarkup = `
          <!-- Monumental Garuda Sovereign Wingspan -->
          <g transform="translate(160, 160)">
            <rect x="0" y="0" width="180" height="230" rx="4" fill="#08080c" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="4,4"/>
            
            <!-- Wingspan Art -->
            <path d="M 90 90 L 20 40 L 40 70 L 15 65 L 35 90 L 90 115 L 145 90 L 165 65 L 140 70 L 160 40 Z" fill="#f59e0b" opacity="0.9"/>
            <circle cx="90" cy="80" r="28" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="2,2"/>
            <text x="90" y="85" text-anchor="middle" fill="#fff" font-family="'Tiro Devanagari Hindi', serif" font-size="14" font-weight="700">गरुड़</text>

            <text x="90" y="155" text-anchor="middle" fill="#fff" font-family="'Syne', sans-serif" font-size="18" font-weight="900" letter-spacing="3">GARUDA REBEL</text>
            <text x="90" y="175" text-anchor="middle" fill="#f59e0b" font-family="'Syne', sans-serif" font-size="13" font-weight="900" letter-spacing="2">APEX PREDATOR</text>
            <line x1="30" y1="188" x2="150" y2="188" stroke="#f59e0b" stroke-width="1.5"/>
            <text x="90" y="205" text-anchor="middle" fill="#ccc" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="700" letter-spacing="2">MYTHOLOGY DROP // BHARAT</text>
            <text x="90" y="218" text-anchor="middle" fill="#f59e0b" font-family="'Space Grotesk', monospace" font-size="7" font-weight="700" letter-spacing="2.5">240 GSM ARCHITECTURAL CUT</text>
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

  // DEFAULT COLLECTIONS
  const DEFAULT_COLLECTIONS = [
    { id: 'c-all', name: 'ALL', slug: 'all', description: 'Complete 240 GSM architectural oversized archive.', isActive: true, order: 0 },
    { id: 'c-anime', name: 'ANIME', slug: 'anime', description: 'Underground Japanese cyber-culture infused with raw Indian weight.', isActive: true, order: 1 },
    { id: 'c-mythology', name: 'MYTHOLOGY', slug: 'mythology', description: 'Ancient warriors, cosmic beasts, and deconstructed yantras.', isActive: true, order: 2 },
    { id: 'c-heritage', name: 'HERITAGE', slug: 'heritage', description: 'Rooted in the earth of Bharat. Cultural brutalism.', isActive: true, order: 3 },
    { id: 'c-street', name: 'STREET CULTURE', slug: 'street-culture', description: 'Monolithic typography, boxy drop shoulders, asphalt rebellion.', isActive: true, order: 4 },
    { id: 'c-minimal', name: 'MINIMAL', slug: 'minimal', description: 'Zero distractions. Pure 240 GSM drape and silhouette presence.', isActive: true, order: 5 },
    { id: 'c-new', name: 'NEW DROP', slug: 'new-drop', description: 'Fresh unreleased silhouettes. Strictly limited runs.', isActive: true, order: 6 }
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
      name: 'BRAVADIAN NINETAILS',
      slug: 'bravadian-ninetails',
      description: '240 GSM heavyweight oversized silhouette featuring high-density back-print of the mythical celestial fox spirit. Constructed with double-combed long-staple yarns for architectural boxy drape.',
      price: 1499,
      comparePrice: 1999,
      collection: 'anime',
      tags: ['oversized', 'anime', 'heavyweight', '240gsm'],
      fabric: '240 GSM',
      gsm: 240,
      fit: 'Oversized',
      material: '100% Combed Heavy Interlock Cotton',
      sku: 'BRVD-NT-01',
      featured: true,
      newDrop: true,
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
        { color: 'Black', size: 'L', stock: 0 }, // Sold out variant demonstrator
        { color: 'Black', size: 'XL', stock: 5 },
        { color: 'Black', size: 'XXL', stock: 2 },
        { color: 'White', size: 'S', stock: 0 }, // Sold out variant demonstrator
        { color: 'White', size: 'M', stock: 6 },
        { color: 'White', size: 'L', stock: 9 },
        { color: 'White', size: 'XL', stock: 4 },
        { color: 'White', size: 'XXL', stock: 1 }
      ]
    },
    {
      id: 'prod-002',
      name: 'BRAVADIAN GARUDA REBEL',
      slug: 'bravadian-garuda-rebel',
      description: 'An ode to the supreme avian sovereign. Geometric feathered wingspan printed in reflective metallic pigments across dropped shoulder seams on 240 GSM heavy French cotton.',
      price: 1699,
      comparePrice: 2199,
      collection: 'mythology',
      tags: ['mythology', 'garuda', 'heavyweight', '240gsm'],
      fabric: '240 GSM',
      gsm: 240,
      fit: 'Oversized',
      material: '100% Combed Cotton Heavy Interlock',
      sku: 'BRVD-GRD-02',
      featured: true,
      newDrop: false,
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
      id: 'prod-003',
      name: 'BRAVADIAN MONOLITH BHARAT',
      slug: 'bravadian-monolith-bharat',
      description: 'Rooted in Indian soil. 240 GSM high-density knit featuring brutalist longitude coordinates (28°36 N 77°12 E) and architectural Ashoka geometry across the back yoke.',
      price: 1599,
      comparePrice: 2099,
      collection: 'heritage',
      tags: ['heritage', 'bharat', 'oversized', '240gsm'],
      fabric: '240 GSM',
      gsm: 240,
      fit: 'Oversized',
      material: '100% Combed Cotton',
      sku: 'BRVD-BHT-03',
      featured: true,
      newDrop: true,
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
      id: 'prod-004',
      name: 'BRAVADIAN CYBER REBEL',
      slug: 'bravadian-cyber-rebel',
      description: 'Underground dystopian Indian streetwear. High-impact typography with anti-surveillance warning tapes engineered on 240 GSM ultra-heavy cotton.',
      price: 1499,
      comparePrice: 1899,
      collection: 'street-culture',
      tags: ['street', 'cyber', 'oversized', '240gsm'],
      fabric: '240 GSM',
      gsm: 240,
      fit: 'Oversized',
      material: '100% Combed Cotton',
      sku: 'BRVD-CR-04',
      featured: false,
      newDrop: false,
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
      id: 'prod-005',
      name: 'BRAVADIAN ESSENTIAL 240',
      slug: 'bravadian-essential-240',
      description: 'Zero graphics. Zero noise. Pure structural drape, thick 1.25" Lycra rib collar, and drop-shoulder presence. Designed to outlast seasonal trends.',
      price: 1299,
      comparePrice: 1599,
      collection: 'minimal',
      tags: ['minimal', 'essential', 'plain', '240gsm'],
      fabric: '240 GSM',
      gsm: 240,
      fit: 'Oversized',
      material: '100% Combed Cotton Heavy Interlock',
      sku: 'BRVD-ES-05',
      featured: false,
      newDrop: false,
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
      id: 'prod-006',
      name: 'BRAVADIAN ASHOKA EMBER',
      slug: 'bravadian-ashoka-ember',
      description: 'Unreleased archive drop. 24-spoke Solar Chakra motif in neon solar ember across the chest and oversized drop spine. Limited to 500 numbered pieces.',
      price: 1799,
      comparePrice: 2299,
      collection: 'new-drop',
      tags: ['new drop', 'ashoka', 'limited', '240gsm'],
      fabric: '240 GSM',
      gsm: 240,
      fit: 'Oversized',
      material: '100% Combed Heavy Cotton',
      sku: 'BRVD-ASH-06',
      featured: true,
      newDrop: true,
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
        { color: 'Black Ember', size: 'XL', stock: 0 }, // Sold out
        { color: 'Black Ember', size: 'XXL', stock: 2 }
      ]
    }
  ];

  // BRAVADIAN DATA STORAGE CONTROLLER
  const BravadianDB = {
    supabaseClient: null,

    init() {
      // Auto-Migration to ensure new luxury mockups and new contact details load immediately
      const DATA_VERSION = '2.1.0';
      const storedVer = localStorage.getItem('bravadian_data_version');
      if (storedVer !== DATA_VERSION) {
        localStorage.setItem('bravadian_data_version', DATA_VERSION);
        // Refresh cached products with new SVGs
        localStorage.removeItem('bravadian_products');
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
        prods = prods.filter(p => p.collection === filters.collection);
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
      return cols;
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
          .filter(c => c.slug && c.slug !== 'all')
          .map((c, idx) => {
            const row = {
              name: c.name,
              slug: c.slug,
              description: c.description || '',
              is_active: c.isActive !== false,
              display_order: idx + 1
            };
            if (c.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(c.id)) {
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
          status: product.status || 'PUBLISHED'
        };

        if (product.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(product.id)) {
          prodData.id = product.id;
        }

        const { error } = await this.supabaseClient
          .from('products')
          .upsert(prodData, { onConflict: 'slug' });

        if (error) {
          console.error('[Supabase Sync Error]:', error);
          throw error;
        }
      } catch (e) {
        console.error('[Supabase Exception]:', e);
        throw e;
      }
    }
  };

  // Auto-initialize
  BravadianDB.init();

  // Export to window
  window.BravadianDB = BravadianDB;
  window.BravadianDefaults = {
    DEFAULT_PRODUCTS,
    DEFAULT_COLLECTIONS,
    DEFAULT_SIZE_GUIDE,
    DEFAULT_SETTINGS,
    createTeeSVG
  };

})(window);
