import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { useTemplates } from '../hooks/useTemplates';

const Templates = () => {
  const { templates: lifeTemplates, loading, error } = useTemplates();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    if (!lifeTemplates) return ['All'];
    const cats = new Set(lifeTemplates.map(t => t.category));
    return ['All', ...Array.from(cats)].sort();
  }, [lifeTemplates]);

  const filteredTemplates = useMemo(() => {
    if (!lifeTemplates) return [];
    return lifeTemplates.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, lifeTemplates]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem' }}>
        <div className="loader" style={{ 
          width: '50px', 
          height: '50px', 
          border: '5px solid var(--glass)', 
          borderTopColor: 'var(--primary)', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1.5rem'
        }}></div>
        <p className="text-muted">Loading 12,000+ Life Templates...</p>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', margin: '4rem 0' }}>
         <h3>Error Loading Library</h3>
         <p>{error}</p>
         <button onClick={() => window.location.reload()} className="btn-primary" style={{ marginTop: '1rem' }}>Retry</button>
      </div>
    );
  }


  return (
    <div>
      <section style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1>Browse All Templates</h1>
        <p className="hero-description">Discover the perfect structure for your unique lifestyle. Over 1,100+ templates available.</p>
      </section>

      <div className="glass-card" style={{ marginBottom: '3rem', padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
            <input
              type="text"
              placeholder="Search templates (e.g. Morning, Student, Professional...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                background: 'var(--bg-dark)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Filter size={20} style={{ color: 'var(--text-muted)' }} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                background: 'var(--bg-dark)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid">
        {filteredTemplates.slice(0, 50).map((template) => (
          <Link to={`/${template.slug}`} key={template.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{
                  color: 'var(--primary)',
                  fontWeight: 'bold',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  background: 'rgba(99, 102, 241, 0.1)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '1rem'
                }}>
                  {template.category}
                </span>
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{template.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', flex: 1 }}>
                {template.description}
              </p>
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Use Template <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredTemplates.length > 50 && (
        <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
          Showing first 50 results. Refine your search to find exactly what you need.
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
          <p>No templates found matching your criteria.</p>
          <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginTop: '1rem', fontWeight: 'bold' }}>
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Templates;
