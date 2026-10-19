'use client';

import { useState, useEffect } from 'react';
import {
  Eye,
  ShoppingCart,
  MessageSquare,
  ShieldCheck,
  Truck,
  CheckCircle,
  Search,
  ArrowRight,
  Star,
  X,
  Phone,
  MapPin,
  User,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  ExternalLink,
  SlidersHorizontal,
  Menu,
  Home as HomeIcon
} from 'lucide-react';

const WHATSAPP_NUMBER = '971525973132'; // +971 52 597 3132

// Fallback luxury data if backend is offline during first render
const FALLBACK_PRODUCTS = [
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
    badge: 'Bestseller'
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
    badge: 'New Arrival'
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
    badge: 'Limited Edition'
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
    badge: 'Masterpiece'
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
    badge: 'Exclusive'
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
    badge: 'Classic'
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
    badge: 'Signature'
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
    badge: 'New'
  }
];

export default function StorefrontPage() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick View Modal
  const [viewProduct, setViewProduct] = useState(null);

  // Buy Now / Address Modal
  const [orderModalProduct, setOrderModalProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [emirate, setEmirate] = useState('Dubai');
  const [notes, setNotes] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      }
    } catch (err) {
      console.log('Backend offline or fetching error, using curated data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Open Buy Now Modal
  const handleOpenBuyNow = (product) => {
    setOrderModalProduct(product);
    setQuantity(1);
    setCustomerName('');
    setCustomerPhone('');
    setDeliveryAddress('');
    setEmirate('Dubai');
    setNotes('');
    setOrderSuccess(false);
  };

  // Submit Order & Open WhatsApp
  const handleConfirmAndContinueWhatsApp = async (e) => {
    e.preventDefault();
    if (!orderModalProduct) return;
    setSubmittingOrder(true);

    const totalAmount = orderModalProduct.price * quantity;

    // 1. Save order to backend so admin can view full customer details, address, price, quantity, and images
    try {
      await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          deliveryAddress,
          emirate,
          notes,
          items: [
            {
              productId: orderModalProduct.id,
              title: orderModalProduct.title,
              price: orderModalProduct.price,
              quantity: quantity,
              image: orderModalProduct.image
            }
          ],
          totalPrice: totalAmount
        })
      });
    } catch (err) {
      console.warn('Backend order recording skipped or offline:', err);
    }

    // 2. Prepare WhatsApp message
    const formattedMessage =
      `🛍️ *NEW ORDER - SMP Super Master Products*
━━━━━━━━━━━━━━━━━━━━━
*Product:* ${orderModalProduct.title}
*Category:* ${orderModalProduct.categoryName || orderModalProduct.category}
*Quantity:* ${quantity}
*Price:* AED ${orderModalProduct.price}
*Total Amount:* AED ${totalAmount}

📸 *Product Image:* ${orderModalProduct.image}

📍 *Customer Shipping Details:*
*Name:* ${customerName}
*Phone:* ${customerPhone}
*Address:* ${deliveryAddress}
*Emirate:* ${emirate}
*Special Instructions:* ${notes || 'None'}
━━━━━━━━━━━━━━━━━━━━━
✨ *Payment:* Cash / Card on Delivery (Inspect First)
🚚 *Delivery:* Free Express Delivery across UAE

Please confirm my order and arrange delivery. Thank you!`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`;

    setSubmittingOrder(false);
    setOrderSuccess(true);

    // Open WhatsApp in a new tab
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 400);
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = activeCategory === 'all' || p.category?.toLowerCase() === activeCategory.toLowerCase();
    if (!matchesCat) return false;
    if (priceFilter === 'under-400') return p.price < 400;
    if (priceFilter === '400-600') return p.price >= 400 && p.price <= 600;
    if (priceFilter === 'above-600') return p.price > 600;
    return true;
  });

  // Dynamic SEO JSON-LD structured data for Google rich snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Store',
        '@id': 'https://smpfashion.ae/#store',
        name: 'SMP Super Master Products',
        url: 'https://smpfashion.ae',
        description: 'Curated luxury fashion in the UAE. High precision watches, handcrafted footwear, and Italian calfskin handbags.',
        telephone: '+971525973132',
        currenciesAccepted: 'AED',
        paymentAccepted: 'Cash, Card on Delivery',
        priceRange: 'AED 350 - AED 1500',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'AE',
          addressRegion: 'Dubai'
        }
      },
      {
        '@type': 'ItemList',
        itemListElement: products.slice(0, 10).map((p, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'Product',
            name: p.seoTitle || p.title,
            description: p.seoDescription || p.description,
            image: p.image,
            brand: {
              '@type': 'Brand',
              name: p.brand || 'SMP Luxury'
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'AED',
              price: p.price,
              availability: 'https://schema.org/InStock',
              seller: {
                '@type': 'Organization',
                name: 'SMP Super Master Products'
              }
            }
          }
        }))
      }
    ]
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Dynamic SEO JSON-LD structured data for Google & Bing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Announcement Bar - Seamless Infinite Train Marquee */}
      <div className="top-announcement" role="region" aria-label="Announcement Ticker">
        <div className="top-announcement-track">
          {/* Ticker Set 1 */}
          <div className="top-announcement-group">
            <span><strong>100% SECURE SHOPPING</strong></span>
            <span className="ticker-dot">|</span>
            <span><strong>QUALITY CHECK</strong></span>
            <span className="ticker-dot">|</span>
            <span><strong>FREE DELIVERY 🇦🇪</strong></span>
            <span className="ticker-dot">|</span>
            <span><strong>+971 52 597 3132</strong></span>
            <span className="ticker-dot">|</span>
          </div>
          {/* Ticker Set 2 (Exact duplicate for seamless infinite loop) */}
          <div className="top-announcement-group" aria-hidden="true">
            <span><strong>100% SECURE SHOPPING</strong></span>
            <span className="ticker-dot">|</span>
            <span><strong>QUALITY CHECK</strong></span>
            <span className="ticker-dot">|</span>
            <span><strong>FREE DELIVERY 🇦🇪</strong></span>
            <span className="ticker-dot">|</span>
            <span><strong>+971 52 597 3132</strong></span>
            <span className="ticker-dot">|</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="site-header">
        <div className="header-container">
          <div className="header-left">
            {/* Mobile Hamburger Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu size={24} />
            </button>

            <div className="brand-logo-wrap">
              <a href="#">
                <img
                  src="/smp-logo.png"
                  alt="SMP Logo"
                  className="brand-logo-img"
                />
              </a>
            </div>
          </div>

          <nav className="header-nav">
            <a href="#" className="nav-item">Home</a>
            <a href="#collections" className="nav-item">Collections</a>
            <a href="#collections" onClick={() => setActiveCategory('footwear')} className="nav-item">Footwear</a>
            <a href="#collections" onClick={() => setActiveCategory('watches')} className="nav-item">Watches</a>
            <a href="#collections" onClick={() => setActiveCategory('bags')} className="nav-item">Bags</a>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-drawer">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #ECE6DC' }}>
              <img src="/smp-logo.png" alt="SMP Logo" style={{ height: '64px', objectFit: 'contain' }} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', color: '#1C1917', cursor: 'pointer', padding: '4px' }}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <div className="mobile-drawer-links">
              <a
                href="#"
                className="mobile-drawer-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>Home</span>
                <ChevronRight size={16} color="#A45A28" />
              </a>
              <a
                href="#collections"
                className="mobile-drawer-link"
                onClick={() => { setActiveCategory('all'); setMobileMenuOpen(false); }}
              >
                <span>All Collections</span>
                <ChevronRight size={16} color="#A45A28" />
              </a>
              <a
                href="#collections"
                className="mobile-drawer-link"
                onClick={() => { setActiveCategory('footwear'); setMobileMenuOpen(false); }}
              >
                <span>Footwear</span>
                <ChevronRight size={16} color="#A45A28" />
              </a>
              <a
                href="#collections"
                className="mobile-drawer-link"
                onClick={() => { setActiveCategory('watches'); setMobileMenuOpen(false); }}
              >
                <span>Watches</span>
                <ChevronRight size={16} color="#A45A28" />
              </a>
              <a
                href="#collections"
                className="mobile-drawer-link"
                onClick={() => { setActiveCategory('bags'); setMobileMenuOpen(false); }}
              >
                <span>Bags</span>
                <ChevronRight size={16} color="#A45A28" />
              </a>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #ECE6DC' }}>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20SMP,%20I%20would%20like%20to%20order.`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#25D366',
                  color: '#fff',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '13px'
                }}
              >
                <MessageSquare size={16} />
                <span>WhatsApp VIP Order</span>
              </a>
            </div>
          </div>
        </>
      )}

      {/* Hero Section with Full View Banner Image */}
      <section className="hero-section">
        <div className="hero-banner-container">
          <img
            src="/image.png"
            alt="Super Master Products Luxury Fashion Banner"
            className="hero-banner-desktop"
          />
          <img
            src="/hero-mobile.jpg"
            alt="Super Master Products Luxury Mobile Banner"
            className="hero-banner-mobile"
          />
        </div>



        <div className="hero-overlay-content">
          <h1 className="hero-title-script">
            Fashion for your <br className="hero-break-mobile" />Passion
          </h1>
          <p className="hero-subtitle">
            Timeless pieces. Premium quality. Thoughtfully chosen to elevate your style and complete every moment. Direct delivery with inspection before payment.
          </p>

          {/* Clean Trust Text without background or box, separated with | */}
          <div className="hero-trust-strip-clean">
            <span>100% Secure Shopping</span>
            <span className="trust-pipe">|</span>
            <span>Quality Check</span>
            <span className="trust-pipe">|</span>
            <span>Free Delivery 🇦🇪</span>
          </div>

          <div className="hero-btn-row">
            <a
              href="#collections"
              className="hero-btn-primary"
            >
              <span>Explore Collections</span>
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20SMP,%20I%20want%20to%20view%20your%20latest%20arrivals.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn-secondary"
            >
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          EDITORIAL LUXURY 6-COLUMN PRODUCT LISTING (Matching Screenshot)
          ───────────────────────────────────────────────────────────── */}
      <section id="collections" className="products-section" style={{ padding: '48px 0 64px 0' }}>
        <div className="wide-container">

          {/* Centered ALL PRODUCTS Header */}
          <div className="all-products-header-wrap">
            <h2 className="all-products-title">ALL PRODUCTS</h2>
          </div>

          {/* Minimalist Category Filter Bar with Price Filter (Accessories Removed) */}
          <div className="editorial-filter-bar">
            <div className="editorial-cat-list">
              <button
                onClick={() => setActiveCategory('all')}
                className={`editorial-cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
                style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: activeCategory === 'all' ? '600' : '500' }}
              >
                ALL
              </button>
              <button
                onClick={() => setActiveCategory('footwear')}
                className={`editorial-cat-btn ${activeCategory === 'footwear' ? 'active' : ''}`}
                style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: activeCategory === 'footwear' ? '600' : '500' }}
              >
                FOOTWEAR
              </button>
              <button
                onClick={() => setActiveCategory('watches')}
                className={`editorial-cat-btn ${activeCategory === 'watches' ? 'active' : ''}`}
                style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: activeCategory === 'watches' ? '600' : '500' }}
              >
                WATCHES
              </button>
              <button
                onClick={() => setActiveCategory('bags')}
                className={`editorial-cat-btn ${activeCategory === 'bags' ? 'active' : ''}`}
                style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: activeCategory === 'bags' ? '600' : '500' }}
              >
                BAGS
              </button>
            </div>

            {/* Minimalist Filter Icon (No box, no text) */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowPriceFilter(!showPriceFilter)}
                className={`filter-icon-btn ${priceFilter !== 'all' ? 'active' : ''}`}
                title="Filter by Price"
                aria-label="Filter by Price"
              >
                <SlidersHorizontal size={18} />
                {priceFilter !== 'all' && <span className="filter-active-dot" />}
              </button>

              {showPriceFilter && (
                <div className="price-filter-dropdown">
                  <button
                    onClick={() => { setPriceFilter('all'); setShowPriceFilter(false); }}
                    className={`price-opt-btn ${priceFilter === 'all' ? 'active' : ''}`}
                  >
                    All Prices
                  </button>
                  <button
                    onClick={() => { setPriceFilter('under-400'); setShowPriceFilter(false); }}
                    className={`price-opt-btn ${priceFilter === 'under-400' ? 'active' : ''}`}
                  >
                    Under AED 400
                  </button>
                  <button
                    onClick={() => { setPriceFilter('400-600'); setShowPriceFilter(false); }}
                    className={`price-opt-btn ${priceFilter === '400-600' ? 'active' : ''}`}
                  >
                    AED 400 - AED 600
                  </button>
                  <button
                    onClick={() => { setPriceFilter('above-600'); setShowPriceFilter(false); }}
                    className={`price-opt-btn ${priceFilter === 'above-600' ? 'active' : ''}`}
                  >
                    Above AED 600
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 6 Products in One Row on Laptop View, 2 on Mobile */}
          <div className="products-grid-6col">
            {filteredProducts.map((p) => (
              <div key={p.id} className="editorial-card">
                {/* Image Wrap without badge or wishlist icon */}
                <div
                  className="editorial-img-wrap"
                  onClick={() => setViewProduct(p)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="editorial-img"
                    loading="lazy"
                  />
                </div>

                {/* Info Container */}
                <div className="editorial-info">
                  <div className="editorial-brand">
                    {p.brand || 'SMP Luxury'}
                  </div>

                  <div className="editorial-title-row">
                    <h3
                      className="editorial-title"
                      onClick={() => setViewProduct(p)}
                      style={{ cursor: 'pointer' }}
                      title={p.title}
                    >
                      {p.title}
                    </h3>
                  </div>

                  {/* Clean price only (no discount strikethrough) */}
                  <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '2px' }}>
                    <span className="editorial-price">AED {p.price}</span>
                  </div>

                  {/* Solid Brown BUY NOW Button without Cart Icon */}
                  <button
                    onClick={() => handleOpenBuyNow(p)}
                    className="btn-buy-now-solid"
                    title="Order via WhatsApp with Inspection on Delivery"
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Quick View Full Details Modal */}
      {viewProduct && (
        <div className="modal-overlay" onClick={() => setViewProduct(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-head">
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-brown)', fontWeight: '700', textTransform: 'uppercase' }}>
                  {viewProduct.brand || 'SMP LUXURY'}
                </span>
                <h3 className="modal-title">{viewProduct.title}</h3>
              </div>
              <button onClick={() => setViewProduct(null)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <div style={{ position: 'relative', width: '100%', height: '320px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '20px', background: '#FAF7EF' }}>
                <img
                  src={viewProduct.image}
                  alt={viewProduct.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {viewProduct.discount && (
                  <div className="discount-tag">{viewProduct.discount}</div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '14px' }}>
                <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-dark-brown)' }}>
                  AED {viewProduct.price}
                </span>
                {viewProduct.comparePrice && (
                  <span style={{ fontSize: '15px', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                    AED {viewProduct.comparePrice}
                  </span>
                )}
                <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#15803D', fontWeight: '700', background: '#DCFCE7', padding: '3px 8px', borderRadius: '4px' }}>
                  In Stock - Ready to Dispatch
                </span>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '18px' }}>
                {viewProduct.description}
              </p>

              {viewProduct.details && viewProduct.details.length > 0 && (
                <div style={{ background: '#FAF7EF', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-dark-brown)', marginBottom: '8px' }}>
                    Craftsmanship &amp; Highlights:
                  </h4>
                  <ul style={{ paddingLeft: '18px', fontSize: '13px', color: '#4B230A', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {viewProduct.details.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => {
                  const p = viewProduct;
                  setViewProduct(null);
                  handleOpenBuyNow(p);
                }}
                className="btn-buy-now"
                style={{ width: '100%', padding: '14px', fontSize: '15px' }}
              >
                <ShoppingCart size={17} />
                <span>Buy Now with Delivery Address</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buy Now & Delivery Address Modal */}
      {orderModalProduct && (
        <div className="modal-overlay" onClick={() => !submittingOrder && setOrderModalProduct(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-brown)', fontWeight: '700', textTransform: 'uppercase' }}>
                  Delivery Details
                </span>
                <h3 className="modal-title">Complete Your Order</h3>
              </div>
              <button
                onClick={() => setOrderModalProduct(null)}
                className="modal-close-btn"
                disabled={submittingOrder}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              {orderSuccess ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle size={36} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', color: 'var(--color-dark-brown)', marginBottom: '8px' }}>
                    Order Saved &amp; WhatsApp Connected!
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '20px', lineHeight: '1.5' }}>
                    Your order details have been recorded. WhatsApp will now open so our concierge can finalize your delivery slot.
                  </p>
                  <button
                    onClick={() => setOrderModalProduct(null)}
                    className="btn-buy-now"
                    style={{ width: '100%' }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirmAndContinueWhatsApp}>
                  {/* Selected Product Summary Box */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: '#FAF7EF', border: '1px solid #E8E2D2', borderRadius: '8px', marginBottom: '14px' }}>
                    <img
                      src={orderModalProduct.image}
                      alt={orderModalProduct.title}
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #C18A5B' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '10px', color: 'var(--color-brown)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {orderModalProduct.brand}
                      </div>
                      <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {orderModalProduct.title}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-dark-brown)', marginTop: '2px' }}>
                        AED {orderModalProduct.price}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #DCD5C6', borderRadius: '4px', background: '#fff' }}>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        style={{ padding: '2px 8px', fontSize: '13px', fontWeight: '700', color: 'var(--color-dark-brown)', border: 'none', background: 'transparent', cursor: 'pointer' }}
                      >
                        -
                      </button>
                      <span style={{ padding: '0 6px', fontSize: '12px', fontWeight: '700' }}>{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        style={{ padding: '2px 8px', fontSize: '13px', fontWeight: '700', color: 'var(--color-dark-brown)', border: 'none', background: 'transparent', cursor: 'pointer' }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Customer Full Name */}
                  <div className="form-field">
                    <label className="field-label">Full Name *</label>
                    <input
                      type="text"
                      className="field-input"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Fatima Al Mansoori"
                      required
                    />
                  </div>

                  {/* WhatsApp Mobile Number */}
                  <div className="form-field">
                    <label className="field-label">WhatsApp Mobile Number *</label>
                    <input
                      type="tel"
                      className="field-input"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      required
                    />
                  </div>

                  {/* Emirate & City */}
                  <div className="form-field">
                    <label className="field-label">Emirate / City *</label>
                    <select
                      className="field-select"
                      value={emirate}
                      onChange={(e) => setEmirate(e.target.value)}
                      required
                    >
                      <option value="Dubai">Dubai</option>
                      <option value="Abu Dhabi">Abu Dhabi</option>
                      <option value="Sharjah">Sharjah</option>
                      <option value="Ajman">Ajman</option>
                      <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                      <option value="Fujairah">Fujairah</option>
                      <option value="Umm Al Quwain">Umm Al Quwain</option>
                      <option value="Al Ain">Al Ain</option>
                    </select>
                  </div>

                  {/* Full Delivery Address */}
                  <div className="form-field">
                    <label className="field-label">Delivery Address (Villa / Apartment / Street) *</label>
                    <textarea
                      rows={2}
                      className="field-textarea"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Villa 14, Al Safa 2, Jumeirah"
                      required
                    />
                  </div>

                  {/* Delivery Notes */}
                  <div className="form-field">
                    <label className="field-label">Special Delivery Instructions (Optional)</label>
                    <input
                      type="text"
                      className="field-input"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Call before arrival, leave with reception"
                    />
                  </div>

                  {/* Live Total */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingTop: '4px' }}>
                    <div style={{ fontSize: '11px', color: '#786F66', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '600' }}>
                      Total Amount
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#66300F' }}>
                      AED {orderModalProduct.price * quantity}
                    </div>
                  </div>

                  {/* Brown Continue to WhatsApp Button */}
                  <button
                    type="submit"
                    disabled={submittingOrder}
                    className="modal-btn-whatsapp"
                  >
                    <MessageSquare size={16} />
                    <span>{submittingOrder ? 'Processing...' : 'Continue to WhatsApp (+971 52 597 3132)'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}



      {/* Luxury Footer with Montserrat Light & Transparent Logo */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-col">
              <a href="#">
                <img
                  src="/smp-logo.png"
                  alt="SMP Super Master Products"
                  className="footer-logo-img"
                />
              </a>
              <p className="footer-desc">
                Curating timeless luxury across footwear, horology, and fine leather goods. Handcrafted with master precision and delivered with effortless direct WhatsApp service across the United Arab Emirates.
              </p>
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-light-brown)', fontSize: '13.5px', fontWeight: '300' }}>
                <Phone size={15} />
                <span>VIP Concierge: +971 52 597 3132</span>
              </div>
            </div>

            <div className="footer-col">
              <h3>Collections</h3>
              <ul className="footer-links">
                <li><a href="#collections" onClick={() => setActiveCategory('footwear')}>Luxury Footwear</a></li>
                <li><a href="#collections" onClick={() => setActiveCategory('watches')}>Horology &amp; Watches</a></li>
                <li><a href="#collections" onClick={() => setActiveCategory('bags')}>Leather Handbags</a></li>
                <li><a href="#collections" onClick={() => setActiveCategory('all')}>New Arrivals</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Client Care</h3>
              <ul className="footer-links">
                <li><a href="#collections">Inspect Before Payment</a></li>
                <li><a href="#collections">Free UAE Express Delivery</a></li>
                <li><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">Direct WhatsApp Concierge</a></li>
                <li><a href="http://localhost:3001" target="_blank" rel="noopener noreferrer">Admin Management</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Risk-Free Guarantee</h3>
              <p className="footer-desc" style={{ marginBottom: '18px' }}>
                Experience 100% peace of mind. Pay zero upfront; our courier presents your luxury piece at your doorstep to inspect and approve before completing payment.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(193, 138, 91, 0.12)', border: '1px solid rgba(193, 138, 91, 0.28)', padding: '8px 14px', borderRadius: '8px', color: 'var(--color-light-brown)', fontSize: '12px', fontWeight: '400' }}>
                <ShieldCheck size={16} />
                <span>100% Authenticity Guarantee</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div>&copy; {new Date().getFullYear()} Super Master Products (SMP). All Rights Reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
