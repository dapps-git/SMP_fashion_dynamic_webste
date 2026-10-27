const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

const INITIAL_DATA = {
  admin: {
    username: 'fashionauraadmin@gmail.com',
    password: 'fashionauraadmin#8989',
    name: 'Fashion Aura Admin',
    email: 'fashionauraadmin@gmail.com'
  },
  categories: [
    {
      id: 'cat-1',
      name: 'Footwear',
      slug: 'footwear',
      description: 'Handcrafted luxury sneakers, heels, and classic loafers',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      itemCount: 4
    },
    {
      id: 'cat-2',
      name: 'Watches',
      slug: 'watches',
      description: 'Master crafted precision timepieces and luxury chronographs',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      itemCount: 4
    },
    {
      id: 'cat-3',
      name: 'Bags',
      slug: 'bags',
      description: 'Iconic top-handle bags, calfskin clutches, and crossbodies',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      itemCount: 4
    },
    {
      id: 'cat-4',
      name: 'Accessories',
      slug: 'accessories',
      description: 'Finishing touches: fine belts, luxury sunglasses, and jewelry',
      image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80',
      itemCount: 2
    }
  ],
  brands: [
    {
      id: 'brand-1',
      name: 'Richard Mille',
      slug: 'richard-mille',
      logo: '/IMG_9307.PNG',
      description: 'Ultra-high-end luxury Swiss watches and horological innovation'
    },
    {
      id: 'brand-2',
      name: 'Bvlgari',
      slug: 'bvlgari',
      logo: '/IMG_9308.PNG',
      description: 'Iconic Italian luxury master jeweler and grand complication horology'
    },
    {
      id: 'brand-3',
      name: 'Omega',
      slug: 'omega',
      logo: '/IMG_9309.PNG',
      description: 'Prestigious Swiss precision timepieces and master chronometers'
    },
    {
      id: 'brand-4',
      name: 'Chopard',
      slug: 'chopard',
      logo: '/IMG_9310.PNG',
      description: 'Exquisite artisan Swiss luxury watches and high jewelry'
    },
    {
      id: 'brand-5',
      name: 'Chaumet Paris',
      slug: 'chaumet-paris',
      logo: '/IMG_9311.PNG',
      description: 'Place Vendôme Parisian royal jeweler and high-end watchmaker'
    },
    {
      id: 'brand-6',
      name: 'Graff',
      slug: 'graff',
      logo: '/IMG_9312.PNG',
      description: 'Unrivaled high-jewelry maison and diamond-set master horology'
    },
    {
      id: 'brand-7',
      name: 'SMP Luxury',
      slug: 'smp-luxury',
      logo: '/smp-logo.png',
      description: 'SMP Atelier flagship handcrafted footwear and fine leather'
    }
  ],
  products: [],
  orders: [
    {
      id: 'ORD-9841',
      customerName: 'Fatima Al Mansoori',
      customerPhone: '+971 50 847 2391',
      deliveryAddress: 'Villa 14, Al Safa 2, Jumeirah',
      emirate: 'Dubai',
      notes: 'Call before arriving, deliver after 2 PM',
      items: [
        {
          productId: 'prod-1',
          title: 'Burgundy Leather Top Handle Bag',
          price: 490,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
        }
      ],
      totalPrice: 490,
      currency: 'AED',
      paymentMethod: 'Cash / Card on Delivery (Inspect First)',
      status: 'Confirmed',
      createdAt: '2026-10-18T08:20:00Z'
    },
    {
      id: 'ORD-9840',
      customerName: 'Mohamed Bin Hamad',
      customerPhone: '+971 52 391 7740',
      deliveryAddress: 'Etihad Towers, Tower 3, Apt 1804, Corniche',
      emirate: 'Abu Dhabi',
      notes: 'Please leave with reception if not answering',
      items: [
        {
          productId: 'prod-5',
          title: 'Royal Chronograph Steel & Gold Watch',
          price: 790,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
        }
      ],
      totalPrice: 790,
      currency: 'AED',
      paymentMethod: 'Cash / Card on Delivery (Inspect First)',
      status: 'Shipped',
      createdAt: '2026-10-17T14:40:00Z'
    },
    {
      id: 'ORD-9839',
      customerName: 'Sarah Jenkins',
      customerPhone: '+971 55 918 3402',
      deliveryAddress: 'Al Majaz Waterfront, Blue Tower, Flat 802',
      emirate: 'Sharjah',
      notes: 'Fragile item, inspect before payment approved',
      items: [
        {
          productId: 'prod-3',
          title: 'Pearl Handle Satin Evening Clutch',
          price: 360,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
        }
      ],
      totalPrice: 360,
      currency: 'AED',
      paymentMethod: 'Cash / Card on Delivery (Inspect First)',
      status: 'Delivered',
      createdAt: '2026-10-16T19:10:00Z'
    }
  ]
};

function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
      fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return JSON.parse(JSON.stringify(INITIAL_DATA));
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const data = JSON.parse(raw);
    if (!data.categories) data.categories = INITIAL_DATA.categories;
    if (!data.products) data.products = INITIAL_DATA.products;
    if (!data.orders) data.orders = INITIAL_DATA.orders;
    if (!data.admin) data.admin = INITIAL_DATA.admin;
    if (!data.brands || data.brands.length === 0) data.brands = INITIAL_DATA.brands;
    return data;
  } catch (err) {
    console.error('Error reading DB, using initial data:', err);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }
}

function writeDb(data) {
  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// ── Categories ──
function getCategories() {
  const db = readDb();
  return (db.categories || []).map(c => ({ ...c, _id: c._id || c.id }));
}

function createCategory({ name, description, image }) {
  const db = readDb();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = `cat-${Date.now()}`;
  const newCat = {
    id,
    _id: id,
    name,
    slug,
    description: description || '',
    image: image || '',
    itemCount: 0,
    createdAt: new Date().toISOString()
  };
  db.categories.push(newCat);
  writeDb(db);
  return newCat;
}

function deleteCategory(id) {
  const db = readDb();
  db.categories = db.categories.filter(c => c.id !== id && c._id !== id);
  writeDb(db);
  return true;
}

// ── Brands ──
function getBrands() {
  const db = readDb();
  return (db.brands || []).map(b => ({ ...b, _id: b._id || b.id }));
}

function createBrand({ name, description, logo }) {
  const db = readDb();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = `brand-${Date.now()}`;
  const newBrand = {
    id,
    _id: id,
    name,
    slug,
    description: description || '',
    logo: logo || '',
    createdAt: new Date().toISOString()
  };
  if (!db.brands) db.brands = [];
  db.brands.push(newBrand);
  writeDb(db);
  return newBrand;
}

function deleteBrand(id) {
  const db = readDb();
  db.brands = (db.brands || []).filter(b => b.id !== id && b._id !== id);
  writeDb(db);
  return true;
}

// ── Products ──
function getProducts(category, search, gender, brand) {
  const db = readDb();
  let list = (db.products || []).map(p => ({ ...p, _id: p._id || p.id }));
  
  if (category && category !== 'all') {
    list = list.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
  }
  
  if (gender && gender !== 'all') {
    list = list.filter(p => (p.gender || '').toLowerCase() === gender.toLowerCase());
  }

  if (brand && brand !== 'all') {
    const targetBrand = brand.toLowerCase();
    list = list.filter(p => (p.brand || '').toLowerCase() === targetBrand || (p.brand || '').toLowerCase().includes(targetBrand));
  }
  
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(p => 
      (p.title || '').toLowerCase().includes(s) ||
      (p.brand || '').toLowerCase().includes(s) ||
      (p.color || '').toLowerCase().includes(s) ||
      (p.description || '').toLowerCase().includes(s)
    );
  }
  return list;
}

function getProductById(id) {
  const db = readDb();
  const found = (db.products || []).find(p => p.id === id || p._id === id);
  return found ? { ...found, _id: found._id || found.id } : null;
}

function createProduct(productData) {
  const db = readDb();
  const id = `prod-${Date.now()}`;
  const newProd = {
    id,
    _id: id,
    ...productData,
    createdAt: new Date().toISOString()
  };
  db.products.unshift(newProd);

  // Update category item count
  const cat = db.categories.find(c => c.slug === (productData.category || '').toLowerCase());
  if (cat) cat.itemCount = (cat.itemCount || 0) + 1;

  writeDb(db);
  return newProd;
}

function updateProduct(id, updateData) {
  const db = readDb();
  const index = db.products.findIndex(p => p.id === id || p._id === id);
  if (index === -1) return null;

  db.products[index] = {
    ...db.products[index],
    ...updateData,
    id: db.products[index].id,
    _id: db.products[index]._id || db.products[index].id,
    updatedAt: new Date().toISOString()
  };

  writeDb(db);
  return db.products[index];
}

function deleteProduct(id) {
  const db = readDb();
  db.products = db.products.filter(p => p.id !== id && p._id !== id);
  writeDb(db);
  return true;
}

// ── Orders ──
function getOrders(status) {
  const db = readDb();
  let list = (db.orders || []).map(o => ({ ...o, _id: o._id || o.id, id: o.id || o.orderId }));
  if (status && status !== 'all') {
    list = list.filter(o => o.status === status);
  }
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function createOrder(orderData) {
  const db = readDb();
  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const newOrder = {
    id: orderId,
    _id: orderId,
    orderId,
    ...orderData,
    status: orderData.status || 'Pending',
    createdAt: new Date().toISOString()
  };
  if (!db.orders) db.orders = [];
  db.orders.unshift(newOrder);
  writeDb(db);
  return newOrder;
}

function updateOrderStatus(id, status) {
  const db = readDb();
  const order = (db.orders || []).find(o => o.id === id || o._id === id || o.orderId === id);
  if (!order) return null;
  order.status = status;
  writeDb(db);
  return { ...order, _id: order._id || order.id };
}

function deleteOrder(id) {
  const db = readDb();
  db.orders = (db.orders || []).filter(o => o.id !== id && o._id !== id && o.orderId !== id);
  writeDb(db);
  return true;
}

// ── Stats ──
function getStats() {
  const db = readDb();
  const products = db.products || [];
  const categories = db.categories || [];
  const orders = db.orders || [];

  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.totalPrice) || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  return {
    totalRevenue,
    totalOrders: orders.length,
    totalProducts: products.length,
    totalCategories: categories.length,
    pendingOrders,
    recentOrders: orders.slice(0, 10).map(o => ({ ...o, id: o.id || o.orderId }))
  };
}

module.exports = {
  getDb: readDb,
  saveDb: writeDb,
  getCategories,
  createCategory,
  deleteCategory,
  getBrands,
  createBrand,
  deleteBrand,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getStats
};
