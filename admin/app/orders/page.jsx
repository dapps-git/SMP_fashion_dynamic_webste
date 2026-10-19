'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAuthHeaders } from '../../lib/api';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  MessageSquare, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck, 
  Package, 
  ExternalLink, 
  X,
  Phone,
  User,
  Trash2,
  Eye
} from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' 
        ? 'http://localhost:5000/api/orders' 
        : `http://localhost:5000/api/orders?status=${statusFilter}`;
      const res = await fetch(url, {
        headers: getAuthHeaders(false)
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(true),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const handleDelete = async (orderId) => {
    if (!confirm(`Are you sure you want to delete order ${orderId}?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(false)
      });
      if (res.ok) {
        setOrders(orders.filter(o => o.id !== orderId));
        if (selectedOrder?.id === orderId) setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.toLowerCase().includes(q) ||
      o.deliveryAddress.toLowerCase().includes(q) ||
      (o.emirate && o.emirate.toLowerCase().includes(q))
    );
  });

  return (
    <AdminLayout title="Customer Orders Management">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-main)' }}>
            Customer Orders ({filteredOrders.length})
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Orders received through WhatsApp checkout with customer shipping and item details
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`btn ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              {status === 'all' ? 'All Orders' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '20px', maxWidth: '420px', position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search by customer name, phone, order ID..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input" 
          style={{ paddingLeft: '38px' }}
        />
      </div>

      {/* Orders Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID &amp; Date</th>
                <th>Customer &amp; Phone</th>
                <th>Delivery Address</th>
                <th>Product Items &amp; Images</th>
                <th>Total Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((ord) => {
                  const items = ord.items || [];
                  const cleanPhone = ord.customerPhone ? ord.customerPhone.replace(/[^0-9]/g, '') : '';
                  
                  return (
                    <tr key={ord.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '14px' }}>
                          {ord.id}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                          <Clock size={12} />
                          {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: '#1F1B18' }}>
                          {ord.customerName}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                            {ord.customerPhone}
                          </span>
                          {cleanPhone && (
                            <a 
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              title="Message buyer on WhatsApp"
                              style={{ 
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                background: '#DCFCE7', 
                                color: '#15803D', 
                                padding: '2px 7px', 
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: '600'
                              }}
                            >
                              <MessageSquare size={12} />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Shipping Address */}
                      <td style={{ maxWidth: '280px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <MapPin size={15} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '13px', color: '#1F1B18' }}>
                              {ord.emirate || 'UAE'}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.3' }}>
                              {ord.deliveryAddress}
                            </div>
                            {ord.notes && (
                              <div style={{ fontSize: '11px', color: 'var(--color-accent)', fontStyle: 'italic', marginTop: '2px' }}>
                                Note: {ord.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Product items with images */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {items.length > 0 ? (
                            items.map((item, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {item.image ? (
                                  <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    style={{
                                      width: '42px',
                                      height: '42px',
                                      objectFit: 'cover',
                                      borderRadius: '6px',
                                      border: '1px solid var(--color-border)',
                                      backgroundColor: '#FEFCF1'
                                    }} 
                                  />
                                ) : (
                                  <div style={{ width: '42px', height: '42px', background: '#F1ECE0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Package size={18} color="var(--color-text-muted)" />
                                  </div>
                                )}
                                <div>
                                  <div style={{ fontWeight: '600', fontSize: '13px', color: '#1F1B18' }}>
                                    {item.title}
                                  </div>
                                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                                    Qty: <strong style={{ color: '#66300F' }}>{item.quantity || 1}</strong> &bull; AED {item.price} each
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>No items detail</span>
                          )}
                        </div>
                      </td>

                      {/* Total Price */}
                      <td>
                        <div style={{ fontWeight: '700', fontSize: '15px', color: '#66300F' }}>
                          AED {ord.totalPrice}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: '500' }}>
                          Inspect Before Payment
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td>
                        <select 
                          value={ord.status} 
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          className="form-select"
                          style={{
                            padding: '6px 10px',
                            fontSize: '12px',
                            fontWeight: '600',
                            borderColor: ord.status === 'Confirmed' ? '#93C5FD' : (ord.status === 'Delivered' ? '#86EFAC' : '#E8E2D2'),
                            background: ord.status === 'Delivered' ? '#F0FDF4' : (ord.status === 'Confirmed' ? '#EFF6FF' : '#FFFDF7')
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <button 
                            onClick={() => setSelectedOrder(ord)}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 10px', fontSize: '12px' }}
                            title="View Full Order Summary"
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(ord.id)} 
                            className="btn btn-danger" 
                            style={{ padding: '6px 10px', fontSize: '12px' }}
                            title="Delete Order"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                    {loading ? 'Loading customer orders...' : 'No orders found matching the filter.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#66300F' }}>
                  Order Details: {selectedOrder.id}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Customer Box */}
              <div style={{ background: '#FAF7EF', border: '1px solid #E8E2D2', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#66300F', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={16} />
                  <span>Customer &amp; Delivery Information</span>
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Customer Name</span>
                    <strong style={{ color: '#1F1B18' }}>{selectedOrder.customerName}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Phone / WhatsApp</span>
                    <strong style={{ color: '#1F1B18' }}>{selectedOrder.customerPhone}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Emirate / City</span>
                    <strong style={{ color: '#1F1B18' }}>{selectedOrder.emirate}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Payment Mode</span>
                    <strong style={{ color: 'var(--color-success)' }}>{selectedOrder.paymentMethod}</strong>
                  </div>
                </div>

                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #E8E2D2', fontSize: '13px' }}>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Full Address</span>
                  <div style={{ color: '#1F1B18', marginTop: '2px' }}>{selectedOrder.deliveryAddress}</div>
                  {selectedOrder.notes && (
                    <div style={{ color: '#A45A28', fontSize: '12px', marginTop: '4px', fontStyle: 'italic' }}>
                      Instructions: {selectedOrder.notes}
                    </div>
                  )}
                </div>

                {/* Direct WhatsApp button */}
                <div style={{ marginTop: '14px' }}>
                  <a 
                    href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedOrder.customerName)},%20thank%20you%20for%20your%20order%20(${selectedOrder.id})%20at%20SMP%20Atelier!%20We%20are%20preparing%20your%20delivery.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{ background: '#25D366', color: '#fff', width: '100%', fontSize: '13px', padding: '9px' }}
                  >
                    <MessageSquare size={16} />
                    <span>Open WhatsApp Chat with Buyer</span>
                  </a>
                </div>
              </div>

              {/* Items List */}
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1F1B18', marginBottom: '12px' }}>
                Items in this Order
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#FFFFFF', border: '1px solid #E8E2D2', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #C18A5B' }} 
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: '#1F1B18' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                          Unit Price: AED {item.price} &bull; Quantity: {item.quantity || 1}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: '#66300F' }}>
                      AED {(item.price || 0) * (item.quantity || 1)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div style={{ background: '#FEFCF1', border: '1px solid #C18A5B', borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#66300F' }}>
                  Grand Total (Cash/Card on Delivery)
                </span>
                <span style={{ fontSize: '20px', fontWeight: '800', color: '#66300F' }}>
                  AED {selectedOrder.totalPrice}
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
