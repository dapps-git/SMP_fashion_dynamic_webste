require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Brand = require('./models/Brand');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Admin = require('./models/Admin');
const fileDb = require('./db');

async function syncAllToMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is missing in backend/.env');
    process.exit(1);
  }

  console.log('🔄 Connecting to MongoDB...');
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ Connected successfully to MongoDB!');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }

  const data = fileDb.getDb();

  // 1. Sync Admin
  try {
    const email = (process.env.ADMIN_EMAIL || 'fashionauraadmin@gmail.com').toLowerCase().trim();
    const passwordHash = process.env.ADMIN_PASSWORD_HASH || '$2b$10$tbYy3u01G9pojkblapphkOCLmcxMVjtar8kpb5CSoLkR.SA87R9pu';
    const name = process.env.ADMIN_NAME || 'Fashion Aura Admin';

    await Admin.findOneAndUpdate(
      { email },
      { email, password: passwordHash, name, role: 'admin' },
      { upsert: true, new: true }
    );
    console.log('✅ Admin user synced.');
  } catch (err) {
    console.warn('⚠️ Admin sync error:', err.message);
  }

  // 2. Sync Categories
  try {
    if (data.categories && data.categories.length > 0) {
      for (const cat of data.categories) {
        await Category.findOneAndUpdate(
          { slug: cat.slug },
          {
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
            image: cat.image || '',
            itemCount: cat.itemCount || 0
          },
          { upsert: true, new: true }
        );
      }
      console.log(`✅ Synced ${data.categories.length} categories.`);
    }
  } catch (err) {
    console.warn('⚠️ Category sync error:', err.message);
  }

  // 3. Sync Brands
  try {
    if (data.brands && data.brands.length > 0) {
      for (const brand of data.brands) {
        await Brand.findOneAndUpdate(
          { slug: brand.slug },
          {
            name: brand.name,
            slug: brand.slug,
            logo: brand.logo || '',
            description: brand.description || ''
          },
          { upsert: true, new: true }
        );
      }
      console.log(`✅ Synced ${data.brands.length} brands.`);
    }
  } catch (err) {
    console.warn('⚠️ Brand sync error:', err.message);
  }

  // 4. Sync Products & Variants
  try {
    if (data.products && data.products.length > 0) {
      for (const prod of data.products) {
        const prodData = {
          title: prod.title,
          category: prod.category,
          categoryName: prod.categoryName || prod.category,
          brand: prod.brand || 'SMP Luxury',
          price: prod.price,
          comparePrice: prod.comparePrice,
          discount: prod.discount || '',
          image: prod.image || '',
          imagePublicId: prod.imagePublicId || '',
          description: prod.description || '',
          details: prod.details || [],
          stock: prod.stock !== undefined ? prod.stock : 10,
          gender: prod.gender || '',
          color: prod.color || '',
          colorCode: prod.colorCode || '#111111',
          sizes: prod.sizes || [],
          variants: prod.variants || [],
          featured: prod.featured !== undefined ? prod.featured : true,
          badge: prod.badge || '',
          seoTitle: prod.seoTitle || '',
          seoDescription: prod.seoDescription || '',
          seoKeywords: prod.seoKeywords || '',
          slug: prod.slug || ''
        };

        // Match by title or slug
        const query = prod.slug ? { slug: prod.slug } : { title: prod.title };
        await Product.findOneAndUpdate(query, prodData, { upsert: true, new: true });
      }
      console.log(`✅ Synced ${data.products.length} products (with all variants & Cloudinary images).`);
    } else {
      console.log('ℹ️ No products to sync from local database.');
    }
  } catch (err) {
    console.warn('⚠️ Product sync error:', err.message);
  }

  console.log('🎉 Database synchronization complete!');
  process.exit(0);
}

syncAllToMongo();

