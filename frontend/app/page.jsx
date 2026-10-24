'use client';

import React, { useState, useEffect } from 'react';
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
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Home as HomeIcon,
  Tag,
  ChevronDown
} from 'lucide-react';

const WHATSAPP_NUMBER = '971525973132'; // +971 52 597 3132
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

const BRAND_LOGOS = INITIAL_FALLBACK_BRANDS;

// Luxury Double-Chime Audio Synthesis for Adding to Cart
const playAddToCartSound = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;
    
    // Primary Tone (D5 -> A5)
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

    // High Sparkle Chime (D6 -> A6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1174.66, now + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.2);
    gain2.gain.setValueAtTime(0.12, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.44);
  } catch (err) {
    // Audio context safely handled
  }
};

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
    color: 'Burgundy',
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
    color: 'Emerald Forest Green',
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
    color: 'Ivory Pearl White',
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
    gender: 'men',
    color: 'Two-Tone Steel & Gold',
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
    gender: 'men',
    color: 'Obsidian Black',
    badge: 'Exclusive'
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
    gender: 'women',
    color: '18K Rose Gold',
    badge: 'Hot Seller'
  },
  {
    id: 'prod-7b',
    title: 'Petite Pearl & Crystal Mesh Watch',
    category: 'watches',
    categoryName: 'Watches',
    brand: 'SMP Horology',
    price: 720,
    comparePrice: 950,
    discount: '-24%',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-delicate mother-of-pearl dial framed with pavé crystals and a flexible rose-gold Milanese mesh bracelet.',
    details: ['Mother of pearl iridescent dial', 'Pavé crystal bezel', 'Adjustable Milanese mesh strap', 'Water resistant 30m'],
    stock: 8,
    gender: 'women',
    color: 'Rose Gold & Pearl',
    badge: 'Trending'
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
    color: 'Burnished Cognac Brown',
    sizes: ['7', '8', '9', '10', '11'],
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
    color: 'Nude Blush Beige',
    sizes: ['36', '37', '38', '39', '40'],
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
    color: 'Crisp White & Monogram Brown',
    sizes: ['7', '8', '9', '10', '11'],
    badge: 'New'
  }
];

export default function StorefrontPage() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeGender, setActiveGender] = useState('all'); // 'all', 'men', 'women'
  const [activeBrand, setActiveBrand] = useState('all');
  const [brandsList, setBrandsList] = useState(INITIAL_FALLBACK_BRANDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState('all');
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showBrandFilter, setShowBrandFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch live products and brands from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await fetch(`${API_BASE}/products`);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (Array.isArray(prodData) && prodData.length > 0) {
            setProducts(prodData);
          }
        }
      } catch (err) {
        console.warn('Live products fallback:', err);
      }

      try {
        const brandRes = await fetch(`${API_BASE}/brands`);
        if (brandRes.ok) {
          const brandData = await brandRes.json();
          if (Array.isArray(brandData) && brandData.length > 0) {
            setBrandsList(brandData);
          }
        }
      } catch (err) {
        console.warn('Live brands fallback:', err);
      }
    };
    fetchData();
  }, []);

  // Quick View Modal
  const [viewProduct, setViewProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [orderSize, setOrderSize] = useState('');

  // Buy Now / Address Modal
  const [orderModalProduct, setOrderModalProduct] = useState(null);
  const [isCartOrder, setIsCartOrder] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [emirate, setEmirate] = useState('Dubai');
  const [notes, setNotes] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Shopping Cart State
  const [cart, setCart] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cartToast, setCartToast] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('smp_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  // Update cart in state & localStorage
  const updateCart = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('smp_cart', JSON.stringify(newCart));
    } catch (e) {}
  };

  const addToCart = (product, qty = 1, sizeChoice) => {
    playAddToCartSound();
    const chosenSize = sizeChoice !== undefined ? sizeChoice : (product.sizes && product.sizes.length > 0 ? (selectedSize || product.sizes[0]) : '');
    const itemKey = chosenSize ? `${product.id}-${chosenSize}` : product.id;
    let updated;
    const existingIndex = cart.findIndex((item) => (item.cartKey || item.id) === itemKey);
    if (existingIndex > -1) {
      updated = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + qty } : item
      );
    } else {
      updated = [...cart, { ...product, cartKey: itemKey, size: chosenSize, quantity: qty }];
    }
    updateCart(updated);
    setCartToast(`Added "${product.title}"${chosenSize ? ` (Size: ${chosenSize})` : ''} to Cart`);
    setTimeout(() => setCartToast(null), 2500);
  };

  const removeFromCart = (productId) => {
    const updated = cart.filter((item) => item.cartKey ? item.cartKey !== productId : item.id !== productId);
    updateCart(updated);
  };

  const updateQuantity = (productId, delta) => {
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

  const handleOrderCartWhatsApp = () => {
    if (cart.length === 0) return;
    const itemList = cart
      .map((item, idx) => `${idx + 1}. *${item.title}* (${item.brand || 'SMP Luxury'})${item.color ? ` [Color: ${item.color}]` : ''}${item.size ? ` [Size: ${item.size}]` : ''} (Qty: ${item.quantity}) - AED ${item.price * item.quantity}`)
      .join('\n');
    const msg = `🛍️ *NEW CART ORDER - SMP Super Master Products*
━━━━━━━━━━━━━━━━━━━━━
${itemList}
━━━━━━━━━━━━━━━━━━━━━
*Total Items:* ${totalCartCount}
*Grand Total:* AED ${totalCartPrice}

Hello SMP, I would like to order these items from my shopping bag.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/products`);
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

  // Open Buy Now Modal for single product
  const handleOpenBuyNow = (product, sizeChoice) => {
    setIsCartOrder(false);
    setOrderModalProduct(product);
    const resolvedSize = sizeChoice !== undefined ? sizeChoice : (product.sizes && product.sizes.length > 0 ? (selectedSize || product.sizes[0]) : '');
    setOrderSize(resolvedSize);
    setQuantity(1);
    setCustomerName('');
    setCustomerPhone('');
    setDeliveryAddress('');
    setEmirate('Dubai');
    setNotes('');
    setOrderSuccess(false);
  };

  // Open Buy Now Modal for entire cart
  const handleOpenCartBuyNow = () => {
    if (cart.length === 0) return;
    setIsCartOrder(true);
    setOrderModalProduct(cart[0]);
    setOrderSize('');
    setCartDrawerOpen(false);
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
    if (!orderModalProduct && !isCartOrder) return;
    setSubmittingOrder(true);

    const orderItems = isCartOrder
      ? cart.map(item => ({
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
            productId: orderModalProduct.id,
            title: orderModalProduct.title,
            price: orderModalProduct.price,
            quantity: quantity,
            image: orderModalProduct.image,
            color: orderModalProduct.color || '',
            size: orderSize || ''
          }
        ];

    const totalAmount = isCartOrder ? totalCartPrice : orderModalProduct.price * quantity;

    // 1. Save order to backend so admin can view full customer details, address, price, quantity, and images
    try {
      await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          deliveryAddress,
          emirate,
          notes,
          items: orderItems,
          totalPrice: totalAmount
        })
      });
    } catch (err) {
      console.warn('Backend order recording skipped or offline:', err);
    }

    // 2. Prepare WhatsApp message
    let formattedMessage = '';
    if (isCartOrder) {
      const itemsList = cart.map((item, idx) => 
        `${idx + 1}. *${item.title}* (${item.brand || 'SMP Luxury'})${item.color ? `\n   Color: ${item.color}` : ''}${item.size ? `\n   Size: ${item.size}` : ''}\n   Qty: ${item.quantity} × AED ${item.price} = AED ${item.quantity * item.price}\n   Image: ${item.image}`
      ).join('\n\n');

      formattedMessage =
        `🛍️ *NEW VIP ORDER (SHOPPING BAG) - SMP Super Master Products*
━━━━━━━━━━━━━━━━━━━━━
*Cart Items (${cart.length} Products):*

${itemsList}

━━━━━━━━━━━━━━━━━━━━━
💰 *Total Order Amount:* AED ${totalAmount}

📍 *Customer Delivery Address:*
*Name:* ${customerName}
*Phone:* ${customerPhone}
*Address:* ${deliveryAddress}
*Emirate:* ${emirate}
*Special Instructions:* ${notes || 'None'}
━━━━━━━━━━━━━━━━━━━━━

Please confirm my shopping bag order and arrange delivery. Thank you!`;
    } else {
      formattedMessage =
        `🛍️ *NEW ORDER - SMP Super Master Products*
━━━━━━━━━━━━━━━━━━━━━
*Product:* ${orderModalProduct.title}
*Category:* ${orderModalProduct.categoryName || orderModalProduct.category}${orderModalProduct.color ? `\n*Color:* ${orderModalProduct.color}` : ''}${orderSize ? `\n*Size:* ${orderSize}` : ''}
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

Please confirm my order and arrange delivery. Thank you!`;
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`;

    if (isCartOrder) {
      setCart([]);
      if (typeof window !== 'undefined') localStorage.removeItem('smp_cart_items');
    }

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

    // Watch Gender Sub-filter (Men / Women / All)
    if (activeCategory === 'watches' && activeGender !== 'all') {
      const pGender = (p.gender || '').toLowerCase();
      const text = `${p.title} ${p.description}`.toLowerCase();
      if (activeGender === 'men') {
        const isMen = pGender === 'men' || pGender === 'unisex' || (!pGender && (text.includes('men') || text.includes('chrono') || text.includes('steel') || text.includes('onyx') || text.includes('male')));
        if (!isMen) return false;
      } else if (activeGender === 'women') {
        const isWomen = pGender === 'women' || pGender === 'unisex' || (!pGender && (text.includes('women') || text.includes('rose gold') || text.includes('skeleton') || text.includes('crystal') || text.includes('petite') || text.includes('female')));
        if (!isWomen) return false;
      }
    }

    // Brand Filter
    if (activeBrand !== 'all') {
      const pBrand = (p.brand || '').toLowerCase();
      const targetBrand = activeBrand.toLowerCase();
      if (pBrand !== targetBrand && !pBrand.includes(targetBrand)) return false;
    }

    // Name, Brand, Category, & Description Multi-field Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = (p.title || '').toLowerCase().includes(q);
      const brandMatch = (p.brand || '').toLowerCase().includes(q);
      const catMatch = (p.category || '').toLowerCase().includes(q) || (p.categoryName || '').toLowerCase().includes(q);
      const descMatch = (p.description || '').toLowerCase().includes(q);
      if (!titleMatch && !brandMatch && !catMatch && !descMatch) return false;
    }

    if (priceFilter === 'under-400') return p.price < 400;
    if (priceFilter === '400-600') return p.price >= 400 && p.price <= 600;
    if (priceFilter === 'above-600') return p.price > 600;
    return true;
  });

  const activeFilterCount = (activeBrand !== 'all' ? 1 : 0) + (priceFilter !== 'all' ? 1 : 0);

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
          {/* Ticker Set 2 (Exact duplicate for seamless infinite loop) */}
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

          {/* Right Header Actions: Search Button & Shopping Cart */}
          <div className="header-actions">
            <button
              id="headerSearchBtn"
              type="button"
              className="header-search-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              title="Search products"
            >
              <Search size={20} />
              {searchQuery && <span className="header-search-active-dot" />}
            </button>

            <button
              id="headerCartBtn"
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

      {/* Floating Capsule Search Modal Overlay (Exact match to reference screenshot) */}
      {searchOpen && (
        <div
          id="searchModalOverlay"
          className="search-modal-backdrop"
          onClick={() => setSearchOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
        >
          <div
            className="search-modal-pill"
            onClick={(e) => e.stopPropagation()}
          >
            <Search size={20} className="search-modal-icon" />
            <input
              id="searchModalInput"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="search-modal-input"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSearchOpen(false);
                if (e.key === 'Enter') {
                  setSearchOpen(false);
                  const el = document.getElementById('collections');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
            <button
              id="searchModalCloseBtn"
              type="button"
              onClick={() => {
                if (searchQuery) {
                  setSearchQuery('');
                } else {
                  setSearchOpen(false);
                }
              }}
              className="search-modal-close"
              aria-label={searchQuery ? "Clear search" : "Close search"}
              title={searchQuery ? "Clear search" : "Close search"}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

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

            {/* Mobile Drawer Search Box */}
            <div className="mobile-drawer-search">
              <div className="mobile-search-inner">
                <Search size={16} color="var(--color-text-muted)" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search footwear, watches, brands..."
                  className="mobile-search-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setMobileMenuOpen(false);
                      const el = document.getElementById('collections');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="mobile-search-clear">
                    <X size={14} />
                  </button>
                )}
              </div>
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

          {/* In-Banner Landscape Content for Mobile (Matching Screenshot) */}
          <div className="hero-landscape-content">
            <span className="hero-landscape-brand">SMP Atelier</span>
            <h2 className="hero-landscape-title">Every Step<br /><em>Feels Better</em></h2>
            <p className="hero-landscape-subtitle">COMFORT &amp; LUXURY FOR YOU</p>
            <a href="#collections" className="hero-landscape-btn">Shop Now</a>
          </div>
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
      <section id="collections" className="products-section" style={{ padding: '36px 0 64px 0' }}>
        <div className="wide-container">

          {/* Minimalist Category Filter Bar with Price Filter (Clean Luxury Editorial Tabs) */}
          <div className="editorial-filter-bar">
            <div className="editorial-cat-list">
              <button
                onClick={() => { setActiveCategory('all'); setActiveGender('all'); }}
                className={`editorial-cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
              >
                All
              </button>
              <button
                onClick={() => { setActiveCategory('footwear'); setActiveGender('all'); }}
                className={`editorial-cat-btn ${activeCategory === 'footwear' ? 'active' : ''}`}
              >
                Footwear
              </button>
              <button
                onClick={() => setActiveCategory('watches')}
                className={`editorial-cat-btn ${activeCategory === 'watches' ? 'active' : ''}`}
              >
                Watches
              </button>
              <button
                onClick={() => { setActiveCategory('bags'); setActiveGender('all'); }}
                className={`editorial-cat-btn ${activeCategory === 'bags' ? 'active' : ''}`}
              >
                Bags
              </button>
            </div>

            {/* Minimalist Filter Controls: Square-type Brand & Filter Boxes */}
            <div className="editorial-boxes-row">
              {/* Left Box: All Brands Dropdown Box */}
              <div className="editorial-select-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setShowBrandFilter(!showBrandFilter);
                    setShowPriceFilter(false);
                  }}
                  className={`editorial-select-box ${showBrandFilter || activeBrand !== 'all' ? 'active' : ''}`}
                  aria-label="Filter by Brand"
                >
                  <Tag size={15} className="editorial-box-icon" />
                  {(() => {
                    const activeBrandObj = brandsList.find(b => b.name.toLowerCase() === activeBrand.toLowerCase());
                    const activeLogo = activeBrandObj?.logo || activeBrandObj?.src;
                    if (activeBrand !== 'all' && activeLogo) {
                      return (
                        <div className="editorial-selected-brand-wrap" title={activeBrand}>
                          <img
                            src={activeLogo}
                            alt={activeBrand}
                            className="editorial-box-brand-logo"
                          />
                        </div>
                      );
                    }
                    return (
                      <span className="editorial-brand-name-text">
                        {activeBrand === 'all' ? 'All brands' : activeBrand}
                      </span>
                    );
                  })()}
                  <ChevronDown
                    size={14}
                    className="editorial-box-chevron"
                    style={{
                      transform: showBrandFilter ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                </button>

                {showBrandFilter && (
                  <div className="brand-filter-dropdown brand-logos-only-dropdown">
                    <button
                      type="button"
                      onClick={() => { setActiveBrand('all'); setShowBrandFilter(false); }}
                      className={`brand-all-opt-btn ${activeBrand === 'all' ? 'active' : ''}`}
                    >
                      All brands
                    </button>
                    <div className="brand-logos-filter-grid">
                      {brandsList.map((b) => {
                        const logoSrc = b.logo || b.src;
                        if (!logoSrc) return null;
                        const isSelected = activeBrand.toLowerCase() === b.name.toLowerCase();
                        return (
                          <button
                            type="button"
                            key={b.id || b._id || b.name}
                            onClick={() => { setActiveBrand(b.name); setShowBrandFilter(false); }}
                            className={`brand-logo-card-btn ${isSelected ? 'active' : ''}`}
                            title={`Filter by ${b.name}`}
                            aria-label={`Filter by ${b.name}`}
                          >
                            <img
                              src={logoSrc}
                              alt={b.name}
                              className="brand-opt-small-logo"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Box: Filter Button Box */}
              <div className="editorial-filter-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setShowPriceFilter(!showPriceFilter);
                    setShowBrandFilter(false);
                  }}
                  className={`editorial-filter-box-btn ${showPriceFilter || priceFilter !== 'all' ? 'active' : ''}`}
                  aria-label="Open Filter"
                >
                  <div className="editorial-filter-box-left">
                    <SlidersHorizontal size={15} className="editorial-box-icon" />
                    <span className="editorial-filter-label-text">Filter</span>
                  </div>
                  {activeFilterCount > 0 && (
                    <span className="editorial-filter-badge">{activeFilterCount}</span>
                  )}
                </button>

                {showPriceFilter && (
                  <div className="price-filter-dropdown">
                    <button
                      type="button"
                      onClick={() => { setPriceFilter('all'); setShowPriceFilter(false); }}
                      className={`price-opt-btn ${priceFilter === 'all' ? 'active' : ''}`}
                    >
                      All prices
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPriceFilter('under-400'); setShowPriceFilter(false); }}
                      className={`price-opt-btn ${priceFilter === 'under-400' ? 'active' : ''}`}
                    >
                      Under AED 400
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPriceFilter('400-600'); setShowPriceFilter(false); }}
                      className={`price-opt-btn ${priceFilter === '400-600' ? 'active' : ''}`}
                    >
                      AED 400 - AED 600
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPriceFilter('above-600'); setShowPriceFilter(false); }}
                      className={`price-opt-btn ${priceFilter === 'above-600' ? 'active' : ''}`}
                    >
                      Above AED 600
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Brand Indicator Filter Chip */}
          {activeBrand !== 'all' && (
            <div className="active-brand-indicator-bar">
              <span style={{ fontSize: '11.5px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                Active Brand:
              </span>
              <span className="active-brand-chip">
                {activeBrand}
                <button onClick={() => setActiveBrand('all')} title="Clear brand filter" className="clear-brand-btn">
                  <X size={12} />
                </button>
              </span>
            </div>
          )}



          {/* Watch Gender Sub-filter Bar (Men's / Women's Watches) */}
          {activeCategory === 'watches' && (
            <div className="watch-gender-subbar">
              <button
                onClick={() => setActiveGender('all')}
                className={`watch-gender-pill ${activeGender === 'all' ? 'active' : ''}`}
              >
                All Watches
              </button>
              <button
                onClick={() => setActiveGender('men')}
                className={`watch-gender-pill ${activeGender === 'men' ? 'active' : ''}`}
              >
                Men&apos;s Watches
              </button>
              <button
                onClick={() => setActiveGender('women')}
                className={`watch-gender-pill ${activeGender === 'women' ? 'active' : ''}`}
              >
                Women&apos;s Watches
              </button>
            </div>
          )}

          {/* 6 Products in One Row on Laptop View, 2 on Mobile */}
          <div className="products-grid-6col">
            {filteredProducts.map((p, pIdx) => (
              <React.Fragment key={p.id}>
                <div className="editorial-card">
                  {/* Image Wrap without badge or wishlist icon */}
                  <div
                    className="editorial-img-wrap"
                    onClick={() => {
                      setViewProduct(p);
                      setSelectedSize(p.sizes && p.sizes.length > 0 ? p.sizes[0] : '');
                    }}
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
                        onClick={() => {
                          setViewProduct(p);
                          setSelectedSize(p.sizes && p.sizes.length > 0 ? p.sizes[0] : '');
                        }}
                        style={{ cursor: 'pointer' }}
                        title={p.title}
                      >
                        {p.title}
                      </h3>
                    </div>

                    {/* Clean price row without color display (color only shown in inner page) */}
                    <div className="editorial-price-row">
                      <span className="editorial-price">AED {p.price}</span>
                    </div>

                    {/* Actions Row: BUY NOW + Small Cart Icon */}
                    <div className="editorial-actions-row">
                      <button
                        onClick={() => handleOpenBuyNow(p, p.sizes && p.sizes.length > 0 ? p.sizes[0] : '')}
                        className="btn-buy-now-solid"
                        title="Order via WhatsApp with Inspection on Delivery"
                      >
                        BUY NOW
                      </button>
                      <button
                        onClick={() => addToCart(p, 1, p.sizes && p.sizes.length > 0 ? p.sizes[0] : '')}
                        className="btn-card-cart"
                        title="Add to Cart"
                        aria-label={`Add ${p.title} to cart`}
                      >
                        <ShoppingBag size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Brand Logos Train Marquee after 4 Products (Dynamic) */}
                {pIdx === 3 && (
                  <div className="collection-brand-train-wrapper">
                    <div className="brand-train-section" aria-label="Luxury Brands">
                      <div className="brand-train-track brand-train-forward">
                        {(() => {
                          const validBrands = brandsList.filter(b => b.logo || b.src);
                          const displayBrands = validBrands.length > 0 ? validBrands : INITIAL_FALLBACK_BRANDS;
                          return [...displayBrands, ...displayBrands, ...displayBrands, ...displayBrands].map((brand, bIdx) => (
                            <div 
                              key={`brand-train-${bIdx}`} 
                              className="brand-train-item"
                              onClick={() => {
                                setActiveBrand(brand.name);
                                const el = document.getElementById('collections');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }}
                              title={`Filter by ${brand.name}`}
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
                    </div>
                  </div>
                )}

                {/* 4-Step Order Process Infographic Banner after 10 Products */}
                {pIdx === 9 && (
                  <div className="collection-order-process-banner">
                    <img
                      src="/order-process-banner.png"
                      alt="SMP Order Process - Search Products, Order Through WhatsApp, Inspect Before Payment, Happy Delivery"
                      className="collection-order-process-img"
                      loading="lazy"
                    />
                  </div>
                )}
              </React.Fragment>
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
              <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px', background: '#FAF7EF' }}>
                <img
                  src={viewProduct.image}
                  alt={viewProduct.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Clean Price Only - No Discount or Compare Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-dark-brown)' }}>
                  AED {viewProduct.price}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#15803D', fontWeight: '700', background: '#DCFCE7', padding: '3px 8px', borderRadius: '4px' }}>
                  In Stock - Ready to Dispatch
                </span>
              </div>

              {/* Product Color Spec */}
              {viewProduct.color && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                    Color:
                  </span>
                  <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--color-dark-brown)', background: '#FAF7EF', border: '1px solid #E8E2D5', padding: '3px 10px', borderRadius: '4px' }}>
                    {viewProduct.color}
                  </span>
                </div>
              )}

              {/* Optional Sizes Selector (e.g. Footwears) */}
              {viewProduct.sizes && viewProduct.sizes.length > 0 && (
                <div style={{ marginBottom: '16px', background: '#FAF7EF', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E8E2D5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#66300F', fontWeight: '700' }}>
                      Available Sizes <span style={{ textTransform: 'none', fontWeight: 'normal', color: 'var(--color-text-muted)' }}>(Optional)</span>:
                    </span>
                    {selectedSize && (
                      <span style={{ fontSize: '11.5px', color: '#66300F', fontWeight: '700' }}>
                        Selected: {selectedSize}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {viewProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                        style={{
                          minWidth: '40px',
                          height: '34px',
                          padding: '0 12px',
                          borderRadius: '6px',
                          border: selectedSize === sz ? '1.5px solid #66300F' : '1px solid #D8D0C3',
                          background: selectedSize === sz ? '#66300F' : '#FFFFFF',
                          color: selectedSize === sz ? '#FFFFFF' : '#332E29',
                          fontWeight: selectedSize === sz ? '700' : '500',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                {viewProduct.description}
              </p>

              {viewProduct.details && viewProduct.details.length > 0 && (
                <div style={{ background: '#FAF7EF', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '18px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-dark-brown)', marginBottom: '8px' }}>
                    Craftsmanship &amp; Highlights:
                  </h4>
                  <ul style={{ paddingLeft: '18px', fontSize: '12.5px', color: '#4B230A', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {viewProduct.details.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons: Add to Cart + Buy Now */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    addToCart(viewProduct, 1, selectedSize);
                    setViewProduct(null);
                  }}
                  className="btn-modal-cart"
                  title="Add to Cart"
                >
                  <ShoppingBag size={17} />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => {
                    const p = viewProduct;
                    const sz = selectedSize;
                    setViewProduct(null);
                    handleOpenBuyNow(p, sz);
                  }}
                  className="btn-buy-now-solid"
                  style={{ flex: 1, margin: 0, padding: '12px 16px', fontSize: '13px' }}
                >
                  BUY NOW
                </button>
              </div>
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
                  {/* Selected Cart / Product Summary Box */}
                  {isCartOrder ? (
                    <div style={{ padding: '10px 12px', background: '#FAF7EF', border: '1px solid #E8E2D2', borderRadius: '8px', marginBottom: '14px', maxHeight: '160px', overflowY: 'auto' }}>
                      <div style={{ fontSize: '11px', color: '#66300F', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                        Shopping Bag Items ({cart.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {cart.map(item => (
                          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={item.image} alt={item.title} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #C18A5B' }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1C1917', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.title}
                              </div>
                              <div style={{ fontSize: '11px', color: '#66300F', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                <span>{item.quantity} × AED {item.price}</span>
                                {item.color && <span>• {item.color}</span>}
                                {item.size && <span>• Size {item.size}</span>}
                              </div>
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#66300F' }}>
                              AED {item.quantity * item.price}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : orderModalProduct ? (
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-dark-brown)' }}>
                            AED {orderModalProduct.price}
                          </span>
                          {orderModalProduct.color && (
                            <span style={{ fontSize: '10.5px', color: '#66300F', background: '#F4EFE6', padding: '1px 6px', borderRadius: '3px', fontWeight: '600' }}>
                              Color: {orderModalProduct.color}
                            </span>
                          )}
                          {orderSize && (
                            <span style={{ fontSize: '10.5px', color: '#1E40AF', background: '#EFF6FF', padding: '1px 6px', borderRadius: '3px', fontWeight: '600' }}>
                              Size: {orderSize}
                            </span>
                          )}
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
                  ) : null}

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
                      AED {isCartOrder ? totalCartPrice : (orderModalProduct ? orderModalProduct.price * quantity : 0)}
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

      {/* Slide-in Shopping Cart Drawer */}
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
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="modal-close-btn"
                aria-label="Close cart"
              >
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
                  <p style={{ fontSize: '12.5px', marginBottom: '20px' }}>
                    Explore our curated footwear, watches, and handbags.
                  </p>
                  <button
                    onClick={() => setCartDrawerOpen(false)}
                    className="btn-buy-now-solid"
                    style={{ maxWidth: '200px', margin: '0 auto', padding: '10px 16px' }}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item-row">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="cart-item-img"
                      />
                      <div className="cart-item-info">
                        <div className="cart-item-brand">{item.brand || 'SMP'}</div>
                        <div className="cart-item-title">{item.title}</div>
                        <div className="cart-item-price">AED {item.price}</div>
                        <div className="cart-item-qty-row">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="cart-qty-btn"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="cart-qty-val">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="cart-qty-btn"
                            aria-label="Increase quantity"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="cart-item-remove-btn"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-drawer-footer">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#6A5F54', fontWeight: '500' }}>Subtotal</span>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: '#66300F' }}>
                    AED {totalCartPrice}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#15803D', fontWeight: '600', marginBottom: '14px' }}>
                  ✓ Free UAE Delivery &amp; Inspection Before Payment
                </div>
                <button
                  onClick={handleOpenCartBuyNow}
                  className="btn-buy-now-solid"
                  style={{ width: '100%', padding: '14px', fontSize: '13px' }}
                >
                  <span>BUY NOW</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Add to Cart Toast Notification */}
      {cartToast && (
        <div className="cart-toast-notification">
          <ShoppingBag size={15} />
          <span>{cartToast}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          BRAND LOGOS TRAIN ANIMATION (OPPOSITE / RIGHT DIRECTION - ABOVE FOOTER)
          ───────────────────────────────────────────────────────────── */}
      <section className="brand-train-section brand-train-footer-wrap" aria-label="Luxury Brands">
        <div className="brand-train-track brand-train-reverse">
          {(() => {
            const validBrands = brandsList.filter(b => b.logo || b.src);
            const displayBrands = validBrands.length > 0 ? validBrands : INITIAL_FALLBACK_BRANDS;
            return [...displayBrands, ...displayBrands, ...displayBrands, ...displayBrands].map((brand, idx) => (
              <div 
                key={`brand-bot-${idx}`} 
                className="brand-train-item"
                onClick={() => {
                  setActiveBrand(brand.name);
                  const el = document.getElementById('collections');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                title={`Filter by ${brand.name}`}
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
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#241105', fontSize: '13.5px', fontWeight: '500' }}>
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
              <p className="footer-desc" style={{ marginBottom: '14px' }}>
                Experience 100% peace of mind. Pay zero upfront; our courier presents your luxury piece at your doorstep to inspect and approve before completing payment.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.65)', border: '1px solid rgba(102, 48, 15, 0.25)', padding: '8px 14px', borderRadius: '8px', color: '#1A0B02', fontSize: '12px', fontWeight: '600', width: 'fit-content' }}>
                  <ShieldCheck size={16} />
                  <span>100% Authenticity Guarantee</span>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#241105', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                    Pay in 4 Installments:
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src="/tabby-badge.png" alt="Tabby" className="footer-badge-img" />
                    <img src="/tamara-badge.png" alt="Tamara" className="footer-badge-img" />
                  </div>
                </div>
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
    </div>
  );
}
