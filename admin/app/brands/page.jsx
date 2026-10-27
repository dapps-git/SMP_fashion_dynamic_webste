'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import AdminModal from '../../components/AdminModal';
import { getAuthHeaders, API_BASE } from '../../lib/api';
import { Plus, Trash2, Sparkles, X, Image as ImageIcon, Upload } from 'lucide-react';

const INITIAL_FALLBACK_BRANDS = [
  { id: 'brand-1', name: 'Richard Mille', slug: 'richard-mille', logo: '/IMG_9307.PNG', description: 'Ultra-high-end luxury Swiss watches and horological innovation' },
  { id: 'brand-2', name: 'Bvlgari', slug: 'bvlgari', logo: '/IMG_9308.PNG', description: 'Iconic Italian luxury master jeweler and grand complication horology' },
  { id: 'brand-3', name: 'Omega', slug: 'omega', logo: '/IMG_9309.PNG', description: 'Prestigious Swiss precision timepieces and master chronometers' },
  { id: 'brand-4', name: 'Chopard', slug: 'chopard', logo: '/IMG_9310.PNG', description: 'Exquisite artisan Swiss luxury watches and high jewelry' },
  { id: 'brand-5', name: 'Chaumet Paris', slug: 'chaumet-paris', logo: '/IMG_9311.PNG', description: 'Place Vendôme Parisian royal jeweler and high-end watchmaker' },
  { id: 'brand-6', name: 'Graff', slug: 'graff', logo: '/IMG_9312.PNG', description: 'Unrivaled high-jewelry maison and diamond-set master horology' },
  { id: 'brand-7', name: 'SMP Luxury', slug: 'smp-luxury', logo: '/smp-logo.png', description: 'SMP Atelier flagship handcrafted footwear and fine leather' },
];

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: ''
  });

  useEffect(() => {
    fetchBrands();
    fetchProducts();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/brands`);
      if (res.ok) {
        const data = await res.json();
        setBrands(data && data.length > 0 ? data : INITIAL_FALLBACK_BRANDS);
      } else {
        setBrands(INITIAL_FALLBACK_BRANDS);
      }
    } catch (err) {
      console.error('Failed to load brands:', err);
      setBrands(INITIAL_FALLBACK_BRANDS);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load products for brand counting:', err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadForm = new FormData();
      uploadForm.append('image', file);

      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: getAuthHeaders(false),
        body: uploadForm
      });

      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, logo: data.url }));
      } else {
        alert('Failed to upload image to server');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/brands`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setModalOpen(false);
        setFormData({ name: '', description: '', logo: '' });
        fetchBrands();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create brand');
      }
    } catch (err) {
      console.error('Error creating brand:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this brand?')) return;
    try {
      const res = await fetch(`${API_BASE}/brands/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(false)
      });
      if (res.ok) {
        setBrands(brands.filter(b => b.id !== id && b._id !== id));
      }
    } catch (err) {
      console.error('Error deleting brand:', err);
    }
  };

  // Count items assigned to each brand
  const getBrandCount = (brandName) => {
    if (!brandName) return 0;
    const bLower = brandName.toLowerCase();
    return products.filter(p => (p.brand || '').toLowerCase() === bLower || (p.brand || '').toLowerCase().includes(bLower)).length;
  };

  return (
    <AdminLayout title="Brand Management">
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-main)' }}>
            Luxury Brands ({brands.length})
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Manage partner ateliers, logos, and assign products to particular brands
          </p>
        </div>

        <button onClick={() => setModalOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Add New Brand</span>
        </button>
      </div>

      {/* Brands Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {brands.map((brand) => {
          const count = getBrandCount(brand.name);
          return (
            <div 
              key={brand.id || brand._id} 
              className="card" 
              style={{ 
                padding: '0', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column',
                border: '1px solid #ECE6DC',
                background: '#FFFFFF'
              }}
            >
              {/* Brand Logo Container (Clean Transparent Look with multiply) */}
              <div style={{ 
                position: 'relative', 
                height: '130px', 
                width: '100%', 
                background: '#FAF7EF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '20px',
                borderBottom: '1px solid #ECE6DC'
              }}>
                {brand.logo ? (
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    style={{ 
                      maxHeight: '60px', 
                      maxWidth: '180px', 
                      objectFit: 'contain',
                      mixBlendMode: 'multiply'
                    }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A45A28', fontWeight: '700', fontSize: '18px', textTransform: 'uppercase' }}>
                    <Sparkles size={20} />
                    <span>{brand.name}</span>
                  </div>
                )}
                
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '12px',
                  background: 'rgba(102, 48, 15, 0.85)',
                  color: '#fff',
                  padding: '3px 9px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}>
                  {count} {count === 1 ? 'Product' : 'Products'}
                </div>
              </div>

              {/* Brand Information */}
              <div style={{ padding: '20px', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#66300F', marginBottom: '6px' }}>
                    {brand.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.45' }}>
                    {brand.description || 'Iconic luxury horology and fashion craftsmanship.'}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--color-border-subtle)' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#A45A28' }}>
                    Slug: {brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-')}
                  </span>
                  <button 
                    onClick={() => handleDelete(brand.id || brand._id)}
                    className="btn btn-danger"
                    style={{ padding: '6px 10px', fontSize: '12px' }}
                    title="Delete Brand"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Brand Modal (Rendered via Portal: Immune to Parent Clipping) */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Luxury Brand"
        maxWidth="640px"
      >
        <form onSubmit={handleCreate}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Brand Name *</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Richard Mille, Rolex, Audemars Piguet, Cartier"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Brand Logo Image</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="/IMG_9307.PNG or https://..."
                  style={{ flex: 1 }}
                />
                <label className="btn btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                  <Upload size={14} />
                  <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    style={{ display: 'none' }} 
                    disabled={uploading}
                  />
                </label>
              </div>
              {formData.logo && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#FAF7EF', borderRadius: '6px', textAlign: 'center' }}>
                  <img 
                    src={formData.logo} 
                    alt="Logo preview" 
                    style={{ maxHeight: '40px', maxWidth: '120px', objectFit: 'contain', mixBlendMode: 'multiply' }} 
                  />
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Description</label>
              <textarea 
                rows={3}
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description of the brand atelier, origin, or specialty..."
              />
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
              {submitting ? 'Creating...' : 'Create Brand'}
            </button>
          </div>
        </form>
      </AdminModal>
    </AdminLayout>
  );
}
