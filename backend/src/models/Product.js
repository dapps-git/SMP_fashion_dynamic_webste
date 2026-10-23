const mongoose = require('mongoose');

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
  sizes: [{ type: String }], // Optional sizes, e.g. ['7', '8', '9'] or ['EU 40', 'EU 41']
  featured: { type: Boolean, default: true },
  badge: { type: String, default: 'New' },
  // Dynamic SEO Fields
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  seoKeywords: { type: String, default: '' },
  slug: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
