const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  id: { type: String, required: true },
  colorName: { type: String, required: true },
  colorCode: { type: String, default: '#000000' },
  images: [{ type: String }],
  stock: { type: Number, default: 10 },
  sizes: [{ type: String }]
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  categoryName: { type: String, default: '' },
  brand: { type: String, default: 'SMP Luxury' },
  price: { type: Number, required: true },
  comparePrice: { type: Number, default: null },
  discount: { type: String, default: '' },
  image: { type: String, default: '' },
  imagePublicId: { type: String, default: '' }, // Cloudinary public_id for deletion
  description: { type: String, default: '' },
  details: [{ type: String }],
  stock: { type: Number, default: 10 },
  gender: { type: String, default: '' }, // 'men', 'women', 'unisex'
  color: { type: String, default: '' }, // e.g. 'Emerald Green', 'Burgundy'
  colorCode: { type: String, default: '#111111' }, // Hex color for primary image swatch
  sizes: [{ type: String }], // Optional sizes, e.g. ['7', '8', '9'] or ['EU 40', 'EU 41']
  variants: [VariantSchema], // Dynamic Color Variants
  featured: { type: Boolean, default: true },
  badge: { type: String, default: 'New' },
  // Dynamic SEO Fields
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  seoKeywords: { type: String, default: '' },
  slug: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
