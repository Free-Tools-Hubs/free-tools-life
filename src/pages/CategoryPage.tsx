import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle, Compass, Layers } from 'lucide-react';
import SEO, { JSONLD } from '../components/SEO';
import {
  BASE_URL,
  CATEGORIES,
  CATEGORY_BY_SLUG,
  classifyTemplateRecord,
  parseTemplateTitle
} from '../utils/indexabilityPolicy';
import { useTemplates } from '../hooks/useTemplates';
import NotFound from './NotFound';

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const categoryMeta = categorySlug ? CATEGORY_BY_SLUG[categorySlug] : undefined;
  const { templates, loading } = useTemplates();

  const tier1Templates = useMemo(() => {
    if (!categoryMeta || !templates) return [];
    return templates.filter(t => {
      if (t.category !== categoryMeta.name) return false;
      return classifyTemplateRecord(t).tier === 'tier1';
    });
  }, [categoryMeta, templates]);

  const groupedByScenario = useMemo(() => {
    const groups = new Map<string, typeof tier1Templates>();
    for (const t of tier1Templates) {
      const { scenario } = parseTemplateTitle(t.title, t.category);
      const list = groups.get(scenario) || [];
      list.push(t);
      groups.set(scenario, list);
    }
    return Array.from(groups.entries());
  }, [tier1Templates]);

  if (!categoryMeta) {
    return <NotFound />;
  }

  const canonicalUrl = `${BASE_URL}/category/${categoryMeta.slug}`;

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
        item: `${BASE_URL}/templates`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryMeta.name,
        item: canonicalUrl
      }
    ]
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryMeta.headline,
    description: categoryMeta.metaDescription,
    url: canonicalUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: 'LifeHub',
      url: `${BASE_URL}/`
    }
  };

  return (
    <div className="category-hub-page">
      <SEO
        title={`${categoryMeta.shortTitle} Templates & Habit Trackers`}
        description={categoryMeta.metaDescription}
        canonical={canonicalUrl}
        robots="index, follow"
      />
      <JSONLD data={breadcrumbSchema} />
      <JSONLD data={collectionSchema} />

      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <Link to="/templates" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Templates</Link>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{categoryMeta.name}</span>
      </nav>

      <header className="glass-card" style={{ marginBottom: '3rem', padding: '2.5rem' }}>
        <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(99, 102, 241, 0.12)', borderRadius: '2rem', border: '1px solid var(--border)', marginBottom: '1rem' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase' }}>
            {categoryMeta.name} Directory • {tier1Templates.length} Curated Templates
          </span>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{categoryMeta.headline}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: '820px', marginBottom: '2rem' }}>
          {categoryMeta.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div style={{ background: 'var(--bg-dark)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Primary Objective</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>{categoryMeta.coreFocus}</p>
          </div>
          <div style={{ background: 'var(--bg-dark)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>Recommended Timing</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>{categoryMeta.recommendedTimeWindow}</p>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Core {categoryMeta.name} Principles</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
            {categoryMeta.keyPrinciples.map((principle, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                <CheckCircle size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '0.2rem' }} />
                <span>{principle}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Compass size={20} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Browse Other Template Categories</h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {CATEGORIES.map(cat => {
            const isActive = cat.slug === categoryMeta.slug;
            return (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  background: isActive ? 'var(--primary)' : 'var(--bg-card)',
                  color: isActive ? 'white' : 'var(--text-main)',
                  border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`
                }}
              >
                {cat.shortTitle}
              </Link>
            );
          })}
        </div>
      </section>

      {loading ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <p className="text-muted">Loading {categoryMeta.name} templates...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {groupedByScenario.map(([scenario, items]) => (
            <section key={scenario}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <Layers size={20} style={{ color: 'var(--primary)' }} />
                <h2 style={{ fontSize: '1.4rem', margin: 0 }}>
                  {scenario} — {categoryMeta.name} Templates ({items.length})
                </h2>
              </div>
              <div className="grid">
                {items.map(template => {
                  const { context } = parseTemplateTitle(template.title, template.category);
                  return (
                    <Link
                      to={`/${template.slug}`}
                      key={template.id}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <article className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.5rem' }}>
                          <span style={{
                            color: 'var(--primary)',
                            fontWeight: 'bold',
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            background: 'rgba(99, 102, 241, 0.1)',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '1rem'
                          }}>
                            For {context}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {template.plannerFrameworks}
                          </span>
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem' }}>{template.title.replace(' (Type A)', '')}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', flex: 1, marginBottom: '1rem' }}>
                          {template.description}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                          {template.baseHabits.slice(0, 3).map((habit, hIdx) => (
                            <span
                              key={hIdx}
                              style={{
                                fontSize: '0.72rem',
                                padding: '0.15rem 0.5rem',
                                background: 'var(--glass)',
                                border: '1px solid var(--border)',
                                borderRadius: '0.5rem',
                                color: 'var(--text-muted)'
                              }}
                            >
                              ✓ {habit}
                            </span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                          <span style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.88rem' }}>
                            Open Template <ArrowRight size={15} />
                          </span>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;

