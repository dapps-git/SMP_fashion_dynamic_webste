'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Search,
  Menu,
  X,
  Maximize2,
  Check,
  CheckCircle,
  MessageSquare,
  Play
} from 'lucide-react';

const WHATSAPP_NUMBER = '971525973132'; // +971 52 597 3132
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';
const cleanApiUrl = rawApiUrl.replace(/\/+$/, '');
const API_BASE = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;

const playAddToCartSound = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    gain1.gain.setValueAtTime(0.22, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.38);
  } catch (err) {}
};

function resolveColorHex(name = '', code = '') {
  if (code && typeof code === 'string' && code.trim().startsWith('#')) return code.trim();
  const lower = (name || '').toLowerCase();
  if (lower.includes('white') || lower.includes('cream')) return '#FFFFFF';
  if (lower.includes('black') || lower.includes('noir') || lower.includes('dark')) return '#111111';
  if (lower.includes('red') || lower.includes('burgundy') || lower.includes('maroon') || lower.includes('wine')) return '#800020';
  if (lower.includes('brown') || lower.includes('cognac') || lower.includes('tan') || lower.includes('chocolate')) return '#8B4513';
  if (lower.includes('green') || lower.includes('emerald') || lower.includes('olive')) return '#064E3B';
  if (lower.includes('blue') || lower.includes('navy') || lower.includes('azure')) return '#1E3A8A';
  if (lower.includes('beige') || lower.includes('nude') || lower.includes('sand')) return '#E2D5C3';
  if (lower.includes('gold') || lower.includes('champagne') || lower.includes('yellow')) return '#D4AF37';
  if (lower.includes('silver') || lower.includes('grey') || lower.includes('gray')) return '#9CA3AF';
  if (lower.includes('pink') || lower.includes('rose')) return '#F472B6';
  return '#1A1817';
}

function getProductColorOptions(product) {
  if (!product) return [];
  const variants = Array.isArray(product.variants) ? product.variants : [];
  
  const isImageInVariants = product.image && variants.some((v) => 
    v.images && v.images.length > 0 && (v.images[0] === product.image || v.images.includes(product.image))
  );

  const options = [];

  if (product.image || product.color) {
    if (!isImageInVariants || variants.length === 0) {
      options.push({
        id: 'primary',
        isPrimary: true,
        colorName: product.color || 'Primary',
        colorCode: resolveColorHex(product.color, product.colorCode),
        images: product.image ? [product.image] : [],
        stock: product.stock !== undefined ? product.stock : 15,
        sizes: product.sizes || []
      });
    }
  }

  variants.forEach((v, idx) => {
    options.push({
      id: v.id || `var-${idx}`,
      isPrimary: false,
      colorName: v.colorName || `Color ${idx + 1}`,
      colorCode: resolveColorHex(v.colorName, v.colorCode),
      images: Array.isArray(v.images) ? v.images.filter(Boolean) : (v.image ? [v.image] : []),
      stock: v.stock !== undefined && v.stock !== '' ? Number(v.stock) : (product.stock ?? 15),
      sizes: Array.isArray(v.sizes) ? v.sizes : (product.sizes || [])
    });
  });

  return options;
}

export default function ProductInnerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Cart & Mobile Drawer State
  const [cart, setCart] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Quick Order Modal (Name & Phone ONLY - NO address)
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');

  const handleOpenBuyNowModal = () => {
    setOrderSuccess(false);
    setSubmittingOrder(false);
    setOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setOrderModalOpen(false);
    setOrderSuccess(false);
    setSubmittingOrder(false);
  };

  const colorOptions = useMemo(() => getProductColorOptions(product), [product]);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('smp_cart_items') || localStorage.getItem('smp_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cart]);

  const totalCartPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  }, [cart]);

  // Fetch product, categories & all products (for live search)
  useEffect(() => {
    if (!id) return;
    fetchProduct();
    fetchCategories();
    fetchAllProducts();
  }, [id]);

  const fetchAllProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        setAllProducts(Array.isArray(data) ? data : (data.products || []));
      }
    } catch (e) {}
  };

  const liveSearchResults = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return [];
    return allProducts.filter((p) => {
      const title = (p.title || '').toLowerCase();
      const brand = (p.brand || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const color = (p.color || '').toLowerCase();
      return title.includes(q) || brand.includes(q) || cat.includes(q) || desc.includes(q) || color.includes(q);
    });
  }, [searchQuery, allProducts]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {}
  };

  const applyProductData = (data) => {
    setProduct(data);
    const colorOpts = getProductColorOptions(data);
    if (colorOpts.length > 0) {
      setSelectedVariant(colorOpts[0]);
      const firstSizes = (colorOpts[0].sizes && colorOpts[0].sizes.length > 0)
        ? colorOpts[0].sizes
        : (data.sizes || []);
      if (firstSizes.length > 0) {
        setSelectedSize(firstSizes[0]);
      }
    } else if (data.sizes && data.sizes.length > 0) {
      setSelectedSize(data.sizes[0]);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        applyProductData(data);
      } else {
        // Fallback: search in list of all products
        const fallbackRes = await fetch(`${API_BASE}/products`);
        if (fallbackRes.ok) {
          const list = await fallbackRes.json();
          const prods = Array.isArray(list) ? list : (list.products || []);
          const match = prods.find((p) => p.id === id || p._id === id || p.slug === id);
          if (match) {
            applyProductData(match);
            return;
          }
        }
        setProduct(null);
      }
    } catch (err) {
      console.warn('Live product fetch error:', err);
      try {
        const fallbackRes = await fetch(`${API_BASE}/products`);
        if (fallbackRes.ok) {
          const list = await fallbackRes.json();
          const prods = Array.isArray(list) ? list : (list.products || []);
          const match = prods.find((p) => p.id === id || p._id === id || p.slug === id);
          if (match) {
            applyProductData(match);
            return;
          }
        }
      } catch (_) {}
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  // Preload variant images
  useEffect(() => {
    colorOptions.forEach((opt) => {
      if (opt.images && opt.images.length > 0) {
        opt.images.forEach((imgUrl) => {
          const preloadImg = new Image();
          preloadImg.src = imgUrl;
        });
      }
    });
  }, [colorOptions]);

  const handleSelectVariant = (v) => {
    setSelectedVariant(v);
    setActiveImageIndex(0);
    const availableSizes = (v.sizes && v.sizes.length > 0) ? v.sizes : (product?.sizes || []);
    if (availableSizes.length > 0) {
      // Keep selected size if still available, or default to first
      if (!availableSizes.includes(selectedSize)) {
        setSelectedSize(availableSizes[0]);
      }
    } else {
      setSelectedSize('');
    }
  };

  const currentVariant = selectedVariant || (colorOptions.length > 0 ? colorOptions[0] : null);
  const variantImages = (currentVariant?.images && currentVariant.images.length > 0)
    ? currentVariant.images
    : (product?.image ? [product.image] : []);
  const activeImage = variantImages[activeImageIndex] || variantImages[0] || product?.image;
  const activeColor = currentVariant?.colorName || product?.color || '';
  const activeStock = currentVariant?.stock !== undefined ? currentVariant.stock : (product?.stock ?? 15);
  
  // Default footwear sizes (35-42) if none specified, matching luxury shoes in screenshot
  const activeSizes = useMemo(() => {
    if (currentVariant?.sizes && currentVariant.sizes.length > 0) return currentVariant.sizes;
    if (product?.sizes && product.sizes.length > 0) return product.sizes;
    const cat = (product?.category || '').toLowerCase();
    if (cat.includes('footwear') || cat.includes('shoe') || cat.includes('heel') || cat.includes('sneaker')) {
      return ['35', '36', '37', '38', '39', '40', '41', '42'];
    }
    return [];
  }, [currentVariant, product]);

  const handleAddToCart = () => {
    if (!product) return;
    playAddToCartSound();
    try {
      const saved = localStorage.getItem('smp_cart_items') || localStorage.getItem('smp_cart');
      const currentCart = saved ? JSON.parse(saved) : [];
      const chosenColor = activeColor;
      const chosenImage = activeImage;
      const variantKeyPart = currentVariant ? currentVariant.id : (chosenColor ? chosenColor.replace(/\s+/g, '-') : 'default');
      const sizeKeyPart = selectedSize ? selectedSize.replace(/\s+/g, '-') : 'nosize';
      const itemKey = `${product.id || product._id}-${variantKeyPart}-${sizeKeyPart}`;

      const idx = currentCart.findIndex((item) => (item.cartKey || item.id) === itemKey);
      let updated;
      if (idx > -1) {
        updated = currentCart.map((item, i) => (i === idx ? { ...item, quantity: item.quantity + quantity } : item));
      } else {
        updated = [
          ...currentCart,
          {
            ...product,
            id: product.id || product._id,
            cartKey: itemKey,
            variantId: currentVariant?.id || null,
            color: chosenColor,
            image: chosenImage,
            size: selectedSize,
            quantity: quantity
          }
        ];
      }
      setCart(updated);
      localStorage.setItem('smp_cart_items', JSON.stringify(updated));
      localStorage.setItem('smp_cart', JSON.stringify(updated));
      setToastMessage(`Added "${product.title}"${chosenColor ? ` [${chosenColor}]` : ''}${selectedSize ? ` (Size: ${selectedSize})` : ''} to Shopping Bag`);
      setTimeout(() => setToastMessage(null), 2500);
      setCartDrawerOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  // WhatsApp Order Submission (NO ADDRESS - ONLY Customer Name, Phone, Product details, Image, Color, Size)
  const handleConfirmAndContinueWhatsApp = async (e) => {
    e.preventDefault();
    if (!product) return;

    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please enter your Name and WhatsApp Mobile Number.');
      return;
    }

    setSubmittingOrder(true);

    const totalAmount = product.price * quantity;
    const orderItems = [
      {
        productId: product.id || product._id,
        title: product.title,
        price: product.price,
        quantity: quantity,
        image: activeImage,
        color: activeColor,
        size: selectedSize || ''
      }
    ];

    const formattedMessage =
`🛍️ *NEW ORDER - SMP Super Master Products*
━━━━━━━━━━━━━━━━━━━━━
*Product:* ${product.title}
*Brand:* ${product.brand || 'SMP Luxury'}${activeColor ? `\n*Color:* ${activeColor}` : ''}${selectedSize ? `\n*Size:* ${selectedSize}` : ''}
*Quantity:* ${quantity}
*Price:* AED ${product.price}
*Total Amount:* AED ${totalAmount}

📸 *Product Image:* ${activeImage}

👤 *Customer Details:*
*Name:* ${customerName.trim()}
*Phone:* ${customerPhone.trim()}
━━━━━━━━━━━━━━━━━━━━━

Please confirm my order. Thank you!`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`;
    setLastWhatsAppUrl(whatsappUrl);

    try {
      await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          items: orderItems,
          totalPrice: totalAmount
        })
      });
    } catch (err) {
      console.warn('Backend order recording skipped:', err);
    } finally {
      setSubmittingOrder(false);
      setOrderSuccess(true);
    }

    // Reliably open WhatsApp without browser popup blocking
    try {
      const win = window.open(whatsappUrl, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = whatsappUrl;
      }
    } catch (err) {
      window.location.href = whatsappUrl;
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}#collections`);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FBF9F5', color: '#66300F', fontFamily: 'var(--font-sans)' }}>
        <img src="/smp-logo.png" alt="SMP" style={{ width: '64px', marginBottom: '16px', opacity: 0.8 }} />
        <div style={{ fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: '600' }}>
          Loading luxury product...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '80vh', padding: '80px 20px', textAlign: 'center', background: '#FBF9F5', fontFamily: 'var(--font-sans)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: '#2D1E12', fontSize: '28px', marginBottom: '12px' }}>
          Product Not Found
        </h2>
        <p style={{ color: '#786F66', marginBottom: '24px' }}>
          The product you are looking for is currently unavailable or has been moved.
        </p>
        <Link href="/#collections" className="product-buy-now-btn" style={{ maxWidth: '240px', margin: '0 auto', textDecoration: 'none' }}>
          ← Return to All Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="product-inner-page-wrap">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, background: '#1C1917', color: '#FFFFFF', padding: '12px 20px', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.18)', fontSize: '13px' }}>
          {toastMessage}
        </div>
      )}

      {/* Top Announcement Bar - Seamless Infinite Train Marquee (Identical to Home) */}
      <div className="top-announcement" role="region" aria-label="Announcement Ticker">
        <div className="top-announcement-track">
          {/* Ticker Set 1 */}
          <div className="top-announcement-group">
            <span className="ticker-badge-item">
              <img src="/tabby-badge.png" alt="Tabby" className="ticker-payment-badge" />
              <img src="/tamara-badge.png" alt="Tamara" className="ticker-payment-badge" />
              <strong>AVAILABLE</strong>
            </span>
            <span className="ticker-dot">|</span>
            <span><strong>100% SECURE SHOPPING</strong></span>
            <span className="ticker-dot">|</span>
            <span><strong>QUALITY CHECK</strong></span>
            <span className="ticker-dot">|</span>
            <span><strong>FREE DELIVERY 🇦🇪</strong></span>
            <span className="ticker-dot">|</span>
            <span><strong>+971 52 597 3132</strong></span>
            <span className="ticker-dot">|</span>
          </div>
          {/* Ticker Set 2 (Seamless infinite loop duplicate) */}
          <div className="top-announcement-group" aria-hidden="true">
            <span className="ticker-badge-item">
              <img src="/tabby-badge.png" alt="Tabby" className="ticker-payment-badge" />
              <img src="/tamara-badge.png" alt="Tamara" className="ticker-payment-badge" />
              <strong>AVAILABLE</strong>
            </span>
            <span className="ticker-dot">|</span>
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

      {/* Main Navigation Header (Fixed/Sticky all over site, identical to Home) */}
      <header className="site-header">
        <div className="header-container">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu size={24} />
            </button>

            <div className="brand-logo-wrap">
              <Link href="/">
                <img
                  src="/smp-logo.png"
                  alt="SMP Logo"
                  className="brand-logo-img"
                />
              </Link>
            </div>
          </div>

          <nav className="header-nav">
            <Link href="/" className="nav-item">Home</Link>
            <Link href="/#collections" className="nav-item">All Collections</Link>
            {categories.map((cat) => (
              <Link
                key={cat.id || cat.slug}
                href={`/?category=${cat.slug}#collections`}
                className={`nav-item ${(product?.category || '').toLowerCase() === (cat.slug || '').toLowerCase() ? 'active' : ''}`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="header-search-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              title="Search products"
            >
              <Search size={20} />
            </button>

            <button
              type="button"
              className="header-cart-btn"
              onClick={() => setCartDrawerOpen(true)}
              aria-label="View Shopping Bag"
              title="Shopping Bag"
            >
              <ShoppingBag size={20} />
              {totalCartCount > 0 && (
                <span className="header-cart-badge">{totalCartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Full Screen White Background Live Search Modal */}
      {searchOpen && (
        <div
          id="searchModalOverlay"
          className="search-modal-backdrop"
          onClick={() => setSearchOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
        >
          <div className="search-modal-inner" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-bar-row">
              <div className="search-modal-pill">
                <Search size={19} className="search-modal-icon" />
                <input
                  id="searchModalInput"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search luxury heels, bags, watches..."
                  className="search-modal-input"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setSearchOpen(false);
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="search-modal-clear-btn"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                type="button"
                className="search-modal-close-text-btn"
                onClick={() => setSearchOpen(false)}
              >
                Cancel
              </button>
            </div>

            {/* Popular quick searches when query is empty */}
            {!searchQuery.trim() && (
              <div className="search-quick-tags-wrap">
                <span className="search-quick-tags-label">Popular Searches</span>
                <div className="search-quick-tags-list">
                  {['Heels', 'Bags', 'Watches', 'Dior', 'Chanel', 'Valentino', 'Louboutin'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="search-quick-tag"
                      onClick={() => setSearchQuery(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Search Results List on White Background */}
            {searchQuery.trim() && (
              <div className="search-results-section">
                <div className="search-results-header">
                  {liveSearchResults.length > 0
                    ? `Found ${liveSearchResults.length} product${liveSearchResults.length > 1 ? 's' : ''} for "${searchQuery}"`
                    : `No products found for "${searchQuery}"`}
                </div>

                {liveSearchResults.length > 0 ? (
                  <div className="search-results-list">
                    {liveSearchResults.map((item) => {
                      const targetId = item.id || item._id;
                      return (
                        <Link
                          key={targetId}
                          href={`/product/${targetId}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="search-result-item"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="search-result-img"
                          />
                          <div className="search-result-info">
                            <div className="search-result-brand">{item.brand || 'SMP Luxury'}</div>
                            <div className="search-result-title">{item.title}</div>
                            <div className="search-result-price-row">
                              <span className="search-result-price">AED {item.price}</span>
                              {item.stock > 0 && (
                                <span className="search-result-stock">In Stock</span>
                              )}
                            </div>
                          </div>
                          <ArrowRight size={16} color="#A45A28" />
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="search-no-results">
                    <p style={{ fontSize: '15px', color: '#6B7280', marginBottom: '8px' }}>
                      We couldn't find any products matching "<strong>{searchQuery}</strong>".
                    </p>
                    <p style={{ fontSize: '13px', color: '#9CA3AF' }}>
                      Try searching with another keyword like <em>Dior</em>, <em>Chanel</em>, <em>Slingback</em>, or <em>Watch</em>.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer (Identical structure to Home) */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-drawer">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #ECE6DC' }}>
              <img src="/smp-logo.png" alt="SMP Logo" style={{ height: '54px', objectFit: 'contain' }} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', color: '#1C1917', cursor: 'pointer', padding: '4px' }}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>
            <div className="mobile-drawer-links" style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">
                <span>Home</span>
              </Link>
              <Link href="/#collections" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-link">
                <span>All Collections</span>
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id || c.slug}
                  href={`/?category=${c.slug}#collections`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-drawer-link"
                >
                  <span>{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Back to Collections Bar */}
      <div className="product-inner-container" style={{ paddingBottom: '0' }}>
        <button
          onClick={() => router.back()}
          className="product-back-btn"
        >
          <ArrowLeft size={16} />
          <span>Back to Collections</span>
        </button>
      </div>

      {/* Main Product Showcase Section */}
      <div className="product-inner-container">
        <div className="product-inner-grid">
          
          {/* LEFT: GALLERY WITH VERTICAL THUMBNAIL STRIP & EXPAND ICON */}
          <div className="product-gallery-side-by-side">
            
            {/* Vertical Thumbnail Strip */}
            {variantImages.length > 1 && (
              <div className="product-gallery-thumbs-vertical">
                {variantImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`product-gallery-thumb-item ${activeImageIndex === idx ? 'active' : ''}`}
                    title={`View angle ${idx + 1}`}
                  >
                    <img src={imgUrl} alt={`${product.title} angle ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {/* Main High-Res Preview Card */}
            <div className="product-gallery-main-card">
              <img
                src={activeImage}
                alt={`${product.title} - ${activeColor}`}
              />

              {/* Top-Right Expand Button (as seen in screenshot) */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="product-gallery-expand-btn"
                title="Zoom / Fullscreen view"
                aria-label="Expand Image"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* RIGHT: PRODUCT DETAILS */}
          <div className="product-details-col">
            
            {/* Brand Header */}
            <div className="product-brand-tag">
              {product.brand || 'VALENTINO'}
            </div>

            {/* Product Title */}
            <h1 className="product-title-heading">
              {product.title}
            </h1>

            {/* Price & In Stock Badge Row */}
            <div className="product-price-stock-row">
              <span className="product-price-val">
                AED {product.price}
              </span>
              <span className="product-stock-pill">
                In Stock ({activeStock} available)
              </span>
            </div>

            {/* Color Selection - Circle Swatch with Color Name Underneath */}
            {colorOptions && colorOptions.length > 0 && (
              <div className="product-color-section">
                <label className="product-section-label">
                  Color:
                </label>

                <div className="product-colors-line">
                  {colorOptions.map((opt) => {
                    const isSelected = currentVariant?.id === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectVariant(opt)}
                        className={`product-color-chip ${isSelected ? 'active' : ''}`}
                        title={opt.colorName}
                      >
                        <span
                          className="product-color-circle"
                          style={{
                            backgroundColor: opt.colorCode || '#2D1E12'
                          }}
                        >
                          {isSelected && (
                            <Check size={13} strokeWidth={3} className="product-color-check-icon" />
                          )}
                        </span>
                        <span className="product-color-name-under">{opt.colorName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection - All Available Sizes in Single Line with Reduced Font Size */}
            {activeSizes && activeSizes.length > 0 && (
              <div className="product-sizes-section">
                <label className="product-section-label">
                  Size (EU): <span style={{ fontWeight: '500', color: '#5A4A3E' }}>{selectedSize}</span>
                </label>

                <div className="product-sizes-line">
                  {activeSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`product-size-btn ${selectedSize === sz ? 'active' : ''}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="product-quantity-section">
              <label className="product-section-label">
                Quantity:
              </label>
              <div className="product-quantity-stepper">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Description Text */}
            <p className="product-description-text">
              {product.description || 'Master-crafted luxury footwear featuring iconic silhouette, premium materials, refined detailing, and comfortable ergonomic design. Perfect for elegant daily wear, special occasions, and luxury lifestyle.'}
            </p>

            {/* Highlights Bullet Points */}
            <ul className="product-highlights-list">
              <li>100% Genuine Materials</li>
              <li>Master Craftsmanship</li>
              <li>Free Express UAE Delivery</li>
            </ul>

            {/* Big Brown Solid CTA Button */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={handleOpenBuyNowModal}
                className="product-buy-now-btn"
              >
                Buy Now
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-modal-cart"
                style={{ padding: '0 20px', borderRadius: '8px', height: '52px' }}
                title="Add to Shopping Bag"
              >
                <ShoppingBag size={18} />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Lightbox Fullscreen Modal */}
      {lightboxOpen && (
        <div className="product-lightbox-backdrop" onClick={() => setLightboxOpen(false)}>
          <div className="product-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxOpen(false)}
              className="product-lightbox-close-btn"
              aria-label="Close fullscreen view"
            >
              <X size={20} />
            </button>
            <img src={activeImage} alt={product.title} />
          </div>
        </div>
      )}

      {/* Quick Order Modal (Exact match to designer screenshot, address removed) */}
      {orderModalOpen && (
        <div className="modal-overlay" onClick={() => !submittingOrder && handleCloseOrderModal()}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', borderRadius: '12px', overflow: 'hidden' }}>
            <div className="modal-head" style={{ padding: '16px 22px', background: '#FAF7EF', borderBottom: '1px solid #ECE4D5' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#8B5E3C', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '2px' }}>
                  DELIVERY DETAILS
                </span>
                <h3 className="modal-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '21px', fontWeight: '700', color: '#4A230B', margin: 0 }}>
                  Complete Your Order
                </h3>
              </div>
              <button onClick={handleCloseOrderModal} className="modal-close-btn" disabled={submittingOrder}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content" style={{ padding: '20px 22px' }}>
              {orderSuccess ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle size={36} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', color: '#2D1E12', marginBottom: '8px' }}>
                    Order Placed Successfully!
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#6B7280', marginBottom: '20px', lineHeight: '1.5' }}>
                    WhatsApp is opening now to finalize your order details with our concierge (+971 52 597 3132).
                  </p>
                  <a
                    href={lastWhatsAppUrl || `https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-buy-now-btn"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      textDecoration: 'none',
                      marginBottom: '10px'
                    }}
                  >
                    <MessageSquare size={17} />
                    <span>Open WhatsApp Chat Directly</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCloseOrderModal}
                    className="btn-modal-cart"
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: '8px',
                      border: '1px solid #DCD5C6',
                      background: 'transparent',
                      color: '#66300F',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Done / Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirmAndContinueWhatsApp}>
                  {/* Product Card with Stepper inside (Exact match to screenshot) */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '12px 14px',
                    background: '#FAF7EF',
                    border: '1px solid #EAE3D2',
                    borderRadius: '10px',
                    marginBottom: '18px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <img
                        src={activeImage}
                        alt={product.title}
                        style={{ width: '54px', height: '54px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #C18A5B', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '11px', color: '#8B5E3C', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>
                          {product.brand || 'SMP Luxury'}
                        </div>
                        <div style={{ fontWeight: '700', fontSize: '13.5px', color: '#2D1E12', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>
                          {product.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '14px', fontWeight: '800', color: '#5A2A10' }}>
                            AED {product.price}
                          </span>
                          {activeColor && (
                            <span style={{ fontSize: '11.5px', color: '#5A2A10', background: '#F4EFE6', border: '1px solid #E2D7C5', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentVariant?.colorCode || '#66300F', display: 'inline-block' }} />
                              Color: {activeColor}
                            </span>
                          )}
                          {selectedSize && (
                            <span style={{ fontSize: '11px', color: '#5A2A10', background: '#F4EFE6', border: '1px solid #E8DFD0', padding: '1px 8px', borderRadius: '4px', fontWeight: '600' }}>
                              Size: {selectedSize}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stepper pill */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D8CFBE', borderRadius: '6px', background: '#FFFFFF', padding: '2px', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        style={{ width: '26px', height: '26px', fontSize: '14px', fontWeight: '700', color: '#5A2A10', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span style={{ minWidth: '22px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: '#2D1E12' }}>
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        style={{ width: '26px', height: '26px', fontSize: '14px', fontWeight: '700', color: '#5A2A10', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Customer Full Name */}
                  <div className="form-field" style={{ marginBottom: '14px' }}>
                    <label className="field-label" style={{ fontSize: '12.5px', fontWeight: '700', color: '#3D2314', marginBottom: '6px', display: 'block' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="field-input"
                      style={{ width: '100%', height: '42px', padding: '0 14px', borderRadius: '6px', border: '1px solid #DCD5C6', fontSize: '13.5px' }}
                      placeholder="e.g. Fatima Al Mansoori"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>

                  {/* WhatsApp Mobile Number */}
                  <div className="form-field" style={{ marginBottom: '18px' }}>
                    <label className="field-label" style={{ fontSize: '12.5px', fontWeight: '700', color: '#3D2314', marginBottom: '6px', display: 'block' }}>
                      WhatsApp Mobile Number *
                    </label>
                    <input
                      type="tel"
                      className="field-input"
                      style={{ width: '100%', height: '42px', padding: '0 14px', borderRadius: '6px', border: '1px solid #DCD5C6', fontSize: '13.5px' }}
                      placeholder="+971 50 123 4567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                    />
                  </div>

                  {/* Total Amount Row (Exact match to screenshot) */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingTop: '4px' }}>
                    <div style={{ fontSize: '12px', color: '#786F66', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '700' }}>
                      TOTAL AMOUNT
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#66300F' }}>
                      AED {product.price * quantity}
                    </div>
                  </div>

                  {/* Luxury Brown WhatsApp Submit Button (Exact match to screenshot) */}
                  <button
                    type="submit"
                    className="modal-btn-whatsapp"
                    disabled={submittingOrder}
                    style={{
                      width: '100%',
                      height: '48px',
                      background: '#5A2A10',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14.5px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(90, 42, 16, 0.28)'
                    }}
                  >
                    <MessageSquare size={17} />
                    <span>{submittingOrder ? 'Connecting...' : 'Continue to WhatsApp (+971 52 597 3132)'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartDrawerOpen && (
        <div className="cart-drawer-overlay" onClick={() => setCartDrawerOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-drawer-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={18} color="#66300F" />
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#66300F', margin: 0 }}>
                  Your Shopping Bag ({totalCartCount})
                </h3>
              </div>
              <button onClick={() => setCartDrawerOpen(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <div className="cart-drawer-body">
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 16px', color: '#786F66' }}>
                  <ShoppingBag size={44} color="#D1C7B7" style={{ margin: '0 auto 16px' }} />
                  <p style={{ fontSize: '15px', fontWeight: '600', color: '#1C1917', marginBottom: '6px' }}>
                    Your shopping bag is empty
                  </p>
                  <button onClick={() => setCartDrawerOpen(false)} className="product-buy-now-btn" style={{ maxWidth: '200px', margin: '0 auto', height: '42px', fontSize: '13px' }}>
                    Continue Browsing
                  </button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cart.map((item, idx) => (
                    <div key={item.cartKey || idx} className="cart-item-row">
                      <img src={item.image} alt={item.title} className="cart-item-img" />
                      <div className="cart-item-info">
                        <div className="cart-item-brand">{item.brand || 'SMP Luxury'}</div>
                        <div className="cart-item-title">{item.title}</div>
                        {(item.color || item.size) && (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '3px', marginBottom: '4px' }}>
                            {item.color && (
                              <span style={{ fontSize: '11px', color: '#66300F', background: '#F8F4EE', border: '1px solid #E6D7C3', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>
                                {item.color}
                              </span>
                            )}
                            {item.size && (
                              <span style={{ fontSize: '11px', color: '#786F66', background: '#F5F5F0', border: '1px solid #E5E5E0', padding: '1px 6px', borderRadius: '4px', fontWeight: '500' }}>
                                Size: {item.size}
                              </span>
                            )}
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                          <span style={{ fontWeight: '700', color: '#66300F', fontSize: '13px' }}>
                            AED {item.price * item.quantity}
                          </span>
                          <span style={{ fontSize: '12px', color: '#6B7280' }}>
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-drawer-footer">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Total Amount</span>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: '#66300F' }}>AED {totalCartPrice}</span>
                </div>
                <button
                  onClick={() => {
                    setCartDrawerOpen(false);
                    handleOpenBuyNowModal();
                  }}
                  className="product-buy-now-btn"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
