import os
import subprocess

svg_icon = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#111111" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
    <linearGradient id="boltGrad" x1="0%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="40%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#F59E0B" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Black Background with rounded squircle -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <rect width="504" height="504" x="4" y="4" rx="108" fill="none" stroke="#262626" stroke-width="4" />

  <!-- Yellow Lightning Bolt (⚡) with Energetic Proportions -->
  <!-- Safe zone maintained for maskable & home screen viewports -->
  <path d="M 292 72 
           L 156 264 
           L 260 264 
           L 204 440 
           L 364 224 
           L 264 224 
           L 320 72 
           Z" 
        fill="url(#boltGrad)" 
        stroke="#FBBF24" 
        stroke-width="6" 
        stroke-linejoin="round"
        stroke-linecap="round"
        filter="url(#glow)" />
</svg>
'''

# Maskable SVG (Full bleed square background, centered safe zone icon)
svg_maskable = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" offset-color="#111111" />
      <stop offset="100%" offset-color="#000000" />
    </linearGradient>
    <linearGradient id="boltGrad" x1="0%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="40%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
  </defs>

  <!-- Full-bleed background for Android Adaptive icon mask (circle, squircle, rounded rect) -->
  <rect width="512" height="512" fill="#000000" />

  <!-- Safe zone icon: scaled to 75% to prevent cropping on Android circle masks -->
  <g transform="translate(64, 64) scale(0.75)">
    <path d="M 292 72 
             L 156 264 
             L 260 264 
             L 204 440 
             L 364 224 
             L 264 224 
             L 320 72 
             Z" 
          fill="url(#boltGrad)" 
          stroke="#FBBF24" 
          stroke-width="8" 
          stroke-linejoin="round"
          stroke-linecap="round" />
  </g>
</svg>
'''

with open('public/icon.svg', 'w') as f:
    f.write(svg_icon)

with open('public/icon-maskable.svg', 'w') as f:
    f.write(svg_maskable)

print("SVGs written successfully")
