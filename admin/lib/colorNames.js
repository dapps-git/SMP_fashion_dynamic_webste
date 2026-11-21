// Comprehensive luxury fashion color palette for automatic color naming

const LUXURY_PALETTE = [
  // Blacks & Grays
  { name: 'Black', hex: '#000000' },
  { name: 'Black', hex: '#111111' },
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'Charcoal Gray', hex: '#2B2B2B' },
  { name: 'Charcoal Gray', hex: '#374151' },
  { name: 'Slate Gray', hex: '#6B7280' },
  { name: 'Slate Gray', hex: '#708090' },
  { name: 'Silver / Light Gray', hex: '#9CA3AF' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Silver', hex: '#D1D5DB' },
  { name: 'Silver', hex: '#E5E7EB' },

  // Whites & Neutrals
  { name: 'White', hex: '#FFFFFF' },
  { name: 'White', hex: '#FAFAFA' },
  { name: 'Cream / Off-White', hex: '#FAF8F5' },
  { name: 'Cream / Off-White', hex: '#FFFDD0' },
  { name: 'Cream / Off-White', hex: '#FDFBF7' },
  { name: 'Beige / Nude', hex: '#E2D5C3' },
  { name: 'Beige / Nude', hex: '#F5EBE0' },
  { name: 'Beige / Nude', hex: '#D2B48C' },
  { name: 'Beige / Nude', hex: '#F7E7CE' },
  { name: 'Taupe / Greige', hex: '#A39687' },
  { name: 'Taupe / Greige', hex: '#8B8589' },
  { name: 'Taupe / Greige', hex: '#9E9284' },

  // Browns & Earthy
  { name: 'Camel / Tan', hex: '#C19A6B' },
  { name: 'Camel / Tan', hex: '#D27D2D' },
  { name: 'Camel / Tan', hex: '#C68B59' },
  { name: 'Cognac Brown', hex: '#8B4513' },
  { name: 'Cognac Brown', hex: '#9A381E' },
  { name: 'Cognac Brown', hex: '#A0522D' },
  { name: 'Dark Chocolate Brown', hex: '#3D2314' },
  { name: 'Dark Chocolate Brown', hex: '#4A2C11' },
  { name: 'Dark Chocolate Brown', hex: '#2E180E' },
  { name: 'Dark Chocolate Brown', hex: '#5C4033' },

  // Reds & Burgundy
  { name: 'Burgundy / Wine', hex: '#800020' },
  { name: 'Burgundy / Wine', hex: '#722F37' },
  { name: 'Burgundy / Wine', hex: '#581845' },
  { name: 'Burgundy / Wine', hex: '#4A0E17' },
  { name: 'Ruby Red', hex: '#9B111E' },
  { name: 'Ruby Red', hex: '#BE123C' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Red', hex: '#B91C1C' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Rose Gold', hex: '#B76E79' },
  { name: 'Rose Gold', hex: '#E0A899' },
  { name: 'Rose Gold', hex: '#ECC5C0' },
  { name: 'Blush Pink', hex: '#F4C2C2' },
  { name: 'Blush Pink', hex: '#FDA4AF' },
  { name: 'Blush Pink', hex: '#FBCFE8' },
  { name: 'Fuchsia / Magenta', hex: '#D946EF' },
  { name: 'Fuchsia / Magenta', hex: '#C026D3' },
  { name: 'Fuchsia / Magenta', hex: '#FF00FF' },
  { name: 'Coral', hex: '#FA8072' },
  { name: 'Coral', hex: '#FB7185' },
  { name: 'Coral', hex: '#FF6F61' },

  // Warm Golds & Oranges
  { name: 'Terracotta / Orange', hex: '#C85A17' },
  { name: 'Terracotta / Orange', hex: '#EA580C' },
  { name: 'Terracotta / Orange', hex: '#F97316' },
  { name: 'Mustard Yellow', hex: '#EAB308' },
  { name: 'Mustard Yellow', hex: '#CA8A04' },
  { name: 'Mustard Yellow', hex: '#D97706' },
  { name: 'Yellow', hex: '#FACC15' },
  { name: 'Gold / Champagne', hex: '#D4AF37' },
  { name: 'Gold / Champagne', hex: '#CFB53B' },
  { name: 'Gold / Champagne', hex: '#E6CA65' },
  { name: 'Gold / Champagne', hex: '#FFD700' },
  { name: 'Bronze', hex: '#CD7F32' },
  { name: 'Bronze', hex: '#8C7853' },
  { name: 'Bronze', hex: '#A57C1B' },

  // Greens
  { name: 'Emerald Green', hex: '#064E3B' },
  { name: 'Emerald Green', hex: '#047857' },
  { name: 'Emerald Green', hex: '#10B981' },
  { name: 'Emerald Green', hex: '#50C878' },
  { name: 'Forest Green', hex: '#14532D' },
  { name: 'Forest Green', hex: '#166534' },
  { name: 'Forest Green', hex: '#22543D' },
  { name: 'Olive Green', hex: '#556B2F' },
  { name: 'Olive Green', hex: '#6B8E23' },
  { name: 'Olive Green', hex: '#4A5D23' },
  { name: 'Sage Green', hex: '#9CAF88' },
  { name: 'Sage Green', hex: '#A7F3D0' },
  { name: 'Sage Green', hex: '#86EFAC' },
  { name: 'Mint Green', hex: '#3EB489' },
  { name: 'Lime Green', hex: '#84CC16' },

  // Blues
  { name: 'Teal / Turquoise', hex: '#0D9488' },
  { name: 'Teal / Turquoise', hex: '#0E7490' },
  { name: 'Teal / Turquoise', hex: '#008080' },
  { name: 'Teal / Turquoise', hex: '#40E0D0' },
  { name: 'Navy Blue', hex: '#1E3A8A' },
  { name: 'Navy Blue', hex: '#172554' },
  { name: 'Navy Blue', hex: '#0F172A' },
  { name: 'Navy Blue', hex: '#000080' },
  { name: 'Navy Blue', hex: '#1B2A4A' },
  { name: 'Royal Blue', hex: '#1D4ED8' },
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Royal Blue', hex: '#0F52BA' },
  { name: 'Cobalt Blue', hex: '#0284C7' },
  { name: 'Cobalt Blue', hex: '#0369A1' },
  { name: 'Cobalt Blue', hex: '#0047AB' },
  { name: 'Powder Blue', hex: '#93C5FD' },
  { name: 'Powder Blue', hex: '#BAE6FD' },
  { name: 'Powder Blue', hex: '#B0E0E6' },

  // Purples
  { name: 'Plum / Deep Purple', hex: '#581C87' },
  { name: 'Plum / Deep Purple', hex: '#4C1D95' },
  { name: 'Plum / Deep Purple', hex: '#3B0764' },
  { name: 'Plum / Deep Purple', hex: '#701A75' },
  { name: 'Purple', hex: '#9333EA' },
  { name: 'Lavender / Lilac', hex: '#A855F7' },
  { name: 'Lavender / Lilac', hex: '#C084FC' },
  { name: 'Lavender / Lilac', hex: '#DDD6FE' },
  { name: 'Lavender / Lilac', hex: '#E9D5FF' }
];

export function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return null;
  let clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function getColorDistance(rgb1, rgb2) {
  // Perceptual Euclidean distance with human eye luminance weighting
  const dr = rgb1.r - rgb2.r;
  const dg = rgb1.g - rgb2.g;
  const db = rgb1.b - rgb2.b;
  return Math.sqrt(0.299 * dr * dr + 0.587 * dg * dg + 0.114 * db * db);
}

/**
 * Returns the closest luxury color name given any hex string (e.g. "#800020" -> "Burgundy / Wine")
 */
export function getColorNameFromHex(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return '';

  let closestColor = LUXURY_PALETTE[0];
  let minDistance = Infinity;

  for (const item of LUXURY_PALETTE) {
    const itemRgb = hexToRgb(item.hex);
    if (!itemRgb) continue;
    const dist = getColorDistance(rgb, itemRgb);
    if (dist < minDistance) {
      minDistance = dist;
      closestColor = item;
    }
  }

  return closestColor.name;
}

function rgbToHex(r, g, b) {
  const toHex = (n) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Intelligent AI / Client-Side Dominant Color Detector for Product Images
 * Analyzes image pixels, filters out studio backdrops (white/light-grey/cream),
 * quantizes colors, scores by frequency & chroma, and maps to luxury fashion color names & HEX.
 */
export async function detectDominantColorsFromImage(source, maxPalette = 5) {
  if (typeof window === 'undefined') return null;

  return new Promise((resolve) => {
    let imgUrl = '';
    let shouldRevoke = false;

    if (source instanceof Blob || source instanceof File) {
      imgUrl = URL.createObjectURL(source);
      shouldRevoke = true;
    } else if (typeof source === 'string') {
      imgUrl = source;
    } else if (source?.src) {
      imgUrl = source.src;
    } else {
      return resolve(null);
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 100; // 100x100 = 10,000 pixels (ultra-fast < 15ms)
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          if (shouldRevoke) URL.revokeObjectURL(imgUrl);
          return resolve(null);
        }

        ctx.drawImage(img, 0, 0, size, size);
        const imgData = ctx.getImageData(0, 0, size, size);
        const data = imgData.data;

        // 1. Detect common studio background from border pixels
        const borderPixels = [];
        for (let x = 0; x < size; x++) {
          const topIdx = (0 * size + x) * 4;
          const btmIdx = ((size - 1) * size + x) * 4;
          borderPixels.push({ r: data[topIdx], g: data[topIdx + 1], b: data[topIdx + 2] });
          borderPixels.push({ r: data[btmIdx], g: data[btmIdx + 1], b: data[btmIdx + 2] });
        }
        for (let y = 1; y < size - 1; y++) {
          const leftIdx = (y * size + 0) * 4;
          const rightIdx = (y * size + (size - 1)) * 4;
          borderPixels.push({ r: data[leftIdx], g: data[leftIdx + 1], b: data[leftIdx + 2] });
          borderPixels.push({ r: data[rightIdx], g: data[rightIdx + 1], b: data[rightIdx + 2] });
        }

        let bR = 0, bG = 0, bB = 0;
        for (const bp of borderPixels) {
          bR += bp.r;
          bG += bp.g;
          bB += bp.b;
        }
        const avgBorder = {
          r: bR / borderPixels.length,
          g: bG / borderPixels.length,
          b: bB / borderPixels.length
        };

        const isBorderLightOrWhite = avgBorder.r > 205 && avgBorder.g > 205 && avgBorder.b > 205;

        // 2. Sample pixels and bucket into color bins
        const buckets = {};
        let subjectPixelCount = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a < 120) continue; // ignore transparent pixels

          // Distance from border background
          const distToBorder = getColorDistance({ r, g, b }, avgBorder);
          const isNearWhite = r > 240 && g > 240 && b > 240;

          // If border is light background and this pixel matches it closely, treat as background
          const isBackground = (isBorderLightOrWhite && distToBorder < 38) || isNearWhite;

          const maxVal = Math.max(r, g, b);
          const minVal = Math.min(r, g, b);
          const chroma = maxVal - minVal;

          // Bucket by 24 for clean grouping
          const binR = Math.round(r / 24) * 24;
          const binG = Math.round(g / 24) * 24;
          const binB = Math.round(b / 24) * 24;
          const key = `${binR},${binG},${binB}`;

          if (!buckets[key]) {
            buckets[key] = {
              r: 0,
              g: 0,
              b: 0,
              count: 0,
              chromaSum: 0,
              isBgCount: 0
            };
          }

          buckets[key].r += r;
          buckets[key].g += g;
          buckets[key].b += b;
          buckets[key].count++;
          buckets[key].chromaSum += chroma;
          if (isBackground) buckets[key].isBgCount++;
          if (!isBackground) subjectPixelCount++;
        }

        // 3. Score buckets
        const candidateList = [];
        for (const key in buckets) {
          const b = buckets[key];
          const avgR = b.r / b.count;
          const avgG = b.g / b.count;
          const avgB = b.b / b.count;
          const avgChroma = b.chromaSum / b.count;
          const bgRatio = b.isBgCount / b.count;

          // Filter out buckets that are overwhelmingly background (unless almost all pixels are background)
          if (subjectPixelCount > 300 && bgRatio > 0.85) {
            continue;
          }

          // Score prioritizes vivid subject fashion colors, while still allowing dark/black/white items
          const score = b.count * (1 + (avgChroma / 255) * 1.5) * (1 - bgRatio * 0.7);
          const hex = rgbToHex(avgR, avgG, avgB);
          const name = getColorNameFromHex(hex);

          candidateList.push({
            hex,
            name,
            score,
            count: b.count,
            chroma: avgChroma
          });
        }

        // Sort descending by score
        candidateList.sort((a, b) => b.score - a.score);

        // Deduplicate similar color names to create a rich diverse palette
        const palette = [];
        const seenNames = new Set();
        const seenHexes = new Set();

        for (const item of candidateList) {
          if (!seenNames.has(item.name) && !seenHexes.has(item.hex)) {
            palette.push({ hex: item.hex, name: item.name });
            seenNames.add(item.name);
            seenHexes.add(item.hex);
            if (palette.length >= maxPalette) break;
          }
        }

        if (palette.length === 0 && candidateList.length > 0) {
          palette.push({ hex: candidateList[0].hex, name: candidateList[0].name });
        }

        const primary = palette[0] || { hex: '#111111', name: 'Black' };

        if (shouldRevoke) URL.revokeObjectURL(imgUrl);
        resolve({ primary, palette });
      } catch (err) {
        if (shouldRevoke) URL.revokeObjectURL(imgUrl);
        resolve(null);
      }
    };

    img.onerror = () => {
      if (shouldRevoke) URL.revokeObjectURL(imgUrl);
      resolve(null);
    };

    img.src = imgUrl;
  });
}
