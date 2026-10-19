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
  products: [
    {
      id: 'prod-1',
      title: 'Burgundy Leather Top Handle Bag',
      category: 'bags',
      categoryName: 'Bags',
      brand: 'SMP Luxury',
      price: 490,
      comparePrice: 650,
      discount: '-25%',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      description: 'Sculpted calfskin leather with polished gold-tone hardware clasp. Features reinforced top handles and a detachable shoulder strap for effortless versatility.',
      details: ['100% Genuine Italian Calfskin', '24K Gold electroplated lock', 'Interior slip & zip compartments', 'Protective bottom metal studs'],
      stock: 12,
      featured: true,
      badge: 'Bestseller',
      createdAt: '2026-10-15T10:00:00Z'
    },
    {
      id: 'prod-2',
      title: 'Green Gold-Accent Structured Bag',
      category: 'bags',
      categoryName: 'Bags',
      brand: 'SMP Atelier',
      price: 520,
      comparePrice: 690,
      discount: '-25%',
      image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80',
      description: 'Deep forest green smooth leather with arched satin-brass hardware. Clean geometric lines create a statement silhouette for evening galas or daytime poise.',
      details: ['Smooth textured box calfskin', 'Solid brass arch handle', 'Magnetic snap closure', 'Suede interior lining'],
      stock: 8,
      featured: true,
      badge: 'New Arrival',
      createdAt: '2026-10-16T11:00:00Z'
    },
    {
      id: 'prod-3',
      title: 'Pearl Handle Satin Evening Clutch',
      category: 'bags',
      categoryName: 'Bags',
      brand: 'SMP Couture',
      price: 360,
      comparePrice: 480,
      discount: '-25%',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
      description: 'Lustrous ivory pleated satin adorned with a luminous simulated freshwater pearl handle and crystal-pavé floral kiss-lock closure.',
      details: ['Pleated silk-satin shell', 'Graduated pearl arch handle', 'Crystal-encrusted jeweled clasp', 'Includes delicate chain strap'],
      stock: 15,
      featured: true,
      badge: 'Limited Edition',
      createdAt: '2026-10-16T14:30:00Z'
    },
    {
      id: 'prod-4',
      title: 'Burgundy Crescent Shoulder Bag',
      category: 'bags',
      categoryName: 'Bags',
      brand: 'SMP Maison',
      price: 380,
      comparePrice: 490,
      discount: '-22%',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      description: 'High-gloss patent burgundy finish with an ergonomic crescent silhouette. Sits snugly under the shoulder with comfortable contoured strap.',
      details: ['Glossy patent leather', 'Minimalist metallic piping', 'YKK luxury zip closure', 'Compact yet fits smartphone & essentials'],
      stock: 19,
      featured: true,
      badge: 'Trending',
      createdAt: '2026-10-17T09:20:00Z'
    },
    {
      id: 'prod-5',
      title: 'Royal Chronograph Steel & Gold Watch',
      category: 'watches',
      categoryName: 'Watches',
      brand: 'SMP Horology',
      price: 790,
      comparePrice: 1100,
      discount: '-28%',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      description: 'Two-tone 316L stainless steel with yellow gold PVD plating. Features a deep sunburst dial, luminescent markers, and three precision subdials.',
      details: ['Precision Swiss quartz movement', 'Scratch-resistant Sapphire crystal glass', '100m Water resistance', 'Deployment clasp with safety lock'],
      stock: 7,
      featured: true,
      badge: 'Masterpiece',
      createdAt: '2026-10-14T08:00:00Z'
    },
    {
      id: 'prod-6',
      title: 'Obsidian Black Onyx Dial Timepiece',
      category: 'watches',
      categoryName: 'Watches',
      brand: 'SMP Horology',
      price: 680,
      comparePrice: 890,
      discount: '-23%',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      description: 'Monochromatic satin black steel casing with minimalist rose-gold hour batons and genuine Italian alligator-embossed leather strap.',
      details: ['40mm Slimline casing', 'Anti-reflective sapphire coating', 'Japanese automatic movement', 'Water resistant to 50m'],
      stock: 10,
      featured: true,
      badge: 'Exclusive',
      createdAt: '2026-10-15T15:00:00Z'
    },
    {
      id: 'prod-7',
      title: 'Monaco Rose Gold Skeleton Watch',
      category: 'watches',
      categoryName: 'Watches',
      brand: 'SMP Horology',
      price: 850,
      comparePrice: 1250,
      discount: '-32%',
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
      description: 'Exposed mechanical gears in an intricate skeleton framework encased in high-grade 18K rose gold plated alloy.',
      details: ['Automatic self-winding mechanism', 'Exposed front & exhibition case back', 'Hand-stitched brown leather band', 'Luminous hands'],
      stock: 5,
      featured: true,
      badge: 'Hot Seller',
      createdAt: '2026-10-17T11:45:00Z'
    },
    {
      id: 'prod-8',
      title: 'Cognac Leather Bit Loafers',
      category: 'footwear',
      categoryName: 'Footwear',
      brand: 'SMP Calzature',
      price: 450,
      comparePrice: 590,
      discount: '-24%',
      image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
      description: 'Burnished cognac calfskin loafers accented with brushed brass horsebit hardware. Hand-stitched apron toe and cushioned leather insole.',
      details: ['Handcrafted Blake-stitched sole', 'Full grain burnished leather', 'Memory foam comfort arch support', 'Non-slip rubber heel insert'],
      stock: 14,
      featured: true,
      badge: 'Classic',
      createdAt: '2026-10-13T12:00:00Z'
    },
    {
      id: 'prod-9',
      title: 'Nude Patent Stiletto Pumps',
      category: 'footwear',
      categoryName: 'Footwear',
      brand: 'SMP Couture',
      price: 420,
      comparePrice: 560,
      discount: '-25%',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      description: 'Flawless nude patent leather pointed-toe pumps with a sleek 85mm stiletto heel. Engineered for posture-perfect comfort.',
      details: ['High-shine mirror patent finish', 'Padded goat leather lining', 'Sculpted 85mm heel', 'Iconic red-tinted edge detailing'],
      stock: 11,
      featured: true,
      badge: 'Signature',
      createdAt: '2026-10-15T18:00:00Z'
    },
    {
      id: 'prod-10',
      title: 'Monogram Low-Top Luxury Sneakers',
      category: 'footwear',
      categoryName: 'Footwear',
      brand: 'SMP Streetwear',
      price: 390,
      comparePrice: 520,
      discount: '-25%',
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      description: 'Crisp white calfskin leather with monogram brown embossed suede heel tab and lightweight vulcanized rubber platform.',
      details: ['Supple Italian calfskin upper', 'Perforated toe ventilation', 'Breathable terry lining', 'Durable cupsole with logo tread'],
      stock: 22,
      featured: true,
      badge: 'New',
      createdAt: '2026-10-17T16:10:00Z'
    }
  ],
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

// ── Products ──
function getProducts(category, search) {
  const db = readDb();
  let list = (db.products || []).map(p => ({ ...p, _id: p._id || p.id }));
  
  if (category && category !== 'all') {
    list = list.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
  }
  
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(p => 
      (p.title || '').toLowerCase().includes(s) ||
      (p.brand || '').toLowerCase().includes(s) ||
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
