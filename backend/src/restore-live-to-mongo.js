require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Category = require('./models/Category');
const Brand = require('./models/Brand');
const Product = require('./models/Product');
const Admin = require('./models/Admin');

const LIVE_API_BASE = 'https://tweaki.pw/SMP/api';

async function restoreLiveToMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is missing in backend/.env');
    process.exit(1);
  }

  console.log(`🌐 Fetching live catalog from ${LIVE_API_BASE}...`);
  
  // 1. Fetch live products
  const prodRes = await fetch(`${LIVE_API_BASE}/products`);
  if (!prodRes.ok) throw new Error(`Failed to fetch products: ${prodRes.statusText}`);
  const liveProducts = await prodRes.json();
  console.log(`📦 Fetched ${liveProducts.length} live products!`);

  // 2. Fetch live categories
  const catRes = await fetch(`${LIVE_API_BASE}/categories`);
  const liveCategories = catRes.ok ? await catRes.json() : [];
  console.log(`📂 Fetched ${liveCategories.length} live categories!`);

  // 3. Fetch live brands
  const brandRes = await fetch(`${LIVE_API_BASE}/brands`);
  const liveBrands = brandRes.ok ? await brandRes.json() : [];
  console.log(`🏷️ Fetched ${liveBrands.length} live brands!`);

  // 4. Update local db.json as backup
  const dbJsonPath = path.join(__dirname, '..', 'data', 'db.json');
  let localDb = {};
  try {
    localDb = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
  } catch (e) {
    localDb = {};
  }
  localDb.products = liveProducts;
  if (liveCategories.length > 0) localDb.categories = liveCategories;
  if (liveBrands.length > 0) localDb.brands = liveBrands;
  fs.writeFileSync(dbJsonPath, JSON.stringify(localDb, null, 2), 'utf8');
  console.log(`💾 Saved full backup with ${liveProducts.length} products to backend/data/db.json!`);

  // 5. Connect to MongoDB Atlas
  console.log('🔄 Connecting to MongoDB Atlas...');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('✅ Connected to MongoDB Atlas!');

  // Clear products collection first to guarantee clean 1:1 match with live site
  await Product.deleteMany({});
  console.log('🧹 Cleaned existing Atlas products table to prevent duplicates or slug collisions.');

  // 6. Sync Categories into Atlas
  for (const cat of liveCategories) {
    await Category.findOneAndUpdate(
      { slug: cat.slug },
      {
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        image: cat.image || '',
        itemCount: cat.itemCount || 0
      },
      { upsert: true, returnDocument: 'after' }
    );
  }
  console.log(`✅ Synced ${liveCategories.length} categories to Atlas.`);

  // 7. Sync Brands into Atlas
  for (const brand of liveBrands) {
    await Brand.findOneAndUpdate(
      { slug: brand.slug },
      {
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo || '',
        description: brand.description || ''
      },
      { upsert: true, returnDocument: 'after' }
    );
  }
  console.log(`✅ Synced ${liveBrands.length} brands to Atlas.`);

  // 8. Insert all 32 Products & Variants into Atlas
  const usedSlugs = new Set();
  const productDocs = liveProducts.map(p => {
    let finalSlug = p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (usedSlugs.has(finalSlug)) {
      const suffix = (p.id || '').replace(/^prod-/, '') || Math.floor(Math.random() * 10000);
      finalSlug = `${finalSlug}-${suffix}`;
    }
    usedSlugs.add(finalSlug);

    return {
      id: p.id || p._id,
      title: p.title,
      category: p.category,
      categoryName: p.categoryName || p.category,
      brand: p.brand || 'SMP Luxury',
      price: p.price,
      comparePrice: p.comparePrice,
      discount: p.discount || '',
      image: p.image || '',
      imagePublicId: p.imagePublicId || '',
      description: p.description || '',
      details: p.details || [],
      stock: p.stock !== undefined ? p.stock : 15,
      gender: p.gender || '',
      color: p.color || '',
      colorCode: p.colorCode || '#111111',
      sizes: p.sizes || [],
      variants: p.variants || [],
      featured: p.featured !== undefined ? p.featured : true,
      badge: p.badge || '',
      seoTitle: p.seoTitle || '',
      seoDescription: p.seoDescription || '',
      seoKeywords: p.seoKeywords || '',
      slug: finalSlug,
      createdAt: p.createdAt ? new Date(p.createdAt) : new Date()
    };
  });

  await Product.insertMany(productDocs);
  console.log(`🎉 Successfully inserted all ${productDocs.length} products with all variants into MongoDB Atlas!`);

  // 9. Verify product count in Atlas
  const finalCount = await Product.countDocuments();
  console.log(`🔥 Total products now verified in Atlas smp_fashion: ${finalCount}`);

  process.exit(0);
}

restoreLiveToMongo().catch(err => {
  console.error('❌ Restore error:', err);
  process.exit(1);
});
