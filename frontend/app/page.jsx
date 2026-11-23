'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { INITIAL_PRODUCTS, INITIAL_BRANDS } from './initialData';
import { optimizeCloudinaryUrl } from './cloudinary';
import {
  Search,
  Menu,
  X,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  Truck,
  Lock,
  Handshake,
  Phone,
  Plus,
  Minus,
  Trash2,
  CheckCircle
} from 'lucide-react';

const WHATSAPP_NUMBER = '971525973132'; // +971 52 597 3132

// Authentic Official WhatsApp Vector Icon (Standard crisp SVG)
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

const INITIAL_FALLBACK_BRANDS = [
  { id: 'brand-1', name: 'Richard Mille', logo: '/IMG_9307.PNG', slug: 'richard-mille' },
  { id: 'brand-2', name: 'Bvlgari', logo: '/IMG_9308.PNG', slug: 'bvlgari' },
  { id: 'brand-3', name: 'Omega', logo: '/IMG_9309.PNG', slug: 'omega' },
  { id: 'brand-4', name: 'Chopard', logo: '/IMG_9310.PNG', slug: 'chopard' },
  { id: 'brand-5', name: 'Chaumet Paris', logo: '/IMG_9311.PNG', slug: 'chaumet-paris' },
  { id: 'brand-6', name: 'Graff', logo: '/IMG_9312.PNG', slug: 'graff' },
  { id: 'brand-7', name: 'SMP Luxury', logo: '/smp-logo.png', slug: 'smp-luxury' },
];

export default function StorefrontPage() {
  const [products, setProducts] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('smp_cached_products');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (_) {}
    }
    return INITIAL_PRODUCTS && INITIAL_PRODUCTS.length > 0 ? INITIAL_PRODUCTS : [];
  });
  const [brandsList, setBrandsList] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('smp_cached_brands');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (_) {}
    }
    return (INITIAL_BRANDS && INITIAL_BRANDS.length > 0) ? INITIAL_BRANDS : INITIAL_FALLBACK_BRANDS;
  });
  const [loading, setLoading] = useState(false);

  // Search & Navigation Modals
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cart & Orders
  const [cart, setCart] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [orderModalProduct, setOrderModalProduct] = useState(null);
  const [isCartOrder, setIsCartOrder] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');

  // Slider Refs for Brand Rows
  const bagsRef = useRef(null);
  const shoesRef = useRef(null);
  const watchesRef = useRef(null);

  const [bagsPage, setBagsPage] = useState(1);
  const [shoesPage, setShoesPage] = useState(1);
  const [watchesPage, setWatchesPage] = useState(1);

  // Load Cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('smp_cart_items') || localStorage.getItem('smp_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('smp_cart_items', JSON.stringify(newCart));
      localStorage.setItem('smp_cart', JSON.stringify(newCart));
    } catch (e) {}
  };

  const removeFromCart = (productId) => {
    const updated = cart.filter((item) => (item.cartKey ? item.cartKey !== productId : item.id !== productId));
    updateCart(updated);
  };

  const updateCartQty = (productId, delta) => {
    const updated = cart
      .map((item) => {
        const key = item.cartKey || item.id;
        if (key === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);
    updateCart(updated);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Fast Parallel Background Synchronization with Live Admin API
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const prodUrl = API_BASE ? `${API_BASE}/products` : '/api/products';
        const brandUrl = API_BASE ? `${API_BASE}/brands` : '/api/brands';

        const [prodRes, brandRes] = await Promise.allSettled([
          fetch(prodUrl),
          fetch(brandUrl)
        ]);

        if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
          const data = await prodRes.value.json();
          const list = Array.isArray(data) ? data : (data.products || []);
          if (isMounted && list.length > 0) {
            setProducts(list);
            try { sessionStorage.setItem('smp_cached_products', JSON.stringify(list)); } catch (_) {}
          }
        }

        if (brandRes.status === 'fulfilled' && brandRes.value.ok) {
          const brandData = await brandRes.value.json();
          if (isMounted && Array.isArray(brandData) && brandData.length > 0) {
            setBrandsList(brandData);
            try { sessionStorage.setItem('smp_cached_brands', JSON.stringify(brandData)); } catch (_) {}
          }
        }
      } catch (err) {
        console.warn('Sync notice:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  // Slider Scroll Handler
  const handleScrollSlider = (ref, direction, setPage, totalItems) => {
    if (!ref.current) return;
    const scrollAmount = 220;
    const currentScroll = ref.current.scrollLeft;
    const targetScroll = direction === 'next' ? currentScroll + scrollAmount : currentScroll - scrollAmount;
    ref.current.scrollTo({ left: targetScroll, behavior: 'smooth' });

    setTimeout(() => {
      if (ref.current) {
        const newPage = Math.max(1, Math.min(totalItems, Math.round(ref.current.scrollLeft / 180) + 1));
        setPage(newPage);
      }
    }, 200);
  };

  // Generate Brand Cards strictly from real products in the Database (Admin Panel)
  const getBrandCardsForCategory = (catType) => {
    const catProducts = products.filter((p) => {
      const c = (p.category || '').toLowerCase();
      const cn = (p.categoryName || '').toLowerCase();
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

      if (catType === 'footwear') {
        if (isWatchMarker || isBagMarker) return false;
        return c === 'footwear' || c === 'shoes' || isFootwearMarker || cn.includes('shoe') || cn.includes('footwear');
      }
      if (catType === 'bags') {
        if (isWatchMarker || isFootwearMarker) return false;
        return c === 'bags' || isBagMarker || cn.includes('bag');
      }
      if (catType === 'watches') {
        if (isBagMarker || isFootwearMarker) return false;
        return c === 'watches' || isWatchMarker || cn.includes('watch');
      }
      return false;
    });

    if (catProducts.length === 0) {
      return [];
    }

    const brandMap = new Map();
    catProducts.forEach((p) => {
      const rawBrand = (p.brand || '').trim();
      if (!rawBrand) return;
      const lower = rawBrand.toLowerCase();
      if (!brandMap.has(lower)) {
        // Normalize display name: Title case (e.g. Gina, Chanel, Dior)
        const display = rawBrand.charAt(0).toUpperCase() + rawBrand.slice(1);
        brandMap.set(lower, {
          brand: display,
          title: `${display} ${catType === 'footwear' ? 'shoes' : catType} →`,
          href: `/collections/${catType === 'footwear' ? 'shoes' : catType}?brand=${encodeURIComponent(display)}`,
          img: optimizeCloudinaryUrl(p.image || '', 400)
        });
      }
    });

    const brandCards = Array.from(brandMap.values());
    const firstBrandName = brandCards[0]?.brand?.toLowerCase() || '';

    // Guarantee NO adjacent identical images: pick a product from a DIFFERENT brand for the "all" card!
    const diffBrandProduct = catProducts.find((p) => {
      const b = (p.brand || '').trim().toLowerCase();
      return b && b !== firstBrandName && p.image;
    });
    const diffImgProduct = catProducts.find((p) => p.image && p.image !== brandCards[0]?.img);
    const allCardImg = diffBrandProduct?.image || diffImgProduct?.image || catProducts[0]?.image || '';

    const allCard = {
      title: `all ${catType === 'footwear' ? 'shoes' : catType} →`,
      href: `/collections/${catType === 'footwear' ? 'shoes' : catType}`,
      img: optimizeCloudinaryUrl(allCardImg, 400)
    };

    return [allCard, ...brandCards];
  };

  const bagsSlideCards = useMemo(() => getBrandCardsForCategory('bags'), [products]);
  const shoesSlideCards = useMemo(() => getBrandCardsForCategory('footwear'), [products]);
  const watchesSlideCards = useMemo(() => getBrandCardsForCategory('watches'), [products]);

  // "Shop by categories" Shortcut Cards strictly using compressed WebP group showcase images
  const categoryShortcuts = useMemo(() => [
    {
      title: 'ALL BAGS →',
      href: '/collections/bags',
      img: '/category-bags.webp'
    },
    {
      title: 'ALL SHOES →',
      href: '/collections/shoes',
      img: '/category-shoes.webp'
    },
    {
      title: 'ALL WATCHES →',
      href: '/collections/watches',
      img: '/category-watches.webp'
    }
  ], []);

  // ─── Mixed New Arrivals (30 Products Per Page: 10 Bags, 10 Shoes, 10 Watches Mixed) ───
  const [newArrivalsPage, setNewArrivalsPage] = useState(1);
  const newArrivalsRef = useRef(null);
  const NEW_ARRIVALS_PER_PAGE = 30;

  // Accurately categorize all products strictly using categories, titles & brands
  const categorizedProducts = useMemo(() => {
    const bags = [];
    const shoes = [];
    const watches = [];
    const others = [];

    (products || []).forEach((p) => {
      const pCat = (p.category || '').toLowerCase();
      const pCatName = (p.categoryName || '').toLowerCase();
      const titleLower = (p.title || '').toLowerCase();
      const brandLower = (p.brand || '').toLowerCase();

      const isWatch = pCat === 'watches' || pCatName.includes('watch') ||
        brandLower.includes('rolex') || brandLower.includes('relox') || brandLower.includes('richard') || 
        brandLower.includes('patek') || brandLower.includes('audemars') || brandLower.includes('cartier') || 
        brandLower.includes('omega') || brandLower.includes('chopard') || brandLower.includes('chaumet') ||
        titleLower.includes('gmt') || titleLower.includes('submariner') || titleLower.includes('watch') || titleLower.includes('dial');

      const isFootwear = !isWatch && (pCat === 'footwear' || pCat === 'shoes' || pCatName.includes('shoe') || pCatName.includes('footwear') ||
        titleLower.includes('boot') || titleLower.includes('heel') || titleLower.includes('sandal') || 
        titleLower.includes('shoe') || titleLower.includes('mule') || titleLower.includes('slide') || 
        titleLower.includes('sneaker') || titleLower.includes('pump') || titleLower.includes('loafer'));

      const isBag = !isWatch && !isFootwear && (pCat === 'bags' || pCatName.includes('bag') ||
        titleLower.includes('bag') || titleLower.includes('tote') || titleLower.includes('peekaboo') || 
        titleLower.includes('evelyn') || titleLower.includes('kelly') || titleLower.includes('birkin') || 
        titleLower.includes('vanity') || titleLower.includes('hobo') || titleLower.includes('capucines'));

      if (isWatch) watches.push(p);
      else if (isFootwear) shoes.push(p);
      else if (isBag) bags.push(p);
      else others.push(p);
    });

    return { bags, shoes, watches, others };
  }, [products]);

  const totalNewArrivalsPages = useMemo(() => {
    const { bags, shoes, watches, others } = categorizedProducts;
    const totalCount = bags.length + shoes.length + watches.length + others.length;
    if (totalCount === 0) return 1;
    const maxMain = Math.max(bags.length, shoes.length, watches.length);
    const pagesByCat = Math.ceil(maxMain / 10);
    const pagesByTotal = Math.ceil(totalCount / 30);
    return Math.max(1, Math.max(pagesByCat, pagesByTotal));
  }, [categorizedProducts]);

  const displayedNewArrivals = useMemo(() => {
    const { bags, shoes, watches, others } = categorizedProducts;
    const pageIndex = newArrivalsPage - 1;

    // 10 items from each category for the current page
    const pageBags = bags.slice(pageIndex * 10, (pageIndex + 1) * 10);
    const pageShoes = shoes.slice(pageIndex * 10, (pageIndex + 1) * 10);
    const pageWatches = watches.slice(pageIndex * 10, (pageIndex + 1) * 10);

    // Interleave in mixed order: Bag, Shoe, Watch, Bag, Shoe, Watch...
    const mixed = [];
    for (let i = 0; i < 10; i++) {
      if (pageBags[i]) mixed.push(pageBags[i]);
      if (pageShoes[i]) mixed.push(pageShoes[i]);
      if (pageWatches[i]) mixed.push(pageWatches[i]);
    }

    // If any category had fewer than 10 products on this page, fill with remaining products up to 30
    if (mixed.length < 30) {
      const seen = new Set(mixed.map(p => p._id || p.id));
      const pool = [...others, ...bags, ...shoes, ...watches];
      for (const p of pool) {
        const id = p._id || p.id;
        if (!seen.has(id)) {
          mixed.push(p);
          seen.add(id);
          if (mixed.length >= 30) break;
        }
      }
    }

    return mixed;
  }, [categorizedProducts, newArrivalsPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalNewArrivalsPages) return;
    setNewArrivalsPage(page);
    if (newArrivalsRef.current) {
      const yOffset = -90;
      const y = newArrivalsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const trackProductClick = (id) => {
    if (!id) return;
    try {
      fetch(`${API_BASE}/products/${id}/click`, { method: 'POST', keepalive: true }).catch(() => {});
    } catch (_) {}
  };

  // Lock background scroll when search modal is open
  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [searchOpen]);

  // Live Search Results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => {
      const title = (p.title || '').toLowerCase();
      const brand = (p.brand || '').toLowerCase();
      const cat = (p.category || '').toLowerCase();
      return title.includes(q) || brand.includes(q) || cat.includes(q);
    }).slice(0, 8);
  }, [searchQuery, products]);

  // Order Submission & WhatsApp Routing
  const handleOpenCartBuyNow = () => {
    if (cart.length === 0) return;
    setIsCartOrder(true);
    setOrderModalProduct(cart[0]);
    setCartDrawerOpen(false);
    setCustomerName('');
    setCustomerPhone('');
    setSubmittingOrder(false);
    setOrderSuccess(false);
  };

  const handleConfirmAndContinueWhatsApp = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please enter your Name and WhatsApp Mobile Number.');
      return;
    }

    setSubmittingOrder(true);

    const orderItems = isCartOrder
      ? cart.map((item) => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          color: item.color || '',
          size: item.size || ''
        }))
      : [
          {
            productId: orderModalProduct?.id,
            title: orderModalProduct?.title,
            price: orderModalProduct?.price,
            quantity: quantity,
            image: orderModalProduct?.image,
            color: orderModalProduct?.color || '',
            size: orderModalProduct?.size || ''
          }
        ];

    const totalAmount = isCartOrder ? totalCartPrice : (orderModalProduct?.price || 0) * quantity;

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
      console.warn('Backend order recording notice:', err);
    }

    let formattedMessage = '';
    if (isCartOrder) {
      const itemsList = cart
        .map(
          (item, idx) =>
            `${idx + 1}. *${item.title}* (${item.brand || 'SMP Luxury'})${item.color ? ` [Color: ${item.color}]` : ''}${item.size ? ` [Size: ${item.size}]` : ''}\n   Qty: ${item.quantity} × AED ${item.price} = AED ${item.quantity * item.price}`
        )
        .join('\n\n');

      formattedMessage = `🛍️ *NEW VIP ORDER (SHOPPING BAG) - SMP Super Master Products*
━━━━━━━━━━━━━━━━━━━━━
*Cart Items (${cart.length} Products):*

${itemsList}

━━━━━━━━━━━━━━━━━━━━━
💰 *Total Order Amount:* AED ${totalAmount}

👤 *Customer Details:*
*Name:* ${customerName.trim()}
*Phone:* ${customerPhone.trim()}
━━━━━━━━━━━━━━━━━━━━━

Hello SMP Atelier, please confirm my shopping bag order. Thank you!`;
    } else {
      formattedMessage = `🛍️ *NEW ORDER - SMP Super Master Products*
━━━━━━━━━━━━━━━━━━━━━
*Product:* ${orderModalProduct?.title}
*Brand:* ${orderModalProduct?.brand || 'SMP Luxury'}
*Price:* AED ${orderModalProduct?.price}
*Quantity:* ${quantity}
*Total Amount:* AED ${totalAmount}

📸 *Product Image:* ${orderModalProduct?.image}

👤 *Customer Details:*
*Name:* ${customerName.trim()}
*Phone:* ${customerPhone.trim()}
━━━━━━━━━━━━━━━━━━━━━

Hello SMP Atelier, please confirm my order. Thank you!`;
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`;
    setLastWhatsAppUrl(whatsappUrl);

    if (isCartOrder) {
      setCart([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('smp_cart_items');
        localStorage.removeItem('smp_cart');
      }
    }

    setSubmittingOrder(false);
    setOrderSuccess(true);

    try {
      const win = window.open(whatsappUrl, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = whatsappUrl;
      }
    } catch (err) {
      window.location.href = whatsappUrl;
    }
  };

  // SEO JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'SMP Super Master Products',
    url: 'https://smpfashion.ae',
    description: 'Curated luxury fashion in the UAE. Shoes, bags, and fine horology.',
    telephone: '+971525973132',
    currenciesAccepted: 'AED',
    priceRange: 'AED 350 - AED 1500'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Announcement Marquee */}
      <div className="top-announcement" role="region" aria-label="Announcement Ticker">
        <div className="top-announcement-track">
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
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="milina-icon-btn"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <Link href="/" className="milina-logo-link">
            <img
              src="/smp-logo.png"
              alt="SMP Logo"
              className="milina-logo-img"
            />
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setSearchOpen(true)}
              className="milina-icon-btn"
              aria-label="Search catalog"
            >
              <Search size={21} />
            </button>

            <button
              onClick={() => setCartDrawerOpen(true)}
              className="milina-icon-btn"
              style={{ position: 'relative' }}
              aria-label="Shopping bag"
            >
              <ShoppingBag size={21} />
              {totalCartCount > 0 && (
                <span className="milina-cart-badge">{totalCartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          ORIGINAL HERO BANNER SECTION (Using Original Hero Images)
          ───────────────────────────────────────────────────────────── */}
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

          {/* In-Banner Landscape Content for Mobile */}
          <div className="hero-landscape-content">
            <span className="hero-landscape-brand">SMP Atelier</span>
            <h2 className="hero-landscape-title">Every Step<br /><em>Feels Better</em></h2>
            <p className="hero-landscape-subtitle">COMFORT &amp; LUXURY FOR YOU</p>
            <Link href="/collections/shoes" className="hero-landscape-btn">Shop Now</Link>
          </div>
        </div>

        <div className="hero-overlay-content">
          <h1 className="hero-title-script">
            Fashion for your <br className="hero-break-mobile" />Passion
          </h1>
          <p className="hero-subtitle">
            Timeless pieces. Premium quality. Thoughtfully chosen to elevate your style and complete every moment. Direct delivery with inspection before payment.
          </p>

          <div className="hero-btn-row">
            <Link
              href="/collections/all"
              className="hero-btn-primary"
            >
              <span>Explore Collections</span>
            </Link>
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

      {/* Luxury Trust Guarantee Bar (Positioned below Hero Banner) */}
      <div className="wide-container" style={{ marginTop: '22px', marginBottom: '8px', position: 'relative', zIndex: 5 }}>
        <div className="trust-guarantee-bar">
          <div className="trust-guarantee-item">
            <div className="trust-guarantee-icon-wrap">
              <Lock size={20} strokeWidth={1.6} />
            </div>
            <div className="trust-guarantee-text">
              <span className="trust-guarantee-title">100% Secure Shopping</span>
            </div>
          </div>

          <div className="trust-guarantee-item">
            <div className="trust-guarantee-icon-wrap">
              <Handshake size={20} strokeWidth={1.6} />
            </div>
            <div className="trust-guarantee-text">
              <span className="trust-guarantee-title">Direct Dealing</span>
            </div>
          </div>

          <div className="trust-guarantee-item">
            <div className="trust-guarantee-icon-wrap">
              <ShieldCheck size={20} strokeWidth={1.6} />
            </div>
            <div className="trust-guarantee-text">
              <span className="trust-guarantee-title">Quality Check Before Payment</span>
            </div>
          </div>

          <div className="trust-guarantee-item">
            <div className="trust-guarantee-icon-wrap">
              <Truck size={20} strokeWidth={1.6} />
            </div>
            <div className="trust-guarantee-text">
              <span className="trust-guarantee-title">Free Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PRODUCT LISTING: SHOP BY CATEGORIES SHORTCUT SECTION (Placed First, 3 in 1 Row on Mobile)
          ───────────────────────────────────────────────────────────── */}
      <section className="milina-brand-section" style={{ paddingTop: '16px', paddingBottom: '14px' }}>
        <h2 className="milina-category-row-title" style={{ fontSize: '18px', marginBottom: '14px', letterSpacing: '0.5px' }}>
          SHOP BY CATEGORIES
        </h2>
        <div className="milina-category-shortcuts-grid">
          {categoryShortcuts.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="milina-category-shortcut-card"
            >
              <div className="milina-category-shortcut-img-box">
                <img src={item.img} alt={item.title} className="milina-brand-slide-img" loading="eager" />
              </div>
              <div className="milina-category-shortcut-title">
                <span>{item.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          PRODUCT LISTING: CATEGORY CAROUSELS (Bags, Shoes, Watches)
          (Shop by Brand button removed)
          ───────────────────────────────────────────────────────────── */}
      <section className="milina-brand-section" style={{ paddingTop: '0' }}>
        {loading ? (
          <>
            {/* Skeleton Row 1: BAGS */}
            <div className="milina-category-row" aria-label="Loading bags">
              <div className="milina-category-row-head">
                <div className="skeleton-box" style={{ width: '80px', height: '18px' }} />
                <div className="skeleton-box" style={{ width: '50px', height: '24px', borderRadius: '4px' }} />
              </div>
              <div className="milina-carousel-scroll">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="milina-brand-slide-card skeleton-card">
                    <div className="milina-brand-slide-img-box" style={{ position: 'relative', overflow: 'hidden' }}>
                      <div className="skeleton-product-shimmer-fill" />
                    </div>
                    <div className="milina-brand-slide-title" style={{ padding: '8px 4px' }}>
                      <div className="skeleton-box" style={{ width: '70%', height: '11px', margin: '0 auto' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skeleton Row 2: SHOES */}
            <div className="milina-category-row" aria-label="Loading shoes">
              <div className="milina-category-row-head">
                <div className="skeleton-box" style={{ width: '80px', height: '18px' }} />
                <div className="skeleton-box" style={{ width: '50px', height: '24px', borderRadius: '4px' }} />
              </div>
              <div className="milina-carousel-scroll">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="milina-brand-slide-card skeleton-card">
                    <div className="milina-brand-slide-img-box" style={{ position: 'relative', overflow: 'hidden' }}>
                      <div className="skeleton-product-shimmer-fill" />
                    </div>
                    <div className="milina-brand-slide-title" style={{ padding: '8px 4px' }}>
                      <div className="skeleton-box" style={{ width: '70%', height: '11px', margin: '0 auto' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 1. Bags Row */}
            {bagsSlideCards.length > 0 && (
              <div className="milina-category-row">
                <div className="milina-category-row-head">
                  <h3 className="milina-category-row-title">BAGS</h3>
                  <div className="milina-carousel-nav">
                    <button
                      onClick={() => handleScrollSlider(bagsRef, 'prev', setBagsPage, bagsSlideCards.length)}
                      className="milina-pdp-arrow-btn"
                      aria-label="Previous bags"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span>{bagsPage}/{bagsSlideCards.length}</span>
                    <button
                      onClick={() => handleScrollSlider(bagsRef, 'next', setBagsPage, bagsSlideCards.length)}
                      className="milina-pdp-arrow-btn"
                      aria-label="Next bags"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div ref={bagsRef} className="milina-carousel-scroll">
                  {bagsSlideCards.map((card, idx) => (
                    <Link
                      key={idx}
                      href={card.href}
                      onClick={() => trackProductClick(card.productId)}
                      className="milina-brand-slide-card"
                      prefetch={false}
                    >
                      <div className="milina-brand-slide-img-box">
                        <img src={card.img} alt={card.title} className="milina-brand-slide-img" loading="lazy" />
                      </div>
                      <div className="milina-brand-slide-title">
                        <span>{card.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Shoes Row */}
            {shoesSlideCards.length > 0 && (
              <div className="milina-category-row">
                <div className="milina-category-row-head">
                  <h3 className="milina-category-row-title">SHOES</h3>
                  <div className="milina-carousel-nav">
                    <button
                      onClick={() => handleScrollSlider(shoesRef, 'prev', setShoesPage, shoesSlideCards.length)}
                      className="milina-pdp-arrow-btn"
                      aria-label="Previous shoes"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span>{shoesPage}/{shoesSlideCards.length}</span>
                    <button
                      onClick={() => handleScrollSlider(shoesRef, 'next', setShoesPage, shoesSlideCards.length)}
                      className="milina-pdp-arrow-btn"
                      aria-label="Next shoes"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div ref={shoesRef} className="milina-carousel-scroll">
                  {shoesSlideCards.map((card, idx) => (
                    <Link
                      key={idx}
                      href={card.href}
                      onClick={() => trackProductClick(card.productId)}
                      className="milina-brand-slide-card"
                      prefetch={false}
                    >
                      <div className="milina-brand-slide-img-box">
                        <img src={card.img} alt={card.title} className="milina-brand-slide-img" loading="lazy" />
                      </div>
                      <div className="milina-brand-slide-title">
                        <span>{card.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Watches Row */}
            {watchesSlideCards.length > 0 && (
              <div className="milina-category-row">
                <div className="milina-category-row-head">
                  <h3 className="milina-category-row-title">WATCHES</h3>
                  <div className="milina-carousel-nav">
                    <button
                      onClick={() => handleScrollSlider(watchesRef, 'prev', setWatchesPage, watchesSlideCards.length)}
                      className="milina-pdp-arrow-btn"
                      aria-label="Previous watches"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span>{watchesPage}/{watchesSlideCards.length}</span>
                    <button
                      onClick={() => handleScrollSlider(watchesRef, 'next', setWatchesPage, watchesSlideCards.length)}
                      className="milina-pdp-arrow-btn"
                      aria-label="Next watches"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div ref={watchesRef} className="milina-carousel-scroll">
                  {watchesSlideCards.map((card, idx) => (
                    <Link
                      key={idx}
                      href={card.href}
                      onClick={() => trackProductClick(card.productId)}
                      className="milina-brand-slide-card"
                      prefetch={false}
                    >
                      <div className="milina-brand-slide-img-box">
                        <img src={card.img} alt={card.title} className="milina-brand-slide-img" loading="lazy" />
                      </div>
                      <div className="milina-brand-slide-title">
                        <span>{card.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          PRODUCT LISTING: NEW ARRIVALS SPOTLIGHT (Mixed 30 Products / 10 Per Page)
          ───────────────────────────────────────────────────────────── */}
      <section ref={newArrivalsRef} className="milina-new-arrivals-section">
        <div className="milina-new-arrivals-head">
          <h2 className="milina-new-arrivals-title">NEW ARRIVALS: CHECK OUT</h2>
          <Link href="/collections/all" className="milina-view-all-link">
            VIEW ALL →
          </Link>
        </div>

        {loading ? (
          <div className="milina-product-grid" aria-label="Loading new arrivals">
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
        ) : (
          <>
            <div className="milina-product-grid">
              {displayedNewArrivals.map((prod) => (
                <Link
                  key={prod._id || prod.id}
                  href={`/product/${prod._id || prod.id}`}
                  onClick={() => trackProductClick(prod._id || prod.id)}
                  className="milina-product-card"
                >
                  <div className="milina-product-img-wrap">
                    <img
                      src={optimizeCloudinaryUrl(prod.image, 500)}
                      alt={prod.title}
                      className="milina-product-img"
                      loading="lazy"
                    />
                    {prod.brand && (
                      <span className="milina-brand-tag">{prod.brand}</span>
                    )}
                  </div>
                  <div className="milina-product-info">
                    <h3 className="milina-product-title">{prod.title}</h3>
                    <div className="milina-product-price">
                      AED {prod.price}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination for New Arrivals */}
            {totalNewArrivalsPages > 1 && (
              <div className="new-arrivals-pagination">
                <button
                  type="button"
                  className="new-arrivals-page-btn"
                  onClick={() => handlePageChange(newArrivalsPage - 1)}
                  disabled={newArrivalsPage === 1}
                  aria-label="Previous Page"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalNewArrivalsPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`new-arrivals-page-btn ${newArrivalsPage === p ? 'active' : ''}`}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  className="new-arrivals-page-btn"
                  onClick={() => handlePageChange(newArrivalsPage + 1)}
                  disabled={newArrivalsPage === totalNewArrivalsPages}
                  aria-label="Next Page"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Brand Train Marquee */}
      <section className="brand-train-section brand-train-footer-wrap" aria-label="Luxury Brands">
        <div className="brand-train-track brand-train-reverse">
          {(() => {
            const validBrands = brandsList.filter((b) => b.logo || b.src);
            const displayBrands = validBrands.length > 0 ? validBrands : INITIAL_FALLBACK_BRANDS;
            return [...displayBrands, ...displayBrands, ...displayBrands, ...displayBrands].map((brand, idx) => (
              <div
                key={`brand-train-${idx}`}
                className="brand-train-item"
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={brand.logo || brand.src}
                  alt={brand.name}
                  className="brand-train-logo"
                  loading="lazy"
                />
              </div>
            ));
          })()}
        </div>
      </section>

      {/* Luxury Footer (Offwhite / Cream / Brown Theme) */}
      <footer className="site-footer" style={{ background: '#2C140E', color: '#FAF7EF' }}>
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-col">
              <Link href="/">
                <img
                  src="/smp-logo.png"
                  alt="SMP Super Master Products"
                  className="footer-logo-img"
                />
              </Link>
              <p className="footer-desc" style={{ marginTop: '12px' }}>
                Curating timeless luxury across footwear, horology, and fine leather goods. Handcrafted with master precision and delivered with direct VIP WhatsApp service across the UAE.
              </p>
              <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontSize: '13px' }}>
                <Phone size={15} style={{ color: '#E8D5C4' }} />
                <span>VIP Concierge: +971 52 597 3132</span>
              </div>
            </div>

            <div className="footer-col">
              <h3>Shop Collections</h3>
              <ul className="footer-links">
                <li><Link href="/collections/shoes">All Shoes</Link></li>
                <li><Link href="/collections/bags">All Bags</Link></li>
                <li><Link href="/collections/watches">All Watches</Link></li>
                <li><Link href="/collections/all">All Collections</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Client Care</h3>
              <ul className="footer-links">
                <li><Link href="/collections/all">Inspect Before Payment</Link></li>
                <li><Link href="/collections/all">Free UAE Express Delivery</Link></li>
                <li><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">WhatsApp Order Concierge</a></li>
                <li><a href="http://localhost:3003" target="_blank" rel="noopener noreferrer">Admin Management</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Risk-Free Guarantee</h3>
              <p className="footer-desc" style={{ marginBottom: '14px' }}>
                Experience 100% peace of mind. Pay zero upfront; our courier presents your luxury piece at your doorstep to inspect and approve before completing payment.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/tabby-badge.png" alt="Tabby" className="footer-badge-img" />
                <img src="/tamara-badge.png" alt="Tamara" className="footer-badge-img" />
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div>&copy; {new Date().getFullYear()} Super Master Products (SMP). All Rights Reserved.</div>
            <div className="footer-payment-badges">
              <span className="footer-payment-label">Payment &amp; Installments:</span>
              <img src="/tabby-badge.png" alt="Tabby - Split in 4" className="footer-badge-img" />
              <img src="/tamara-badge.png" alt="Tamara - Split in 4" className="footer-badge-img" />
              <span className="footer-badge-pill">Cash on Delivery</span>
              <span className="footer-badge-pill">Card on Delivery</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Concierge Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20SMP,%20I%20would%20like%20to%20order.`}
        target="_blank"
        rel="noopener noreferrer"
        className="milina-whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon size={28} color="#FFFFFF" />
      </a>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="milina-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="milina-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="milina-drawer-header">
              <img src="/smp-logo.png" alt="SMP Logo" style={{ height: '44px', objectFit: 'contain' }} />
              <button onClick={() => setMobileMenuOpen(false)} className="milina-icon-btn">
                <X size={20} />
              </button>
            </div>
            <div className="milina-drawer-links">
              <Link href="/" className="milina-drawer-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/collections/all" className="milina-drawer-link" onClick={() => setMobileMenuOpen(false)}>All Collections</Link>
              <Link href="/collections/shoes" className="milina-drawer-link" onClick={() => setMobileMenuOpen(false)}>Shoes</Link>
              <Link href="/collections/bags" className="milina-drawer-link" onClick={() => setMobileMenuOpen(false)}>Bags</Link>
              <Link href="/collections/watches" className="milina-drawer-link" onClick={() => setMobileMenuOpen(false)}>Watches</Link>
            </div>
            <div className="milina-drawer-footer">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20SMP,%20I%20need%20concierge%20assistance.`}
                target="_blank"
                rel="noopener noreferrer"
                className="milina-btn-buy-now"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
              >
                <WhatsAppIcon size={18} color="#FFFFFF" />
                <span>WhatsApp VIP Concierge</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div className="search-modal-backdrop" onClick={() => setSearchOpen(false)}>
          <div className="search-modal-inner" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-bar-row">
              <div className="search-modal-pill">
                <Search size={19} className="search-modal-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search footwear, bags, watches..."
                  className="search-modal-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setSearchOpen(false);
                  }}
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="search-modal-clear-btn">
                    <X size={16} />
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
                      <img src={optimizeCloudinaryUrl(item.image, 140)} alt={item.title} className="search-result-img" />
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

      {/* Cart Drawer */}
      {cartDrawerOpen && (
        <div className="milina-drawer-backdrop" onClick={() => setCartDrawerOpen(false)}>
          <div className="milina-cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="milina-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={18} color="#66300F" />
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#66300F' }}>Shopping Bag ({totalCartCount})</span>
              </div>
              <button onClick={() => setCartDrawerOpen(false)} className="milina-icon-btn">
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 16px', color: '#786F66' }}>
                  <ShoppingBag size={40} style={{ margin: '0 auto 14px', opacity: 0.3, color: '#C18A5B' }} />
                  <p style={{ fontWeight: '600', color: '#1C1917', marginBottom: '6px' }}>Your bag is empty</p>
                  <p style={{ fontSize: '13px', marginBottom: '18px' }}>Explore our curated shoes, bags, and watches.</p>
                  <Link
                    href="/collections/shoes"
                    onClick={() => setCartDrawerOpen(false)}
                    className="milina-btn-buy-now"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', width: 'auto', textDecoration: 'none' }}
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {cart.map((item) => {
                    const itemKey = item.cartKey || item.id;
                    return (
                      <div key={itemKey} style={{ display: 'flex', gap: '12px', paddingBottom: '14px', borderBottom: '1px solid #ECE7DE' }}>
                        <img src={item.image} alt={item.title} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '11px', color: '#A45A28', textTransform: 'uppercase', fontWeight: '700' }}>{item.brand || 'SMP'}</div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1C1917', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                          {(item.color || item.size) && (
                            <div style={{ fontSize: '11.5px', color: '#66300F', marginTop: '2px' }}>
                              {item.color && <span>{item.color} </span>}
                              {item.size && <span>• Size {item.size}</span>}
                            </div>
                          )}
                          <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#66300F', marginTop: '4px' }}>AED {item.price}</div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                            <button onClick={() => updateCartQty(itemKey, -1)} style={{ width: '24px', height: '24px', border: '1px solid #D6CEBE', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', color: '#66300F', cursor: 'pointer' }}>
                              <Minus size={11} />
                            </button>
                            <span style={{ fontSize: '12px', fontWeight: '700' }}>{item.quantity}</span>
                            <button onClick={() => updateCartQty(itemKey, 1)} style={{ width: '24px', height: '24px', border: '1px solid #D6CEBE', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', color: '#66300F', cursor: 'pointer' }}>
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(itemKey)} style={{ background: 'none', border: 'none', color: '#9B9185', cursor: 'pointer', padding: '4px' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: '16px', borderTop: '1px solid #ECE7DE', background: '#FAF8F5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#786F66' }}>
                  <span>Subtotal</span>
                  <span style={{ fontSize: '17px', fontWeight: '800', color: '#66300F' }}>AED {totalCartPrice}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#15803D', fontWeight: '600', marginBottom: '12px' }}>
                  ✓ Free Express UAE Delivery &amp; Inspection Before Payment
                </div>
                <button
                  onClick={handleOpenCartBuyNow}
                  className="milina-btn-buy-now"
                >
                  Buy It Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {orderModalProduct && (
        <div className="modal-overlay" onClick={() => !submittingOrder && setOrderModalProduct(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span style={{ fontSize: '11px', color: '#A45A28', fontWeight: '700', textTransform: 'uppercase' }}>
                  Delivery Details
                </span>
                <h3 className="modal-title">Complete Your Order</h3>
              </div>
              <button onClick={() => setOrderModalProduct(null)} className="modal-close-btn" disabled={submittingOrder}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              {orderSuccess ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <CheckCircle size={32} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#66300F', marginBottom: '6px' }}>
                    Order Saved &amp; WhatsApp Connected!
                  </h3>
                  <p style={{ fontSize: '13px', color: '#786F66', marginBottom: '18px', lineHeight: '1.4' }}>
                    WhatsApp is opening to finalize delivery with our concierge (+971 52 597 3132).
                  </p>
                  <a
                    href={lastWhatsAppUrl || `https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="milina-btn-buy-now"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', marginBottom: '8px' }}
                  >
                    <MessageSquare size={16} />
                    <WhatsAppIcon size={16} color="#FFFFFF" />
                    <span>Open WhatsApp Directly</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setOrderModalProduct(null)}
                    className="milina-btn-add-cart"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirmAndContinueWhatsApp}>
                  <div className="form-field">
                    <label className="field-label">Full Name *</label>
                    <label className="field-label" style={{ fontWeight: '400', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name *</label>
                    <input
                      type="text"
                      className="field-input"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Fatima Al Mansoori"
                      required
                    />
                  </div>

                  <div className="form-field" style={{ marginBottom: '16px' }}>
                    <label className="field-label">WhatsApp Mobile Number *</label>
                    <label className="field-label" style={{ fontWeight: '400', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>WhatsApp Mobile Number *</label>
                    <input
                      type="tel"
                      className="field-input"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+971 50 123 4567"
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', fontWeight: '400', letterSpacing: '1px' }}>Total Amount</span>
                    <span style={{ fontSize: '16px', fontWeight: '500', color: '#1A1817' }}>
                      AED {isCartOrder ? totalCartPrice : (orderModalProduct?.price || 0) * quantity}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingOrder}
                    className="milina-btn-buy-now"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <WhatsAppIcon size={17} color="#FFFFFF" />
                    <span>{submittingOrder ? 'Processing...' : 'Continue to WhatsApp (+971 52 597 3132)'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
