import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
      <h1 style={{ fontSize: '6rem', margin: 0, background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</h1>
      <h2 style={{ marginBottom: '2rem' }}>Oops! This page has wandered off.</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }}>
        The content you're looking for might have been moved, deleted, or never existed in this timeline.
      </p>
      <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <Home size={20} /> Back to Safety
      </Link>
    </div>
  );
};

export default NotFound;
