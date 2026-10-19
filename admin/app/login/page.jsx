'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { API_BASE } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: username.trim(), 
          password: password.trim() 
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid username or password');
      }

      // Store JWT Token & user details
      localStorage.setItem('smp_admin_token', data.token);
      localStorage.setItem('smp_admin_user', JSON.stringify(data.user));
      window.location.href = '/products';
    } catch (err) {
      setError(err.message || 'Login failed. Please check backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundImage: 'url(/hero-bg.webp), url(/hero-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      padding: '24px'
    }}>
      {/* Luxury Dark Backdrop Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(20, 10, 5, 0.72) 0%, rgba(12, 6, 3, 0.82) 100%)',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        zIndex: 1
      }} />

      {/* Login Box Container - Sharp Rectangular Luxury Design (0px Border Radius) */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '430px',
        width: '100%',
        background: '#FFFFFF',
        borderRadius: '0px',
        padding: '44px 36px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
        border: '1px solid #D8C8B8'
      }}>
        {/* Logo Only (Removed Background Box, Removed Titles & Subtitles) */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img 
            src="/smp-logo.png" 
            alt="Super Master Products" 
            style={{ 
              width: '115px', 
              height: 'auto', 
              display: 'block', 
              margin: '0 auto',
              filter: 'drop-shadow(0 2px 6px rgba(102, 48, 15, 0.15))' 
            }} 
          />
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #F87171',
            color: '#B91C1C',
            padding: '12px 14px',
            borderRadius: '0px',
            fontSize: '13px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>&bull;</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Username / Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '13px', 
              fontWeight: '600', 
              color: '#3D2514', 
              marginBottom: '8px' 
            }}>
              <User size={14} color="#66300F" />
              <span>Username</span>
            </label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="admin@smp.ae"
              required 
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '0px',
                border: '1px solid #D5C7B7',
                background: '#FAF8F5',
                fontSize: '14px',
                color: '#1C1917',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Password Field with Eye Icon */}
          <div style={{ marginBottom: '26px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '13px', 
              fontWeight: '600', 
              color: '#3D2514', 
              marginBottom: '8px' 
            }}>
              <Lock size={14} color="#66300F" />
              <span>Password</span>
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required 
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 14px',
                  borderRadius: '0px',
                  border: '1px solid #D5C7B7',
                  background: '#FAF8F5',
                  fontSize: '14px',
                  color: '#1C1917',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#8A7A6C',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Cream Login Button (0px Radius, text "Login") */}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '14px', 
              fontSize: '14px', 
              fontWeight: '700',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              borderRadius: '0px',
              background: '#FAF4EB',
              color: '#5C2B0D',
              border: '1px solid #C18A5B',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(102, 48, 15, 0.08)',
              transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#F0E5D4';
                e.currentTarget.style.borderColor = '#A45A28';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#FAF4EB';
                e.currentTarget.style.borderColor = '#C18A5B';
              }
            }}
          >
            {loading ? 'Logging in...' : (
              <>
                <span>Login</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
