import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, Compass } from 'lucide-react';
import SEO, { JSONLD } from '../components/SEO';
import { useTemplates } from '../hooks/useTemplates';
import {
  BASE_URL,
  CATEGORIES,
  CATEGORY_BY_NAME,
  classifyTemplateRecord
} from '../utils/indexabilityPolicy';

const Templates = () => {
  const { templates: lifeTemplates, loading, error } = useTemplates();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const tier1Templates = useMemo(() => {
    if (!lifeTemplates) return [];
    return lifeTemplates.filter(t => classifyTemplateRecord(t).tier === 'tier1');
  }, [lifeTemplates]);

  const categories = useMemo(() => {
    return ['All', ...CATEGORIES.map(c => c.name)];
  }, []);

  const filteredTemplates = useMemo(() => {
    return tier1Templates.filter(t => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, tier1Templates]);

  const canonicalUrl = `${BASE_URL}/templates`;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'LifeHub Template Directory — Habit Trackers, Morning Routines & Daily Planners',
    description: 'Browse structured, offline-first templates for morning routines, habit building, daily productivity, goal setting, mindfulness, fitness, evening rituals, and career growth.',
    url: canonicalUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: 'LifeHub',
      url: `${BASE_URL}/`
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${BASE_URL}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Templates',
        item: canonicalUrl
      }
    ]
  };

  if (error) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', margin: '4rem 0' }}>
        <SEO
          title="Browse All Habit & Routine Templates"
          description="Explore structured, private habit trackers, morning routines, and daily planners across eight life categories."
          canonical={canonicalUrl}
          robots="index, follow"
        />
        <h3>Error Loading Library</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary" style={{ marginTop: '1rem' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <SEO
        title="Browse All Habit & Routine Templates"
        description="Explore structured, private habit trackers, morning routines, deep work planners, fitness schedules, and evening rituals across eight core categories."
        canonical={canonicalUrl}
        robots="index, follow"
      />
      <JSONLD data={collectionSchema} />
      <JSONLD data={breadcrumbSchema} />

      <section style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1>Browse Curated Life & Habit Templates</h1>
        <p className="hero-description">
          Explore structured, 100% offline-first templates organized across eight life domains. Select a category directory below to view every specialized workflow.
        </p>
      </section>

      {/* Crawlable Category Directories */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Compass size={22} style={{ color: 'var(--primary)' }} />
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Explore by Category Directory</h2>
        </div>
        <div className="grid">
          {CATEGORIES.map(cat => {
            const count = tier1Templates.filter(t => t.category === cat.name).length;
            return (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <article className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary)' }}>{cat.name}</h3>
                    {count > 0 && (
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(99, 102, 241, 0.12)', borderRadius: '1rem', fontWeight: 600 }}>
                        {count} Templates
                      </span>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', flex: 1, marginBottom: '1rem' }}>
                    {cat.description}
                  </p>
                  <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    Browse {cat.shortTitle} <ArrowRight size={15} />
                  </span>
                </article>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="glass-card" style={{ marginBottom: '2.5rem', padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
            <input
              type="text"
              aria-label="Search templates"
              placeholder="Filter curated templates (e.g. Deep Work, Sleep Quality, Entrepreneurs, Night Owls...)"
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
              aria-label="Filter by category"
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p className="text-muted">Loading Curated Templates...</p>
        </div>
      ) : (
        <>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.35rem' }}>
            {selectedCategory === 'All' ? 'Featured Curated Templates' : `${selectedCategory} Templates`} ({filteredTemplates.length})
          </h2>
          <div className="grid">
            {filteredTemplates.slice(0, 64).map((template) => {
              const catMeta = CATEGORY_BY_NAME[template.category];
              return (
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
                      {catMeta && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {template.plannerFrameworks}
                        </span>
                      )}
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem' }}>{template.title.replace(' (Type A)', '')}</h3>
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
              );
            })}
          </div>

          {filteredTemplates.length > 64 && (
            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
              <p>
                Showing 64 of {filteredTemplates.length} matching templates. Select a category directory above to view the complete list for any domain.
              </p>
            </div>
          )}

          {filteredTemplates.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <p>No templates found matching your search filter.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginTop: '1rem', fontWeight: 'bold' }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Templates;
