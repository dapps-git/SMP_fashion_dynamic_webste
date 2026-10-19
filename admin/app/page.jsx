'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '../components/AdminLayout';
import { getAuthHeaders } from '../lib/api';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Layers, 
  Clock, 
  ArrowUpRight, 
  Plus, 
  MessageSquare,
  TrendingUp,
  Truck,
  Eye,
  CheckCircle2
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/stats', {
        headers: getAuthHeaders(false)
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(true),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchStats();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <AdminLayout title="Dashboard Overview">
      {/* Top Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Total Revenue */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #66300F 0%, #A45A28 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Revenue
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1F1B18', marginTop: '2px' }}>
              AED {stats ? stats.totalRevenue.toLocaleString() : '0'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <TrendingUp size={12} /> Direct WhatsApp Sales
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: '#FAF0E6',
            color: '#A45A28',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #E8D3C0'
          }}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Orders
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1F1B18', marginTop: '2px' }}>
              {stats ? stats.totalOrders : '0'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              {stats?.pendingOrders || 0} Pending Confirmation
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: '#F1ECE0',
            color: '#66300F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #E8E2D2'
          }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Active Catalog
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1F1B18', marginTop: '2px' }}>
              {stats ? stats.totalProducts : '0'} Items
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Footwear, Watches &amp; Bags
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: '#F5F5F4',
            color: '#44403C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #E7E5E4'
          }}>
            <Layers size={24} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Collections
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1F1B18', marginTop: '2px' }}>
              {stats ? stats.totalCategories : '0'} Categories
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-accent)', marginTop: '4px' }}>
              Curated Essentials
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div style={{
        background: '#FAF7EF',
        border: '1px solid #E8E2D2',
        borderRadius: '14px',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#15803D' }}></div>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#66300F' }}>Quick Management:</span>
          <span style={{ fontSize: '13px', color: '#6B6258' }}>Manage inventory and customer WhatsApp inquiries</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/products" className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 14px' }}>
            <Plus size={15} />
            <span>Add New Product</span>
          </Link>
          <Link href="/categories" className="btn btn-secondary" style={{ fontSize: '13px', padding: '8px 14px' }}>
            <Layers size={15} />
            <span>Add Category</span>
          </Link>
          <Link href="/orders" className="btn btn-secondary" style={{ fontSize: '13px', padding: '8px 14px' }}>
            <ShoppingCart size={15} />
            <span>View All Orders</span>
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1F1B18' }}>Recent Customer Orders</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Latest customer purchases placed via WhatsApp checkout
            </p>
          </div>
          <Link href="/orders" style={{ fontSize: '13px', color: 'var(--color-accent)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Manage All ({stats?.totalOrders || 0})</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone &amp; WhatsApp</th>
                <th>Delivery Address</th>
                <th>Items Ordered</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((ord) => {
                  const firstItem = ord.items && ord.items[0];
                  const cleanPhone = ord.customerPhone ? ord.customerPhone.replace(/[^0-9]/g, '') : '';
                  return (
                    <tr key={ord.id}>
                      <td style={{ fontWeight: '600', color: 'var(--color-primary)' }}>
                        {ord.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{ord.customerName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px' }}>{ord.customerPhone}</span>
                          {cleanPhone && (
                            <a 
                              href={`https://wa.me/${cleanPhone}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              title="Chat on WhatsApp"
                              style={{ color: '#25D366' }}
                            >
                              <MessageSquare size={16} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td style={{ maxWidth: '240px' }}>
                        <div style={{ fontWeight: '500', fontSize: '13px' }}>{ord.emirate}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ord.deliveryAddress}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {firstItem?.image && (
                            <img 
                              src={firstItem.image} 
                              alt="" 
                              style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--color-border)' }} 
                            />
                          )}
                          <div>
                            <div style={{ fontWeight: '500', fontSize: '13px' }}>
                              {firstItem?.title || 'Luxury Product'}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                              Qty: {firstItem?.quantity || 1} &bull; AED {firstItem?.price || ord.totalPrice}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: '700', color: '#1F1B18' }}>
                        AED {ord.totalPrice}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                    No orders placed yet. Orders created via storefront WhatsApp checkout will show here immediately.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
