'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle,
  X,
  Phone,
  Clock,
  Sparkles
} from 'lucide-react';

const WHATSAPP_NUMBER = '971525973132';
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';
const cleanApiUrl = rawApiUrl.replace(/\/+$/, '');
const API_BASE = cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`;

const FALLBACK_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'Burgundy Leather Top Handle Bag',
    category: 'bags',
    categoryName: 'Bags',
    brand: 'SMP Luxury',
    price: 490,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    description: 'Sculpted calfskin leather with polished gold-tone hardware clasp. Features reinforced top handles and a detachable shoulder strap for effortless versatility.',
    details: ['100% Genuine Italian Calfskin', '24K Gold electroplated lock', 'Interior slip & zip compartments', 'Protective bottom metal studs'],
    stock: 12,
    color: 'Burgundy'
  },
  {
    id: 'prod-8',
    title: 'Cognac Leather Bit Loafers',
    category: 'footwear',
    categoryName: 'Footwear',
    brand: 'SMP Calzature',
    price: 450,
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
    description: 'Burnished cognac calfskin loafers accented with brushed brass horsebit hardware. Hand-stitched apron toe and cushioned leather insole.',
    details: ['Handcrafted Blake-stitched sole', 'Full grain burnished leather', 'Memory foam comfort arch support', 'Non-slip rubber heel insert'],
    stock: 14,
    color: 'Burnished Cognac Brown',
    sizes: ['7', '8', '9', '10', '11']
  }
];

export default function ProductInnerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [emirate, setEmirate] = useState('Dubai');
  const [notes, setNotes] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } else {
        const fallback = FALLBACK_PRODUCTS.find((p) => p.id === id) || FALLBACK_PRODUCTS[0];
        setProduct(fallback);
        if (fallback.sizes && fallback.sizes.length > 0) {
          setSelectedSize(fallback.sizes[0]);
        }
      }
    } catch (err) {
      const fallback = FALLBACK_PRODUCTS.find((p) => p.id === id) || FALLBACK_PRODUCTS[0];
      setProduct(fallback);
      if (fallback.sizes && fallback.sizes.length > 0) {
        setSelectedSize(fallback.sizes[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    try {
      const saved = localStorage.getItem('smp_cart');
      const cart = saved ? JSON.parse(saved) : [];
      const itemKey = selectedSize ? `${product.id}-${selectedSize}` : product.id;
      const idx = cart.findIndex((item) => (item.cartKey || item.id) === itemKey);
      let updated;
      if (idx > -1) {
        updated = cart.map((item, i) => (i === idx ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        updated = [...cart, { ...product, cartKey: itemKey, size: selectedSize, quantity: 1 }];
      }
      localStorage.setItem('smp_cart', JSON.stringify(updated));
      setToastMessage(`Added "${product.title}"${selectedSize ? ` (Size: ${selectedSize})` : ''} to Cart`);
      setTimeout(() => setToastMessage(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmAndContinueWhatsApp = async (e) => {
    e.preventDefault();
    if (!product) return;
    setSubmittingOrder(true);

    const totalAmount = product.price * quantity;
    const orderItems = [
      {
        productId: product.id || product._id,
        title: product.title,
        price: product.price,
        quantity: quantity,
        image: product.image,
        color: product.color || '',
        size: selectedSize || ''
      }
    ];

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
      console.warn('Backend order recording error:', err);
    }

    const formattedMessage =
      `🛍️ *NEW ORDER - SMP Super Master Products*
━━━━━━━━━━━━━━━━━━━━━
*Product:* ${product.title}
*Category:* ${product.categoryName || product.category}${product.color ? `\n*Color:* ${product.color}` : ''}${selectedSize ? `\n*Size:* ${selectedSize}` : ''}
*Quantity:* ${quantity}
*Price:* AED ${product.price}
*Total Amount:* AED ${totalAmount}

📸 *Product Image:* ${product.image}

📍 *Customer Shipping Details:*
*Name:* ${customerName}
*Phone:* ${customerPhone}
*Address:* ${deliveryAddress}
*Emirate:* ${emirate}
*Special Instructions:* ${notes || 'None'}
━━━━━━━━━━━━━━━━━━━━━

Please confirm my order and arrange delivery. Thank you!`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`;
    setSubmittingOrder(false);
    setOrderSuccess(true);
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 400);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#66300F', fontFamily: 'var(--font-sans)' }}>
        Loading luxury product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '70vh', padding: '60px 20px', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>
        <h2>Product Not Found</h2>
        <Link href="/#collections" style={{ color: '#66300F', fontWeight: '600', textDecoration: 'underline', marginTop: '16px', display: 'inline-block' }}>
          ← Return to All Collections
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text-main)', fontFamily: 'var(--font-sans)' }}>
      {/* Toast */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, background: '#1C1917', color: '#FFFFFF', padding: '12px 20px', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.18)', fontSize: '13px' }}>
          {toastMessage}
        </div>
      )}

      {/* Top Breadcrumb Navigation */}
      <div className="wide-container" style={{ padding: '24px 20px 10px' }}>
        <button
          onClick={() => router.back()}
          style={{ background: 'transparent', border: 'none', color: '#66300F', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: 0 }}
        >
          <ArrowLeft size={16} />
          <span>Back to Collections</span>
        </button>
      </div>

      {/* Product Inner Container */}
      <div className="wide-container" style={{ padding: '20px 20px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
          
          {/* Left: Product Image */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1.15', background: '#FAF7EF', borderRadius: '12px', overflow: 'hidden', border: '1px solid #EFEAE0' }}>
            <img
              src={product.image}
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Right: Product Details */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--color-brown)', fontWeight: '700', marginBottom: '6px' }}>
              {product.brand || 'SMP LUXURY'}
            </div>

            <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontFamily: 'var(--font-serif)', fontWeight: '600', color: 'var(--color-dark-brown)', lineHeight: '1.25', marginBottom: '14px' }}>
              {product.title}
            </h1>

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '16px' }}>
              <span style={{ fontSize: '26px', fontWeight: '800', color: 'var(--color-dark-brown)' }}>
                AED {product.price}
              </span>
              <span style={{ fontSize: '12px', color: '#15803D', fontWeight: '700', background: '#DCFCE7', padding: '3px 10px', borderRadius: '4px' }}>
                In Stock - Free UAE Delivery
              </span>
            </div>

            {/* Product Color Spec */}
            {product.color && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0 16px 0' }}>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                  Color:
                </span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-dark-brown)', background: '#FAF7EF', border: '1px solid #E8E2D5', padding: '4px 12px', borderRadius: '4px' }}>
                  {product.color}
                </span>
              </div>
            )}

            {/* Optional Sizes Selector (e.g. Footwear) */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ margin: '6px 0 20px 0', background: '#FAF7EF', padding: '14px 16px', borderRadius: '8px', border: '1px solid #E8E2D5' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#66300F', fontWeight: '700' }}>
                    Available Sizes <span style={{ textTransform: 'none', fontWeight: 'normal', color: 'var(--color-text-muted)' }}>(Optional)</span>:
                  </span>
                  {selectedSize && (
                    <span style={{ fontSize: '12px', color: '#66300F', fontWeight: '700' }}>
                      Selected: {selectedSize}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                      style={{
                        minWidth: '44px',
                        height: '38px',
                        padding: '0 14px',
                        borderRadius: '6px',
                        border: selectedSize === sz ? '2px solid #66300F' : '1px solid #D8D0C3',
                        background: selectedSize === sz ? '#66300F' : '#FFFFFF',
                        color: selectedSize === sz ? '#FFFFFF' : '#332E29',
                        fontWeight: selectedSize === sz ? '700' : '500',
                        fontSize: '13px',
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

            {/* Description */}
            <p style={{ fontSize: '14.5px', color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '22px' }}>
              {product.description}
            </p>

            {/* Craftsmanship Highlights */}
            {product.details && product.details.length > 0 && (
              <div style={{ background: '#FAF7EF', padding: '16px 18px', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-dark-brown)', marginBottom: '10px' }}>
                  Craftsmanship &amp; Highlights:
                </h3>
                <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#4B230A', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {product.details.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Delivery & Inspection Guarantee */}
            <div style={{ display: 'flex', gap: '16px', padding: '14px 16px', background: 'rgba(193, 138, 91, 0.08)', borderRadius: '8px', border: '1px solid rgba(193, 138, 91, 0.22)', marginBottom: '26px' }}>
              <ShieldCheck size={20} color="#66300F" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '12.5px', color: '#4B230A', lineHeight: '1.5' }}>
                <strong>Inspect Before Payment:</strong> Zero upfront payment required. Our concierge courier brings this piece directly to your door to inspect and verify authenticity before paying.
              </div>
            </div>

            {/* Action Buttons: Add to Cart + BUY NOW */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddToCart}
                className="btn-modal-cart"
                style={{ padding: '14px 24px', fontSize: '13px' }}
                title="Add to Cart"
              >
                <ShoppingBag size={18} />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={() => setOrderModalOpen(true)}
                className="btn-buy-now-solid"
                style={{ flex: 1, minWidth: '180px', padding: '14px 24px', fontSize: '13px', fontWeight: '700' }}
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {orderModalOpen && (
        <div className="modal-overlay" onClick={() => !submittingOrder && setOrderModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-brown)', fontWeight: '700', textTransform: 'uppercase' }}>
                  Delivery Details
                </span>
                <h3 className="modal-title">Complete Your Order</h3>
              </div>
              <button onClick={() => setOrderModalOpen(false)} className="modal-close-btn" disabled={submittingOrder}>
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
                  <button onClick={() => setOrderModalOpen(false)} className="btn-buy-now" style={{ width: '100%' }}>
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirmAndContinueWhatsApp}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: '#FAF7EF', border: '1px solid #E8E2D2', borderRadius: '8px', marginBottom: '14px' }}>
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #C18A5B' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '10px', color: 'var(--color-brown)', fontWeight: '700', textTransform: 'uppercase' }}>
                        {product.brand}
                      </div>
                      <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-dark-brown)' }}>
                          AED {product.price}
                        </span>
                        {product.color && (
                          <span style={{ fontSize: '10.5px', color: '#66300F', background: '#F4EFE6', padding: '1px 6px', borderRadius: '3px', fontWeight: '600' }}>
                            Color: {product.color}
                          </span>
                        )}
                        {selectedSize && (
                          <span style={{ fontSize: '10.5px', color: '#1E40AF', background: '#EFF6FF', padding: '1px 6px', borderRadius: '3px', fontWeight: '600' }}>
                            Size: {selectedSize}
                          </span>
                        )}
                      </div>
                    </div>

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

                  <div className="form-field">
                    <label className="field-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Fatima Al Mansoori"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">WhatsApp Mobile Number *</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="e.g. +971 50 123 4567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Delivery Address *</label>
                    <textarea
                      rows={2}
                      className="form-input"
                      placeholder="Villa / Apartment, Street, Community"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Emirate *</label>
                    <select
                      className="form-input"
                      value={emirate}
                      onChange={(e) => setEmirate(e.target.value)}
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="Dubai">Dubai</option>
                      <option value="Abu Dhabi">Abu Dhabi</option>
                      <option value="Sharjah">Sharjah</option>
                      <option value="Ajman">Ajman</option>
                      <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                      <option value="Fujairah">Fujairah</option>
                      <option value="Umm Al Quwain">Umm Al Quwain</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn-buy-now-solid"
                    disabled={submittingOrder}
                    style={{ width: '100%', marginTop: '16px', padding: '14px', fontSize: '13.5px', fontWeight: '700' }}
                  >
                    {submittingOrder ? 'Connecting...' : 'CONFIRM & ORDER VIA WHATSAPP'}
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
