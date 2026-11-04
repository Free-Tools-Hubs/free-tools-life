import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ToastContainer } from '../store/useToastStore';
import { CATEGORIES } from '../utils/indexabilityPolicy';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky-nav">
        <div className="app-container" style={{ padding: '0 2rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
            <Link to="/" className="logo">LifeHub</Link>

            {/* Desktop Nav */}
            <nav className="desktop-nav" aria-label="Primary Navigation" style={{ display: 'flex', alignItems: 'center' }}>
              <Link to="/">Home</Link>
              <Link to="/templates">Templates</Link>
              <Link to="/category/morning-routine">Morning Routines</Link>
              <Link to="/category/habit-building">Habit Building</Link>
              <Link to="/dashboard">My Dashboard</Link>
              <Link to="/about">About</Link>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-toggle"
              aria-label="Toggle navigation menu"
              onClick={toggleMenu}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', display: 'none' }}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="mobile-nav" style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)' }}>
            <Link to="/" onClick={toggleMenu}>Home</Link>
            <Link to="/templates" onClick={toggleMenu}>Templates</Link>
            <Link to="/category/morning-routine" onClick={toggleMenu}>Morning Routines</Link>
            <Link to="/category/habit-building" onClick={toggleMenu}>Habit Building</Link>
            <Link to="/dashboard" onClick={toggleMenu}>My Dashboard</Link>
            <Link to="/about" onClick={toggleMenu}>About</Link>
          </div>
        )}
      </header>

      <main style={{ flex: 1 }}>
        <div className="app-container">
          {children}
        </div>
      </main>

      <footer className="footer">
        <div className="app-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'left', marginBottom: '3rem' }}>
            <div>
              <Link to="/" className="logo" style={{ marginBottom: '1rem', display: 'block' }}>LifeHub</Link>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Your all-in-one platform for personal growth, daily routines, and habit tracking. 100% private and offline-first.
              </p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Template Categories</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {CATEGORIES.slice(0, 4).map(cat => (
                  <li key={cat.slug} style={{ marginBottom: '0.5rem' }}>
                    <Link to={`/category/${cat.slug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>More Categories</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {CATEGORIES.slice(4).map(cat => (
                  <li key={cat.slug} style={{ marginBottom: '0.5rem' }}>
                    <Link to={`/category/${cat.slug}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Resources & Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link to="/templates" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>All Templates Directory</Link>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>How LifeHub Works & FAQ</Link>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</Link>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
          <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} LifeHub. Built for privacy and sustainable personal growth.
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default Layout;
