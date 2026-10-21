'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  ExternalLink, 
  LogOut, 
  User,
  Menu,
  X,
  Bell,
  Sparkles
} from 'lucide-react';
import { API_BASE } from '../lib/api';

export default function AdminLayout({ children, title = 'Dashboard' }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('smp_admin_token') : null;
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('smp_admin_user') : null;

    if (!token) {
      if (pathname !== '/login') {
        router.replace('/login');
      }
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser({ name: 'SMP Admin', email: 'admin@smp.ae' });
      }
    }

    // Token present, grant layout view
    setAuthorized(true);

    // Verify token with backend
    if (pathname !== '/login') {
      fetch(`${API_BASE}/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) {
          localStorage.removeItem('smp_admin_token');
          localStorage.removeItem('smp_admin_user');
          setAuthorized(false);
          router.replace('/login');
        }
      })
      .catch(() => {});
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('smp_admin_token');
    localStorage.removeItem('smp_admin_user');
    setAuthorized(false);
    router.replace('/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Products', href: '/products', icon: Package },
    { label: 'Categories', href: '/categories', icon: Layers },
    { label: 'Brands', href: '/brands', icon: Sparkles },
    { label: 'Orders', href: '/orders', icon: ShoppingCart },
  ];

  // Prevent flash: If not mounted or not authorized on protected pages, never render dashboard UI
  if (!mounted || (!authorized && pathname !== '/login')) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#FAF8F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#66300F',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <img 
            src="/smp-logo.png" 
            alt="SMP" 
            style={{ width: '80px', margin: '0 auto 16px', display: 'block', opacity: 0.8 }} 
          />
          <div style={{ fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.6, fontWeight: '600' }}>
            Authenticating Session...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <img 
            src="/smp-logo.png" 
            alt="SMP Logo" 
            style={{ width: '42px', height: '42px', objectFit: 'contain', background: '#fff', borderRadius: '8px', padding: '2px' }} 
          />
          <div className="brand-text">
            <h2>SMP ATELIER</h2>
            <p>Super Master Products</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div style={{ fontSize: '11px', color: 'var(--color-sidebar-muted)', padding: '0 8px 8px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Store Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div style={{ margin: '16px 0 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}></div>
          <div style={{ fontSize: '11px', color: 'var(--color-sidebar-muted)', padding: '8px 8px 8px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Customer Store
          </div>
          <a 
            href="http://localhost:3002" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="nav-link"
            style={{ color: 'var(--color-accent-light)' }}
          >
            <ExternalLink size={18} />
            <span>View Storefront</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="admin-avatar">
                {user?.name ? user.name[0] : 'A'}
              </div>
              <div className="admin-info">
                <h4>{user?.name || 'SMP Admin'}</h4>
                <p>Store Manager</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              title="Sign Out"
              style={{ background: 'transparent', border: 'none', color: 'var(--color-sidebar-muted)', cursor: 'pointer', padding: '6px' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="main-wrapper">
        <header className="top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-text-main)' }}>{title}</h1>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Overview &bull; {new Date().toLocaleDateString('en-AE', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <a 
              href="http://localhost:3000" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary"
              style={{ fontSize: '13px', padding: '8px 14px' }}
            >
              <ExternalLink size={15} />
              <span>Live Website</span>
            </a>
            <div style={{ width: '1px', height: '24px', background: 'var(--color-border)' }}></div>
            <button 
              onClick={handleLogout} 
              className="btn btn-secondary" 
              style={{ fontSize: '13px', padding: '8px 14px', color: 'var(--color-danger)' }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <main className="page-container fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
