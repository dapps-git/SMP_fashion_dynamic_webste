'use client';

import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { authFetch, getAuthHeaders, getAuthToken, API_BASE } from '../../lib/api';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  Upload, 
  X, 
  Check, 
  Package,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    category: 'bags',
    gender: '', // 'men', 'women', 'unisex'
    brand: 'SMP Luxury',
    price: '',
    stock: '15',
    description: '',
    details: '',
    imageUrl: '',
    imageFile: null,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    slug: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'all' 
        ? `${API_BASE}/products` 
        : `${API_BASE}/products?category=${selectedCategory}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      category: categories[0]?.slug || 'bags',
      gender: '',
      brand: 'SMP Luxury',
      price: '',
      stock: '15',
      description: '',
      details: '100% Genuine Materials\nMaster Craftsmanship\nFree Express UAE Delivery',
      imageUrl: '',
      imageFile: null,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      slug: ''
    });
    setImagePreview('');
    setModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      title: prod.title,
      category: prod.category,
      gender: prod.gender || '',
      brand: prod.brand || 'SMP Luxury',
      price: prod.price.toString(),
      stock: prod.stock ? prod.stock.toString() : '10',
      description: prod.description || '',
      details: Array.isArray(prod.details) ? prod.details.join('\n') : '',
      imageUrl: prod.image || '',
      imageFile: null,
      seoTitle: prod.seoTitle || `${prod.title} | Luxury SMP Fashion UAE`,
      seoDescription: prod.seoDescription || prod.description || '',
      seoKeywords: prod.seoKeywords || '',
      slug: prod.slug || prod.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    });
    setImagePreview(prod.image || '');
    setModalOpen(true);
  };

  const autoGenerateSeo = () => {
    if (!formData.title) return;
    const titleClean = formData.title.trim();
    const brandClean = formData.brand.trim() || 'SMP';
    const autoTitle = `${titleClean} | ${brandClean} UAE Luxury`;
    const autoDesc = formData.description 
      ? formData.description.slice(0, 155) 
      : `Buy authentic ${titleClean} by ${brandClean}. 100% Genuine luxury master piece with free UAE delivery & inspect-before-payment.`;
    const autoSlug = titleClean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const autoKeywords = `${titleClean}, ${brandClean}, luxury fashion UAE, buy ${brandClean} Dubai, order via WhatsApp`;

    setFormData(prev => ({
      ...prev,
      seoTitle: autoTitle,
      seoDescription: autoDesc,
      slug: autoSlug,
      seoKeywords: autoKeywords
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append('title', formData.title);
      formPayload.append('category', formData.category);
      formPayload.append('gender', formData.gender || '');
      formPayload.append('brand', formData.brand);
      formPayload.append('price', formData.price);
      formPayload.append('stock', formData.stock);
      formPayload.append('description', formData.description);
      formPayload.append('details', formData.details);
      formPayload.append('seoTitle', formData.seoTitle);
      formPayload.append('seoDescription', formData.seoDescription);
      formPayload.append('seoKeywords', formData.seoKeywords);
      formPayload.append('slug', formData.slug);
      
      if (formData.imageFile) {
        formPayload.append('imageFile', formData.imageFile);
      } else if (formData.imageUrl) {
        formPayload.append('imageUrl', formData.imageUrl);
      }

      const url = editingProduct 
        ? `${API_BASE}/products/${editingProduct.id}`
        : `${API_BASE}/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const token = getAuthToken();
      if (!token) {
        alert('Access token required. Redirecting to Login...');
        window.location.href = '/login';
        return;
      }

      const res = await authFetch(url, {
        method,
        body: formPayload
      });

      if (res.ok) {
        setModalOpen(false);
        fetchProducts();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to save product');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error saving product. Please check backend.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await authFetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'all' && p.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (selectedCategory === 'watches' && selectedGender !== 'all') {
      const pGender = (p.gender || '').toLowerCase();
      const text = `${p.title} ${p.description}`.toLowerCase();
      if (selectedGender === 'men') {
        const isMen = pGender === 'men' || pGender === 'unisex' || (!pGender && (text.includes('men') || text.includes('chrono') || text.includes('steel') || text.includes('onyx') || text.includes('male')));
        if (!isMen) return false;
      } else if (selectedGender === 'women') {
        const isWomen = pGender === 'women' || pGender === 'unisex' || (!pGender && (text.includes('women') || text.includes('rose gold') || text.includes('skeleton') || text.includes('pearl') || text.includes('crystal') || text.includes('female')));
        if (!isWomen) return false;
      } else if (selectedGender === 'unisex') {
        if (pGender !== 'unisex') return false;
      }
    }
    if (!search) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q));
  });

  return (
    <AdminLayout title="Product Management">
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-main)' }}>
            Catalog Items ({filteredProducts.length})
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Add, update pricing, stock, and high-resolution images
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by title, brand..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input" 
            style={{ paddingLeft: '38px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--color-text-muted)" />
          <select 
            value={selectedCategory} 
            onChange={(e) => { setSelectedCategory(e.target.value); setSelectedGender('all'); }}
            className="form-select"
            style={{ width: 'auto' }}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>

          {selectedCategory === 'watches' && (
            <select 
              value={selectedGender} 
              onChange={(e) => setSelectedGender(e.target.value)}
              className="form-select"
              style={{ width: 'auto', background: '#F8F4EC', borderColor: '#C8B29B', color: '#66300F', fontWeight: '600' }}
            >
              <option value="all">All Watches</option>
              <option value="men">Men&apos;s Watches</option>
              <option value="women">Women&apos;s Watches</option>
              <option value="unisex">Unisex Watches</option>
            </select>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price (AED)</th>
                <th>Stock</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img 
                          src={p.image} 
                          alt={p.title} 
                          style={{
                            width: '48px',
                            height: '48px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid var(--color-border)',
                            backgroundColor: '#FEFCF1'
                          }} 
                        />
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: '600', textTransform: 'uppercase' }}>
                            {p.brand || 'SMP'}
                          </div>
                          <div style={{ fontWeight: '600', fontSize: '14px', color: '#1F1B18' }}>
                            {p.title}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                            ID: {p.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ 
                          textTransform: 'capitalize', 
                          padding: '4px 8px', 
                          background: '#FAF7EF', 
                          border: '1px solid #E8E2D2',
                          borderRadius: '6px', 
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {p.category}
                        </span>
                        {p.gender && (
                          <span style={{
                            padding: '2px 7px',
                            background: p.gender === 'men' ? '#EFF6FF' : p.gender === 'women' ? '#FDF2F8' : '#F3F4F6',
                            color: p.gender === 'men' ? '#1D4ED8' : p.gender === 'women' ? '#BE185D' : '#374151',
                            border: `1px solid ${p.gender === 'men' ? '#BFDBFE' : p.gender === 'women' ? '#FBCFE8' : '#E5E7EB'}`,
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {p.gender}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: '700', fontSize: '14px', color: '#66300F' }}>
                      AED {p.price}
                    </td>
                    <td>
                      <span style={{
                        color: p.stock > 5 ? 'var(--color-success)' : 'var(--color-warning)',
                        fontWeight: '600',
                        fontSize: '13px'
                      }}>
                        {p.stock} units
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <button 
                          onClick={() => openEditModal(p)} 
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                          title="Edit Product"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)} 
                          className="btn btn-danger"
                          style={{ padding: '6px 10px', fontSize: '12px' }}
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                    {loading ? 'Loading catalog products...' : 'No products found. Click "Add New Product" to add your first item.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#66300F' }}>
                {editingProduct ? 'Edit Fashion Product' : 'Add New Fashion Product'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Title & Brand */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Product Title *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.title} 
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Burgundy Leather Top Handle Bag"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Brand / Atelier</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.brand} 
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="SMP Luxury" 
                    />
                  </div>
                </div>

                {/* Category, Gender, Pricing & Stock */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select 
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Gender {formData.category === 'watches' && <span style={{ color: '#A45A28', fontWeight: '700' }}>*</span>}
                    </label>
                    <select 
                      className="form-select"
                      value={formData.gender || ''}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      style={formData.category === 'watches' ? { borderColor: '#A45A28', background: '#FFFDF9' } : {}}
                    >
                      <option value="">Unspecified</option>
                      <option value="men">Men&apos;s</option>
                      <option value="women">Women&apos;s</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (AED) *</label>
                    <input 
                      type="number" 
                      step="any"
                      className="form-input" 
                      value={formData.price} 
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="490"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock Quantity</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={formData.stock} 
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="15" 
                    />
                  </div>
                </div>

                {/* Image Section */}
                <div className="form-group">
                  <label className="form-label">Product Image (Upload File or Enter Image URL)</label>
                  
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-secondary"
                      style={{ fontSize: '13px' }}
                    >
                      <Upload size={15} />
                      <span>Upload from Device</span>
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                    />
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>or paste direct link below:</span>
                  </div>

                  <input 
                    type="url" 
                    className="form-input" 
                    value={formData.imageUrl} 
                    onChange={(e) => {
                      setFormData({ ...formData, imageUrl: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/photo-..." 
                  />

                  {/* Image Preview Box */}
                  {imagePreview && (
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#FAF7EF', borderRadius: '8px', border: '1px solid #E8E2D2' }}>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #C18A5B' }} 
                      />
                      <div style={{ fontSize: '12px', color: '#66300F' }}>
                        <div style={{ fontWeight: '600' }}>Image Selected</div>
                        <div style={{ color: 'var(--color-text-muted)' }}>Will be displayed in high-resolution across store &amp; WhatsApp preview</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea 
                    rows={3}
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the materials, craftsmanship, and silhouette..."
                  />
                </div>

                {/* Key Details / Bullet points */}
                <div className="form-group">
                  <label className="form-label">Highlights / Features (One per line)</label>
                  <textarea 
                    rows={3}
                    className="form-textarea"
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder="100% Genuine Italian Calfskin&#10;24K Gold electroplated lock&#10;Protective bottom metal studs"
                  />
                </div>

                {/* ─── DYNAMIC SEO FIELDS SECTION ─── */}
                <div style={{ marginTop: '20px', padding: '16px', background: '#F8F5EE', borderRadius: '12px', border: '1px solid #E2D9C8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#66300F', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>🌐 Dynamic SEO &amp; Google Search Meta</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#8C7D6B', marginTop: '2px' }}>
                        Customize search engine titles, descriptions, and keywords for top UAE Google rankings
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={autoGenerateSeo}
                      className="btn btn-secondary"
                      style={{ fontSize: '11px', padding: '6px 12px', background: '#FFFFFF', color: '#A45A28', border: '1px solid #C18A5B' }}
                      title="Generate SEO from Title & Description"
                    >
                      ✨ Auto-Generate SEO
                    </button>
                  </div>

                  {/* SEO Title & URL Slug */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <label className="form-label" style={{ fontSize: '11px' }}>SEO Meta Title</label>
                        <span style={{ fontSize: '10px', color: (formData.seoTitle?.length || 0) > 60 ? '#C0392B' : '#7F8C8D' }}>
                          {formData.seoTitle?.length || 0} / 60
                        </span>
                      </div>
                      <input 
                        type="text" 
                        className="form-input" 
                        style={{ fontSize: '12px', padding: '8px 10px' }}
                        value={formData.seoTitle} 
                        onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                        placeholder="e.g. Luxury Handcrafted Bags | SMP UAE" 
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '11px' }}>Product URL Slug</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        style={{ fontSize: '12px', padding: '8px 10px' }}
                        value={formData.slug} 
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="e.g. burgundy-leather-bag" 
                      />
                    </div>
                  </div>

                  {/* SEO Meta Description */}
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label className="form-label" style={{ fontSize: '11px' }}>SEO Meta Description</label>
                      <span style={{ fontSize: '10px', color: (formData.seoDescription?.length || 0) > 160 ? '#C0392B' : '#7F8C8D' }}>
                        {formData.seoDescription?.length || 0} / 160
                      </span>
                    </div>
                    <textarea 
                      rows={2}
                      className="form-textarea" 
                      style={{ fontSize: '12px', padding: '8px 10px' }}
                      value={formData.seoDescription} 
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      placeholder="Crafted luxury fashion in the UAE. Inspect before payment & free delivery..." 
                    />
                  </div>

                  {/* SEO Keywords */}
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>SEO Keywords (comma-separated)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ fontSize: '12px', padding: '8px 10px' }}
                      value={formData.seoKeywords} 
                      onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                      placeholder="e.g. luxury bags dubai, handcrafted leather, smp fashion uae" 
                    />
                  </div>

                  {/* Live Google Search Snippet Preview */}
                  <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E4DCCF' }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#9B9185', marginBottom: '6px', fontWeight: '600' }}>
                      Google Search Result Live Preview
                    </div>
                    <div style={{ fontSize: '11px', color: '#202124', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                      <span style={{ color: '#5f6368' }}>smpfashion.ae</span>
                      <span style={{ color: '#5f6368' }}>› products › {formData.slug || 'product'}</span>
                    </div>
                    <div style={{ fontSize: '15px', color: '#1a0dab', fontWeight: '500', lineHeight: 1.3, marginBottom: '3px', cursor: 'pointer' }}>
                      {formData.seoTitle || (formData.title ? `${formData.title} | SMP Luxury UAE` : 'SMP Super Master Products UAE')}
                    </div>
                    <div style={{ fontSize: '12px', color: '#4d5156', lineHeight: 1.4 }}>
                      {formData.seoDescription || (formData.description ? formData.description.slice(0, 150) + '...' : 'Discover luxury fashion pieces crafted with highest precision. Direct delivery with inspection before payment across UAE.')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)} 
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : (editingProduct ? 'Save Changes' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
