const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  itemCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
