'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Search,
  Menu,
  X,
  Maximize2,
  Check,
  CheckCircle,
  MessageSquare,
  Play,
  ExternalLink
} from 'lucide-react';

// Authentic Official WhatsApp Vector Icon
const WhatsAppIcon = ({ size = 22, color = '#FFFFFF' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, color }}
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 18.16c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.32a7.99 7.99 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.26.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.23 8.24zm4.52-5.77c-.25-.12-1.46-.72-1.68-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.98-.15.17-.29.19-.54.06-.25-.12-1.05-.38-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.28.37-.43.12-.15.16-.25.25-.44.08-.19.04-.35-.02-.48-.07-.12-.56-1.32-.76-1.82-.2-.48-.41-.41-.56-.42h-.48c-.16 0-.43.06-.65.3-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.13.16 1.74 2.65 4.21 3.72.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.21-.16-.46-.21z" />
  </svg>
);

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
  const rawVariants = Array.isArray(product.variants) ? product.variants : [];
  const variants = rawVariants.filter(v => v && typeof v === 'object');
  
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
    if (!v) return;
    const rawImages = Array.isArray(v.images) ? v.images.filter(Boolean) : (v.image ? [v.image] : []);
    const cleanImages = rawImages.filter(img => typeof img === 'string' && !img.startsWith('blob:'));
    const finalImages = cleanImages.length > 0 ? cleanImages : (product.image && !product.image.startsWith('blob:') ? [product.image] : []);

    options.push({
      id: v.id || `var-${idx}`,
      isPrimary: false,
      colorName: v.colorName || `Color ${idx + 1}`,
      colorCode: resolveColorHex(v.colorName, v.colorCode),
      images: finalImages,
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
    try {
      fetch(`${API_BASE}/products/${id}/click`, { method: 'POST', keepalive: true }).catch(() => {});
    } catch (_) {}
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
      let foundData = null;

      // 1. Try relative /api/products/:id first (routed safely via Next.js proxy)
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) foundData = await res.json();
      } catch (_) {}

      // 2. Try direct API_BASE if not found
      if (!foundData && API_BASE) {
        try {
          const res = await fetch(`${API_BASE}/products/${id}`);
          if (res.ok) foundData = await res.json();
        } catch (_) {}
      }

      if (foundData) {
        applyProductData(foundData);
        return;
      }

      // 3. Robust fallback: search in all products list
      let list = [];
      try {
        const res = await fetch('/api/products');
        if (res.ok) list = await res.json();
      } catch (_) {
        try {
          const res = await fetch(`${API_BASE}/products`);
          if (res.ok) list = await res.json();
        } catch (_) {}
      }

      const prods = Array.isArray(list) ? list : (list.products || []);
      const match = prods.find((p) => 
        String(p._id) === String(id) || 
        String(p.id) === String(id) || 
        p.slug === id ||
        (p.title && p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id)
      );

      if (match) {
        applyProductData(match);
      } else {
        setProduct(null);
      }
    } catch (err) {
      console.warn('Live product fetch error:', err);
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
  const rawVariantImages = (currentVariant?.images && currentVariant.images.length > 0)
    ? currentVariant.images
    : (product?.image ? [product.image] : []);
  const safeVariantImages = rawVariantImages.filter(img => typeof img === 'string' && img.trim() && !img.startsWith('blob:'));
  const variantImages = safeVariantImages.length > 0 ? safeVariantImages : (product?.image ? [product.image] : []);
  const activeImage = variantImages[activeImageIndex] || variantImages[0] || product?.image;
  const activeColor = currentVariant?.colorName || product?.color || '';
  const activeStock = currentVariant?.stock !== undefined ? currentVariant.stock : (product?.stock ?? 15);
  
  const categoryLower = ((product?.category || product?.categoryName || '') + ' ' + (product?.title || '')).toLowerCase();
  const isFootwear = categoryLower.includes('footwear') || categoryLower.includes('shoe') || categoryLower.includes('heel') || categoryLower.includes('sneaker') || categoryLower.includes('boot') || categoryLower.includes('sandal') || categoryLower.includes('slide') || categoryLower.includes('ballerina') || categoryLower.includes('loafer');
  const sizeLabel = isFootwear ? 'Shoe size' : 'Size';

  // Category-aware sizes with luxury formatting (square box display)
  const activeSizes = useMemo(() => {
    let sizes = [];
    if (currentVariant?.sizes && currentVariant.sizes.length > 0) {
      sizes = currentVariant.sizes;
    } else if (product?.sizes && product.sizes.length > 0) {
      sizes = product.sizes;
    } else if (isFootwear) {
      sizes = ['35', '36', '37', '38', '39', '40', '41', '42'];
    }

    // Clean and format size items (e.g. format '36' to '36 cm' if product is a 36 cm bag)
    return sizes.map((sz) => {
      const trimmed = String(sz || '').trim();
      if (!isFootwear && /^\d+$/.test(trimmed)) {
        if (categoryLower.includes('cm') || (product?.title || '').toLowerCase().includes(`${trimmed} cm`)) {
          return `${trimmed} cm`;
        }
      }
      return trimmed;
    }).filter(Boolean);
  }, [currentVariant, product, isFootwear, categoryLower]);

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

      {/* Luxury Navigation Header with SMP Logo (Offwhite / Cream / Brown Theme) */}
      <header className="milina-header">
        <div className="milina-header-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              className="milina-icon-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>

          <Link href="/" className="milina-logo-link">
            <img src="/smp-logo.png" alt="SMP Logo" className="milina-logo-img" />
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              className="milina-icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <button
              type="button"
              className="milina-icon-btn"
              onClick={() => setCartDrawerOpen(true)}
              aria-label="Cart"
              style={{ position: 'relative' }}
            >
              <ShoppingBag size={20} />
              {totalCartCount > 0 && (
                <span className="milina-cart-badge">{totalCartCount}</span>
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

      {/* Breadcrumb / Back Button */}
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '16px 16px 0' }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12.5px',
            color: '#666',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <ArrowLeft size={15} />
          <span>Back to Collections</span>
        </button>
      </div>

      {/* Main Product Showcase Section (Milina Screenshot 5 & 6) */}
      <div className="milina-pdp-container">
        <div className="milina-pdp-grid">
          
          {/* LEFT: GALLERY WITH EXPAND ICON & < 1/5 > COUNTER */}
          <div className="milina-pdp-gallery">
            <div className="milina-pdp-main-img-box">
              <img
                src={activeImage}
                alt={`${product.title} - ${activeColor}`}
                className="milina-pdp-main-img"
                onError={(e) => {
                  if (product?.image && e.currentTarget.src !== product.image) {
                    e.currentTarget.src = product.image;
                  }
                }}
              />

              {/* Top-Left Expand Zoom Button (Screenshot 5) */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="milina-pdp-zoom-btn"
                title="Zoom view"
                aria-label="Expand Image"
              >
                <Search size={17} />
              </button>
            </div>

            {/* Gallery Page Counter: < 1/5 > (Screenshot 5) */}
            {variantImages.length > 1 && (
              <div className="milina-pdp-gallery-counter">
                <button
                  type="button"
                  className="milina-pdp-arrow-btn"
                  onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : variantImages.length - 1))}
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={18} />
                </button>
                <span>{activeImageIndex + 1}/{variantImages.length}</span>
                <button
                  type="button"
                  className="milina-pdp-arrow-btn"
                  onClick={() => setActiveImageIndex((prev) => (prev < variantImages.length - 1 ? prev + 1 : 0))}
                  aria-label="Next photo"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT DETAILS (Screenshots 5 & 6) */}
          <div className="milina-pdp-details">
            
            {/* Brand Header */}
            <div className="milina-pdp-brand" style={{ textTransform: 'uppercase', letterSpacing: '1.8px', fontSize: '11px', fontWeight: '400', color: '#888' }}>
              {product.brand || 'SMP ATELIER'}
            </div>

            {/* Product Title */}
            <h1 className="milina-pdp-title" style={{ fontSize: '22px', fontWeight: '400', color: '#1A1817', margin: '4px 0 10px', letterSpacing: '0.5px' }}>
              {product.title}
            </h1>

            {/* Price (Screenshot 5: Dhs. 450.00 AED) */}
            <div className="milina-pdp-price" style={{ fontSize: '16px', fontWeight: '500', color: '#111', marginBottom: '16px' }}>
              {isNaN(Number(product.price)) ? `AED ${product.price || '0'}` : `Dhs. ${Number(product.price).toFixed(2)} AED`}
            </div>

            {/* Color Selection - Circular Swatch (Screenshot 5) */}
            {colorOptions && colorOptions.length > 0 && (
              <div>
                <label className="milina-pdp-section-label">
                  Color: <span style={{ fontWeight: '400', color: '#555' }}>{activeColor}</span>
                </label>

                <div className="milina-color-swatches">
                  {colorOptions.map((opt) => {
                    const isSelected = currentVariant?.id === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectVariant(opt)}
                        className={`milina-color-swatch-btn ${isSelected ? 'active' : ''}`}
                        title={opt.colorName}
                      >
                        <span
                          className="milina-color-swatch-inner"
                          style={{
                            backgroundColor: opt.colorCode || '#2D1E12'
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection - Square Boxes */}
            {activeSizes && activeSizes.length > 0 && (
              <div>
                <label className="milina-pdp-section-label">
                  {sizeLabel}
                </label>

                <div className="milina-size-pills">
                  {activeSizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`milina-size-pill-btn ${isSelected ? 'active' : ''}`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector (Screenshot 6) */}
            <div>
              <label className="milina-pdp-section-label">
                Quantity
              </label>
              <div className="milina-quantity-box">
                <button
                  type="button"
                  className="milina-qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="milina-qty-val">{quantity}</span>
                <button
                  type="button"
                  className="milina-qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dual Action Buttons (Screenshot 6) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={handleAddToCart}
                className="milina-btn-add-cart"
              >
                Add to cart
              </button>

              <button
                type="button"
                onClick={handleOpenBuyNowModal}
                className="milina-btn-buy-now"
              >
                Buy it now
              </button>
            </div>

            {/* Stock counter & Share (Screenshot 6) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>
                x{activeStock} in stock
              </span>

              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.share) {
                    navigator.share({ title: product.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Product link copied to clipboard!');
                  }
                }}
                className="milina-share-link"
              >
                <ExternalLink size={14} />
                <span>Share</span>
              </button>
            </div>

            {/* Description Text */}
            <div style={{ borderTop: '1px solid #ECE7DE', paddingTop: '16px', marginTop: '10px' }}>
              <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.6', margin: 0 }}>
                {product.description || 'Master-crafted luxury fashion featuring iconic silhouette, premium materials, refined detailing, and comfortable ergonomic design. Perfect for elegant daily wear, special occasions, and luxury lifestyle.'}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* "You may also like" Section (Screenshot 6) */}
      <section style={{ maxWidth: '1180px', width: '100%', margin: '40px auto 20px', padding: '0 14px', borderTop: '1px solid #ECE7DE', paddingTop: '32px', boxSizing: 'border-box', overflowX: 'hidden' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '300', color: '#1A1817', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '2px' }}>
          YOU MAY ALSO LIKE
        </h2>

        <div className="milina-product-grid">
          {allProducts
            .filter((p) => (String(p._id || p.id) !== String(product._id || product.id)) && (((p.category || '').toLowerCase() === (product.category || '').toLowerCase()) || ((p.brand || '').toLowerCase() === (product.brand || '').toLowerCase())))
            .slice(0, 4)
            .map((rec) => {
              const recId = rec._id || rec.id;
              const recPrice = `AED ${rec.price || '0'}`;
              return (
                <Link
                  key={recId}
                  href={`/product/${recId}`}
                  className="milina-product-card"
                  prefetch={false}
                >
                  <div className="milina-product-img-wrap">
                    <img
                      src={rec.image}
                      alt={rec.title}
                      className="milina-product-img"
                      loading="lazy"
                    />
                    {rec.brand && (
                      <span className="milina-brand-tag">
                        {rec.brand}
                      </span>
                    )}
                  </div>
                  <div className="milina-product-info">
                    <h3 className="milina-product-title">
                      {rec.title}
                    </h3>
                    <div className="milina-product-price">
                      {recPrice}
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>

      {/* Floating WhatsApp Concierge */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello SMP Atelier! I am inquiring about: ${product.title}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="milina-whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon size={28} color="#FFFFFF" />
      </a>

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
            <img 
              src={activeImage} 
              alt={product.title} 
              onError={(e) => {
                if (product?.image && e.currentTarget.src !== product.image) {
                  e.currentTarget.src = product.image;
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Quick Order Modal (Exact match to designer screenshot, address removed) */}
      {orderModalOpen && (
        <div className="modal-overlay" onClick={() => !submittingOrder && handleCloseOrderModal()}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', borderRadius: '12px', overflow: 'hidden' }}>
            <div className="modal-head" style={{ padding: '16px 20px', background: '#FAF7EF', borderBottom: '1px solid #ECE4D5' }}>
              <div>
                <span style={{ fontSize: '10.5px', color: '#8B5E3C', fontWeight: '400', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '3px' }}>
                  DELIVERY DETAILS
                </span>
                <h3 className="modal-title" style={{ fontFamily: "'Poppins', sans-serif", fontSize: '16px', fontWeight: '400', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#1A1817', margin: 0 }}>
                  Complete Your Order
                </h3>
              </div>
              <button onClick={handleCloseOrderModal} className="modal-close-btn" disabled={submittingOrder}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-content" style={{ padding: '20px' }}>
              {orderSuccess ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle size={32} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontFamily: "'Poppins', sans-serif", fontWeight: '400', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#1A1817', marginBottom: '8px' }}>
                    Order Placed Successfully!
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px', lineHeight: '1.5' }}>
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
                    <WhatsAppIcon size={17} color="#FFFFFF" />
                    <span>Open WhatsApp Chat Directly</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCloseOrderModal}
                    className="btn-modal-cart"
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: '2px',
                      border: '1px solid #DCD5C6',
                      background: 'transparent',
                      color: '#66300F',
                      fontWeight: '400',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Done / Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirmAndContinueWhatsApp}>
                  {/* Product Card with Stepper inside */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '12px 14px',
                    background: '#FAF7EF',
                    border: '1px solid #EAE3D2',
                    borderRadius: '4px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <img
                        src={activeImage}
                        alt={product.title}
                        style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #D8CFBE', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '10.5px', color: '#8B5E3C', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '2px' }}>
                          {product.brand || 'SMP Luxury'}
                        </div>
                        <div style={{ fontWeight: '400', fontSize: '13.5px', color: '#1A1817', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>
                          {product.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: '500', color: '#1A1817' }}>
                            AED {product.price}
                          </span>
                          {activeColor && (
                            <span style={{ fontSize: '11px', color: '#555', background: '#F4EFE6', border: '1px solid #E2D7C5', padding: '1px 7px', borderRadius: '2px', fontWeight: '400', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: currentVariant?.colorCode || '#66300F', display: 'inline-block' }} />
                              Color: {activeColor}
                            </span>
                          )}
                          {selectedSize && (
                            <span style={{ fontSize: '11px', color: '#555', background: '#F4EFE6', border: '1px solid #E8DFD0', padding: '1px 7px', borderRadius: '2px', fontWeight: '400' }}>
                              Size: {selectedSize}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stepper pill */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D8CFBE', borderRadius: '2px', background: '#FFFFFF', padding: '2px', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        style={{ width: '26px', height: '26px', fontSize: '14px', fontWeight: '400', color: '#444', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span style={{ minWidth: '22px', textAlign: 'center', fontSize: '13px', fontWeight: '500', color: '#1A1817' }}>
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        style={{ width: '26px', height: '26px', fontSize: '14px', fontWeight: '400', color: '#444', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Customer Full Name */}
                  <div className="form-field" style={{ marginBottom: '14px' }}>
                    <label className="field-label" style={{ fontSize: '11px', fontWeight: '400', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#555', marginBottom: '5px', display: 'block' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="field-input"
                      style={{ width: '100%', height: '42px', padding: '0 14px', borderRadius: '2px', border: '1px solid #DCD5C6', fontSize: '13px', fontFamily: "'Poppins', sans-serif" }}
                      placeholder="e.g. Fatima Al Mansoori"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>

                  {/* WhatsApp Mobile Number */}
                  <div className="form-field" style={{ marginBottom: '18px' }}>
                    <label className="field-label" style={{ fontSize: '11px', fontWeight: '400', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#555', marginBottom: '5px', display: 'block' }}>
                      WhatsApp Mobile Number *
                    </label>
                    <input
                      type="tel"
                      className="field-input"
                      style={{ width: '100%', height: '42px', padding: '0 14px', borderRadius: '2px', border: '1px solid #DCD5C6', fontSize: '13px', fontFamily: "'Poppins', sans-serif" }}
                      placeholder="+971 50 123 4567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                    />
                  </div>

                  {/* Total Amount Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingTop: '4px' }}>
                    <div style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '400' }}>
                      TOTAL AMOUNT
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#1A1817' }}>
                      AED {product.price * quantity}
                    </div>
                  </div>

                  {/* Sleek Luxury WhatsApp Submit Button with Official WhatsApp Icon */}
                  <button
                    type="submit"
                    disabled={submittingOrder}
                    style={{
                      width: '100%',
                      height: '44px',
                      background: '#111111',
                      color: '#FFFFFF',
                      border: '1px solid #111111',
                      borderRadius: '2px',
                      fontSize: '13.5px',
                      fontWeight: '400',
                      letterSpacing: '0.4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: submittingOrder ? 'not-allowed' : 'pointer',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <WhatsAppIcon size={17} color="#FFFFFF" />
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
            <div className="cart-drawer-head" style={{ padding: '16px 20px', background: '#FAF7EF', borderBottom: '1px solid #ECE6DC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={17} color="#1A1817" />
                <h3 style={{ fontSize: '13.5px', fontWeight: '400', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#1A1817', margin: 0, fontFamily: "'Poppins', sans-serif" }}>
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
                  <p style={{ fontSize: '14px', fontWeight: '400', color: '#1C1917', marginBottom: '6px' }}>
                    Your shopping bag is empty
                  </p>
                  <button onClick={() => setCartDrawerOpen(false)} className="product-buy-now-btn" style={{ maxWidth: '200px', margin: '0 auto', height: '42px', fontSize: '13px', borderRadius: '2px' }}>
                    Continue Browsing
                  </button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cart.map((item, idx) => (
                    <div key={item.cartKey || idx} className="cart-item-row" style={{ padding: '12px 16px', borderBottom: '1px solid #F0ECE4' }}>
                      <img src={item.image} alt={item.title} className="cart-item-img" style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover' }} />
                      <div className="cart-item-info" style={{ flex: 1, minWidth: 0 }}>
                        <div className="cart-item-brand" style={{ fontSize: '10.5px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px', color: '#8B5E3C', marginBottom: '2px' }}>
                          {item.brand || 'SMP Luxury'}
                        </div>
                        <div className="cart-item-title" style={{ fontSize: '13.5px', fontWeight: '400', color: '#1A1817', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title}
                        </div>
                        {(item.color || item.size) && (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '3px', marginBottom: '4px' }}>
                            {item.color && (
                              <span style={{ fontSize: '11px', color: '#555', background: '#F8F4EE', border: '1px solid #E6D7C3', padding: '1px 6px', borderRadius: '2px', fontWeight: '400' }}>
                                {item.color}
                              </span>
                            )}
                            {item.size && (
                              <span style={{ fontSize: '11px', color: '#555', background: '#F5F5F0', border: '1px solid #E5E5E0', padding: '1px 6px', borderRadius: '2px', fontWeight: '400' }}>
                                Size: {item.size}
                              </span>
                            )}
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                          <span style={{ fontWeight: '500', color: '#1A1817', fontSize: '13.5px' }}>
                            AED {item.price * item.quantity}
                          </span>
                          <span style={{ fontSize: '12px', color: '#777', fontWeight: '400' }}>
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
              <div className="cart-drawer-footer" style={{ padding: '16px 20px', borderTop: '1px solid #ECE6DC', background: '#FAF7EF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '400', textTransform: 'uppercase', letterSpacing: '1px', color: '#666' }}>Total Amount</span>
                  <span style={{ fontSize: '16px', fontWeight: '500', color: '#1A1817' }}>AED {totalCartPrice}</span>
                </div>
                <button
                  onClick={() => {
                    setCartDrawerOpen(false);
                    handleOpenBuyNowModal();
                  }}
                  className="product-buy-now-btn"
                  style={{
                    height: '44px',
                    borderRadius: '2px',
                    fontSize: '13.5px',
                    fontWeight: '400',
                    letterSpacing: '0.4px',
                    background: '#111111',
                    color: '#FFFFFF'
                  }}
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
