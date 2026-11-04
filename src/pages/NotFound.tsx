import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import SEO from '../components/SEO';
import { CATEGORIES } from '../utils/indexabilityPolicy';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <SEO
        title="404 - Page Not Found"
        description="The page or template you requested could not be found on LifeHub."
        robots="noindex, nofollow"
      />
      <div
        style={{
          fontSize: '5rem',
          fontWeight: 800,
          margin: 0,
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        404
      </div>
      <h1 style={{ marginBottom: '1rem', fontSize: '2rem' }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '540px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
        The page or template you are looking for does not exist or may have moved. Use the links below to return home or explore our eight template directories.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Home size={18} /> Back to Homepage
        </Link>
        <Link
          to="/templates"
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <Compass size={18} /> Browse All Templates
        </Link>
      </div>

      <div className="glass-card" style={{ maxWidth: '720px', margin: '0 auto', padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Popular Template Categories</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '1.5rem',
                background: 'var(--bg-dark)',
                border: '1px solid var(--border)',
                color: 'var(--text-main)',
                textDecoration: 'none',
                fontSize: '0.85rem'
              }}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
