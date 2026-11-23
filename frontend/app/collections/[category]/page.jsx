'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS } from '../../initialData';
import { optimizeCloudinaryUrl } from '../../cloudinary';
import {
  Search,
  Menu,
  X,
  ShoppingBag,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';

const WHATSAPP_NUMBER = '971525973132'; // +971 52 597 3132

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
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';
const cleanApiUrl = rawApiUrl.replace(/\/+$/, '');
const API_BASE = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;

export default function CategoryListingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = (params?.category || 'all').toLowerCase();
  const brandQuery = searchParams.get('brand') || 'all';

  const [products, setProducts] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('smp_cached_products');
        if (cached) {
          const list = JSON.parse(cached);
          if (Array.isArray(list) && list.length > 0) return list;
        }
      } catch (_) {}
    }
    return INITIAL_PRODUCTS && INITIAL_PRODUCTS.length > 0 ? INITIAL_PRODUCTS : [];
  });
  const [categories, setCategories] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('smp_cached_categories');
        if (cached) return JSON.parse(cached);
      } catch (_) {}
    }
    return INITIAL_CATEGORIES || [];
  });
  const [brands, setBrands] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('smp_cached_brands');
        if (cached) return JSON.parse(cached);
      } catch (_) {}
    }
    return INITIAL_BRANDS || [];
  });
  const [loading, setLoading] = useState(false);

  const trackProductClick = (id) => {
    if (!id) return;
    try {
      fetch(`${API_BASE}/products/${id}/click`, { method: 'POST', keepalive: true }).catch(() => {});
    } catch (_) {}
  };

  // Filters & Sorting
  const [activeBrand, setActiveBrand] = useState(brandQuery);
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cart Drawer state
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Keep activeBrand in sync with query param
  useEffect(() => {
    setActiveBrand(searchParams.get('brand') || 'all');
  }, [searchParams]);

  // Load Cart
  useEffect(() => {
    try {
      const saved = localStorage.getItem('smp_cart_items') || localStorage.getItem('smp_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {}
  }, []);

  // Concurrent Background Synchronization
  useEffect(() => {
    let isMounted = true;
    const loadAll = async () => {
      try {
        const [pRes, cRes, bRes] = await Promise.allSettled([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/categories`),
          fetch(`${API_BASE}/brands`)
        ]);

        if (pRes.status === 'fulfilled' && pRes.value.ok) {
          const pData = await pRes.value.json();
          const list = Array.isArray(pData) ? pData : (pData.products || []);
          if (isMounted && list.length > 0) {
            setProducts(list);
            try { sessionStorage.setItem('smp_cached_products', JSON.stringify(list)); } catch (_) {}
          }
        }
        if (cRes.status === 'fulfilled' && cRes.value.ok) {
          const cData = await cRes.value.json();
          if (isMounted && Array.isArray(cData) && cData.length > 0) {
            setCategories(cData);
            try { sessionStorage.setItem('smp_cached_categories', JSON.stringify(cData)); } catch (_) {}
          }
        }
        if (bRes.status === 'fulfilled' && bRes.value.ok) {
          const bData = await bRes.value.json();
          if (isMounted && Array.isArray(bData) && bData.length > 0) {
            setBrands(bData);
            try { sessionStorage.setItem('smp_cached_brands', JSON.stringify(bData)); } catch (_) {}
          }
        }
      } catch (err) {
        console.warn('Collections fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAll();
    return () => { isMounted = false; };
  }, []);

  // Determine Category Display Info
  const isFootwear = categoryParam === 'shoes' || categoryParam === 'footwear';
  const isBags = categoryParam === 'bags';
  const isWatches = categoryParam === 'watches';

  const categoryTitle = useMemo(() => {
    if (activeBrand !== 'all') {
      if (isFootwear) return `${activeBrand} Shoes`;
      if (isBags) return `${activeBrand} Bags`;
      if (isWatches) return `${activeBrand} Watches`;
      return `${activeBrand} Collection`;
    }
    if (isFootwear) return 'Shoes';
    if (isBags) return 'Bags';
    if (isWatches) return 'Watches';
    return 'All Collections';
  }, [categoryParam, activeBrand, isFootwear, isBags, isWatches]);

  // Filter Products for this category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const pCat = (p.category || '').toLowerCase();
      const pCatName = (p.categoryName || '').toLowerCase();

      const titleLower = (p.title || '').toLowerCase();
      const brandLower = (p.brand || '').toLowerCase();

      // Clear watch markers
      const isWatchMarker = brandLower.includes('rolex') || brandLower.includes('relox') || brandLower.includes('richard') || 
        brandLower.includes('patek') || brandLower.includes('audemars') || brandLower.includes('cartier') || 
        brandLower.includes('omega') || brandLower.includes('chopard') || brandLower.includes('chaumet') ||
        titleLower.includes('gmt') || titleLower.includes('submariner') || titleLower.includes('watch') || titleLower.includes('dial');

      // Clear footwear markers
      const isFootwearMarker = titleLower.includes('boot') || titleLower.includes('heel') || titleLower.includes('sandal') || 
        titleLower.includes('shoe') || titleLower.includes('mule') || titleLower.includes('slide') || 
        titleLower.includes('sneaker') || titleLower.includes('pump') || titleLower.includes('loafer');

      // Clear bag markers
      const isBagMarker = titleLower.includes('bag') || titleLower.includes('tote') || titleLower.includes('peekaboo') || 
        titleLower.includes('evelyn') || titleLower.includes('kelly') || titleLower.includes('birkin') || 
        titleLower.includes('vanity') || titleLower.includes('hobo') || titleLower.includes('capucines');

      // Category matching
      if (isFootwear) {
        if (isWatchMarker || isBagMarker) return false;
        const matches = pCat === 'footwear' || pCat === 'shoes' || isFootwearMarker || pCatName.includes('shoe') || pCatName.includes('footwear');
        if (!matches) return false;
      } else if (isBags) {
        if (isWatchMarker || isFootwearMarker) return false;
        const matches = pCat === 'bags' || isBagMarker || pCatName.includes('bag');
        if (!matches) return false;
      } else if (isWatches) {
        if (isBagMarker || isFootwearMarker) return false;
        const matches = pCat === 'watches' || isWatchMarker || pCatName.includes('watch');
        if (!matches) return false;
      } else if (categoryParam !== 'all') {
        if (pCat !== categoryParam && pCatName !== categoryParam) return false;
      }

      // Brand matching
      if (activeBrand !== 'all') {
        const pBrand = (p.brand || '').toLowerCase();
        const targetBrand = activeBrand.toLowerCase();
        if (pBrand !== targetBrand && !pBrand.includes(targetBrand)) return false;
      }

      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (p.title || '').toLowerCase().includes(q);
        const brandMatch = (p.brand || '').toLowerCase().includes(q);
        if (!titleMatch && !brandMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      return 0;
    });
  }, [products, categoryParam, activeBrand, searchQuery, sortBy, isFootwear, isBags, isWatches]);

  // ─── Pagination: 20 Products Per Page for Fast Browsing ───
  const [currentPage, setCurrentPage] = useState(1);
  const productGridRef = useRef(null);
  const ITEMS_PER_PAGE = 20;

  // Reset to page 1 on filter, search, or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryParam, activeBrand, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

  const displayedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (productGridRef.current) {
      const yOffset = -90;
      const y = productGridRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Lock background scroll when search modal is open
  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
    };
  }, [searchOpen]);

  // Live Search Results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return (products || []).filter((p) => {
      const title = (p.title || '').toLowerCase();
      const brand = (p.brand || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      return title.includes(q) || brand.includes(q) || cat.includes(q);
    }).slice(0, 8);
  }, [products, searchQuery]);

  // Available brands in current category (Strictly deduplicated case-insensitively)
  const categoryAvailableBrands = useMemo(() => {
    const brandMap = new Map();
    products.forEach((p) => {
      const pCat = (p.category || '').toLowerCase();
      const pCatName = (p.categoryName || '').toLowerCase();
      const titleLower = (p.title || '').toLowerCase();
      const brandLower = (p.brand || '').toLowerCase();

      const isWatchMarker = brandLower.includes('rolex') || brandLower.includes('relox') || brandLower.includes('richard') || 
        brandLower.includes('patek') || brandLower.includes('audemars') || brandLower.includes('cartier') || 
        brandLower.includes('omega') || brandLower.includes('chopard') || brandLower.includes('chaumet') ||
        titleLower.includes('gmt') || titleLower.includes('submariner') || titleLower.includes('watch') || titleLower.includes('dial');

      const isFootwearMarker = titleLower.includes('boot') || titleLower.includes('heel') || titleLower.includes('sandal') || 
        titleLower.includes('shoe') || titleLower.includes('mule') || titleLower.includes('slide') || 
        titleLower.includes('sneaker') || titleLower.includes('pump') || titleLower.includes('loafer');

      const isBagMarker = titleLower.includes('bag') || titleLower.includes('tote') || titleLower.includes('peekaboo') || 
        titleLower.includes('evelyn') || titleLower.includes('kelly') || titleLower.includes('birkin') || 
        titleLower.includes('vanity') || titleLower.includes('hobo') || titleLower.includes('capucines');

      let match = false;
      if (isFootwear) {
        if (!isWatchMarker && !isBagMarker) {
          match = pCat === 'footwear' || pCat === 'shoes' || isFootwearMarker || pCatName.includes('shoe') || pCatName.includes('footwear');
        }
      } else if (isBags) {
        if (!isWatchMarker && !isFootwearMarker) {
          match = pCat === 'bags' || isBagMarker || pCatName.includes('bag');
        }
      } else if (isWatches) {
        if (!isBagMarker && !isFootwearMarker) {
          match = pCat === 'watches' || isWatchMarker || pCatName.includes('watch');
        }
      } else {
        match = true;
      }

      if (match && p.brand) {
        const rawBrand = p.brand.trim();
        const lower = rawBrand.toLowerCase();
        if (rawBrand && !brandMap.has(lower)) {
          // Normalize display: preserve clean capitalized name (e.g. Gina, Chanel, Dior)
          const display = rawBrand.charAt(0).toUpperCase() + rawBrand.slice(1);
          brandMap.set(lower, display);
        }
      }
    });
    return Array.from(brandMap.values());
  }, [products, isFootwear, isBags, isWatches]);

  const cartTotalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  }, [cart]);

  const cartTotalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cart]);

  const updateCartQty = (key, delta) => {
    const updated = cart.map((item) => {
      if ((item.cartKey || item.id) === key) {
        const newQty = (item.quantity || 1) + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean);
    setCart(updated);
    localStorage.setItem('smp_cart_items', JSON.stringify(updated));
  };

  const handleBrandSelect = (brandName) => {
    setActiveBrand(brandName);
    if (brandName === 'all') {
      router.push(`/collections/${categoryParam}`);
    } else {
      router.push(`/collections/${categoryParam}?brand=${encodeURIComponent(brandName)}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FFFFFF', fontFamily: "'Poppins', sans-serif", width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* ─── Top Announcement Bar (Milina Style) ─── */}
      <div className="top-announcement" role="region" aria-label="Announcement">
        <div className="top-announcement-track">
          <div className="top-announcement-group">
            <span><strong>FREE UAE DELIVERY 🇦🇪</strong></span>
            <span className="ticker-dot">•</span>
            <span><strong>INSPECT BEFORE PAYMENT</strong></span>
            <span className="ticker-dot">•</span>
            <span><strong>100% MASTER QUALITY</strong></span>
            <span className="ticker-dot">•</span>
            <span><strong>WHATSAPP: +971 52 597 3132</strong></span>
            <span className="ticker-dot">•</span>
          </div>
          <div className="top-announcement-group" aria-hidden="true">
            <span><strong>FREE UAE DELIVERY 🇦🇪</strong></span>
            <span className="ticker-dot">•</span>
            <span><strong>INSPECT BEFORE PAYMENT</strong></span>
            <span className="ticker-dot">•</span>
            <span><strong>100% MASTER QUALITY</strong></span>
            <span className="ticker-dot">•</span>
            <span><strong>WHATSAPP: +971 52 597 3132</strong></span>
            <span className="ticker-dot">•</span>
          </div>
        </div>
      </div>

      {/* ─── Luxury Navigation Header with SMP Logo (Offwhite / Cream / Brown Theme) ─── */}
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
              {cartTotalItems > 0 && (
                <span className="milina-cart-badge">{cartTotalItems}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Streamlined Luxury Header & Brand Bar (Unified & Space-Optimized) ─── */}
      <div style={{ background: '#FAF9F5', borderBottom: '1px solid #ECE7DE', padding: '14px 16px 0', width: '100%', maxWidth: '100vw', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Row 1: Title on Left, Sleek Minimal Sort on Right */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: '400', color: '#1A1817', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>
              {categoryTitle}
            </h1>

            {/* Single Price Sort Box with Arrow Inside */}
            <button
              type="button"
              onClick={() => {
                if (sortBy === 'price-low') {
                  setSortBy('price-high');
                } else if (sortBy === 'price-high') {
                  setSortBy('featured');
                } else {
                  setSortBy('price-low');
                }
              }}
              title="Toggle Price Sort: Low to High / High to Low"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '2px',
                border: (sortBy === 'price-low' || sortBy === 'price-high') ? '1px solid #111' : '1px solid #D5CEBF',
                background: (sortBy === 'price-low' || sortBy === 'price-high') ? '#111' : '#FFFFFF',
                color: (sortBy === 'price-low' || sortBy === 'price-high') ? '#FFF' : '#333',
                fontSize: '10.5px',
                fontWeight: '500',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>PRICE</span>
              <span style={{ fontSize: '11px', fontWeight: '700' }}>
                {sortBy === 'price-low' ? '↑' : sortBy === 'price-high' ? '↓' : '↑↓'}
              </span>
            </button>
          </div>

          {/* Row 2: Clean Brand Filter Tabs in Capital Letters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', minWidth: 'max-content', paddingBottom: '2px' }}>
            <button
              type="button"
              onClick={() => handleBrandSelect('all')}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 0 10px',
                borderBottom: activeBrand === 'all' ? '2px solid #66300F' : '2px solid transparent',
                color: activeBrand === 'all' ? '#66300F' : '#777777',
                fontSize: '11px',
                fontWeight: activeBrand === 'all' ? '600' : '400',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              ALL BRANDS
            </button>

            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="skeleton-box"
                  style={{ width: '65px', height: '14px', borderRadius: '2px', flexShrink: 0, margin: '8px 0' }}
                />
              ))
            ) : (
              categoryAvailableBrands.map((bName) => {
                const isSelected = activeBrand.toLowerCase() === bName.toLowerCase();
                return (
                  <button
                    key={bName}
                    type="button"
                    onClick={() => handleBrandSelect(bName)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '8px 0 10px',
                      borderBottom: isSelected ? '2px solid #66300F' : '2px solid transparent',
                      color: isSelected ? '#66300F' : '#777777',
                      fontSize: '11px',
                      fontWeight: isSelected ? '600' : '400',
                      textTransform: 'uppercase',
                      letterSpacing: '1.2px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {bName}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ─── Product Grid Section (Screenshot 4) ─── */}
      <main style={{ flex: 1, padding: '16px 12px 40px', maxWidth: '1280px', width: '100%', margin: '0 auto', boxSizing: 'border-box', overflowX: 'hidden' }}>
        {loading ? (
          <div className="milina-product-grid" aria-label="Loading products">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="milina-product-card skeleton-card">
                <div className="milina-product-img-wrap">
                  <div className="skeleton-product-shimmer-fill" />
                  <div className="skeleton-product-brand-tag" />
                </div>
                <div className="milina-product-info">
                  <div className="skeleton-product-title-bar" />
                  <div className="skeleton-product-price-bar" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FAF9F5', borderRadius: '12px', border: '1px dashed #D5CEBF' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>
              No products found in this selection
            </h3>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '18px' }}>
              Try clearing brand filters or explore another collection.
            </p>
            <button
              type="button"
              onClick={() => handleBrandSelect('all')}
              style={{
                padding: '10px 22px',
                background: '#000',
                color: '#FFF',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div ref={productGridRef}>
            {/* Catalog Count Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '0 2px' }}>
              <span style={{ fontSize: '12px', color: '#777', letterSpacing: '0.3px' }}>
                Showing <strong>{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredProducts.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</strong> of <strong>{filteredProducts.length}</strong> products
              </span>
              {totalPages > 1 && (
                <span style={{ fontSize: '11.5px', color: '#66300F', fontWeight: '500' }}>
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>

            {/* Fast 20 Products Grid */}
            <div className="milina-product-grid">
              {displayedProducts.map((product, idx) => {
                const productId = product._id || product.id;
                const formattedPrice = `AED ${product.price || '0'}`;

                return (
                  <Link
                    key={productId}
                    href={`/product/${productId}`}
                    onClick={() => trackProductClick(productId)}
                    className="milina-product-card"
                  >
                    {/* Photo Container */}
                    <div className="milina-product-img-wrap">
                      <img
                        src={optimizeCloudinaryUrl(product.image, 500)}
                        alt={product.title}
                        className="milina-product-img"
                        loading={idx < 4 ? "eager" : "lazy"}
                      />
                      {product.brand && (
                        <span className="milina-brand-tag">
                          {product.brand}
                        </span>
                      )}
                    </div>

                    {/* Details (Screenshot 4: Clean Title + Price) */}
                    <div className="milina-product-info">
                      <h3 className="milina-product-title">
                        {product.title}
                      </h3>
                      <div className="milina-product-price">
                        {formattedPrice}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination for 20 Products Per Page */}
            {totalPages > 1 && (
              <div className="new-arrivals-pagination" style={{ marginTop: '36px', marginBottom: '16px' }}>
                <button
                  type="button"
                  className="new-arrivals-page-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous Page"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  if (totalPages > 7) {
                    if (p !== 1 && p !== totalPages && Math.abs(p - currentPage) > 2) {
                      if (p === 2 || p === totalPages - 1) {
                        return <span key={p} style={{ padding: '0 4px', color: '#999', fontSize: '12px' }}>...</span>;
                      }
                      return null;
                    }
                  }
                  return (
                    <button
                      key={p}
                      type="button"
                      className={`new-arrivals-page-btn ${currentPage === p ? 'active' : ''}`}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="new-arrivals-page-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next Page"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ─── Mobile Slide Drawer Navigation ─── */}
      {mobileMenuOpen && (
        <>
          <div
            className="milina-drawer-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="milina-mobile-drawer">
            <div className="milina-drawer-header">
              <img src="/smp-logo.png" alt="SMP Logo" style={{ height: '44px', objectFit: 'contain' }} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="milina-icon-btn"
                style={{ padding: 4 }}
              >
                <X size={20} color="#111" />
              </button>
            </div>

            <div className="milina-drawer-links">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="milina-drawer-link">
                Home
              </Link>
              <Link href="/collections/shoes" onClick={() => setMobileMenuOpen(false)} className="milina-drawer-link">
                👠 Shoes &amp; Footwear
              </Link>
              <Link href="/collections/bags" onClick={() => setMobileMenuOpen(false)} className="milina-drawer-link">
                👜 Bags &amp; Handbags
              </Link>
              <Link href="/collections/watches" onClick={() => setMobileMenuOpen(false)} className="milina-drawer-link">
                ⌚ Watches &amp; Horology
              </Link>
              <Link href="/collections/all" onClick={() => setMobileMenuOpen(false)} className="milina-drawer-link">
                ✨ All Collections
              </Link>
            </div>

            <div className="milina-drawer-footer">
              <div style={{ fontSize: '11px', color: '#777', marginBottom: '8px' }}>
                DIRECT VIP WHATSAPP ORDERING:
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello SMP Atelier, I would like assistance with luxury orders.')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#25D366',
                  color: '#FFF',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '13px',
                  textDecoration: 'none'
                }}
              >
                <MessageSquare size={16} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </>
      )}

      {/* ─── Cart Drawer ─── */}
      {cartDrawerOpen && (
        <>
          <div
            className="milina-drawer-backdrop"
            onClick={() => setCartDrawerOpen(false)}
          />
          <div className="milina-cart-drawer">
            <div className="milina-drawer-header">
              <span style={{ fontSize: '16px', fontWeight: '700' }}>
                Shopping Bag ({cartTotalItems})
              </span>
              <button
                type="button"
                onClick={() => setCartDrawerOpen(false)}
                className="milina-icon-btn"
                style={{ padding: 4 }}
              >
                <X size={20} color="#111" />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>
                  <ShoppingBag size={40} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '14px', margin: 0 }}>Your bag is empty.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {cart.map((item) => {
                    const itemKey = item.cartKey || item.id;
                    return (
                      <div key={itemKey} style={{ display: 'flex', gap: '12px', paddingBottom: '14px', borderBottom: '1px solid #ECE7DE' }}>
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px', background: '#F8F6F2' }}
                        />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#111', margin: '0 0 4px' }}>
                            {item.title}
                          </h4>
                          <div style={{ fontSize: '11.5px', color: '#666', margin: '0 0 6px' }}>
                            {item.color && <span>Color: {item.color} </span>}
                            {item.size && <span>• Size: {item.size}</span>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ fontWeight: '700', fontSize: '13px', color: '#111' }}>
                              AED {item.price}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CCC', borderRadius: '4px' }}>
                              <button
                                type="button"
                                onClick={() => updateCartQty(itemKey, -1)}
                                style={{ padding: '3px 7px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                              >
                                -
                              </button>
                              <span style={{ fontSize: '12px', padding: '0 6px', fontWeight: '600' }}>
                                {item.quantity || 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQty(itemKey, 1)}
                                style={{ padding: '3px 7px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: '16px', background: '#FAF9F5', borderTop: '1px solid #ECE7DE' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '14px', color: '#555' }}>Subtotal:</span>
                  <span style={{ fontSize: '18px', fontWeight: '700', color: '#111' }}>
                    AED {cartTotalAmount.toLocaleString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const itemsSummary = cart.map((it, idx) => `${idx + 1}. ${it.title} (${it.color || 'Default'} - Size: ${it.size || 'Standard'}) x${it.quantity} - AED ${it.price * it.quantity}`).join('\n');
                    const msg = `🛍️ *NEW VIP ORDER (SHOPPING BAG) - SMP Super Master Products*\n━━━━━━━━━━━━━━━━━━━━━\n${itemsSummary}\n━━━━━━━━━━━━━━━━━━━━━\n💰 *Total Amount:* AED ${cartTotalAmount}\n🚚 Free Express Delivery across UAE with Inspect-Before-Payment Guarantee.`;
                    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#111111',
                    color: '#FFFFFF',
                    borderRadius: '2px',
                    fontSize: '13.5px',
                    fontWeight: '400',
                    border: '1px solid #111111',
                    cursor: 'pointer',
                    letterSpacing: '0.4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <WhatsAppIcon size={17} color="#FFFFFF" />
                  <span>Checkout via WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ─── Search Modal ─── */}
      {searchOpen && (
        <div className="search-modal-backdrop" onClick={() => setSearchOpen(false)}>
          <div className="search-modal-inner" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-bar-row">
              <div className="search-modal-pill">
                <Search size={18} className="search-modal-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search footwear, bags, watches..."
                  className="search-modal-input"
                  aria-label="Search catalog"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setSearchOpen(false);
                  }}
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="search-modal-clear-btn" aria-label="Clear search">
                    <X size={15} />
                  </button>
                )}
              </div>
              <button type="button" className="search-modal-close-text-btn" onClick={() => setSearchOpen(false)}>
                Cancel
              </button>
            </div>

            {searchQuery.trim() && (
              <div className="search-results-section">
                <div className="search-results-header">
                  {searchResults.length > 0 ? `Found ${searchResults.length} products` : 'No products found'}
                </div>
                <div className="search-results-list">
                  {searchResults.map((item) => (
                    <Link
                      key={item._id || item.id}
                      href={`/product/${item._id || item.id}`}
                      onClick={() => {
                        trackProductClick(item._id || item.id);
                        setSearchOpen(false);
                      }}
                      className="search-result-item"
                    >
                      <img src={item.image} alt={item.title} className="search-result-img" />
                      <div className="search-result-info">
                        <div className="search-result-brand">{item.brand || 'SMP Luxury'}</div>
                        <div className="search-result-title">{item.title}</div>
                        <div className="search-result-price-row">
                          <span className="search-result-price">AED {item.price}</span>
                        </div>
                      </div>
                      <ArrowRight size={16} color="#66300F" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Floating WhatsApp Concierge ─── */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello SMP Atelier! I would like to inquire about products.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="milina-whatsapp-float"
        aria-label="Contact WhatsApp concierge"
      >
        <WhatsAppIcon size={28} color="#FFFFFF" />
      </a>
    </div>
  );
}

