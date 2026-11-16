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
