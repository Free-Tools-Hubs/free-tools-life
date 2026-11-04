import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import RetentionBanner from '../components/RetentionBanner';
import AdPlaceholder from '../components/AdPlaceholder';
import SEO, { JSONLD } from '../components/SEO';
import { useTemplates } from '../hooks/useTemplates';
import { BASE_URL, CATEGORIES, classifyTemplateRecord } from '../utils/indexabilityPolicy';

const Home = () => {
  const { templates: lifeTemplates, loading } = useTemplates();

  const featuredTemplates = useMemo(() => {
    if (!lifeTemplates) return [];
    const tier1 = lifeTemplates.filter(t => classifyTemplateRecord(t).tier === 'tier1');
    // Pick 1 representative from each of the 8 categories so homepage links into every topic cluster
    const byCat: typeof tier1 = [];
    const seenCats = new Set<string>();
    for (const t of tier1) {
      if (!seenCats.has(t.category)) {
        seenCats.add(t.category);
        byCat.push(t);
      }
    }
    return byCat.length >= 6 ? byCat : tier1.slice(0, 8);
  }, [lifeTemplates]);

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LifeHub',
    url: `${BASE_URL}/`,
    description: 'Free, 100% private and offline-first habit trackers, morning routine templates, daily productivity planners, and goal tracking tools.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/templates?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <div>
      <SEO
        title="LifeHub — Free Offline Habit Trackers, Morning Routines & Daily Planners"
        description="Build durable habits and structure your day with free, 100% private, offline-first templates for morning routines, deep work, fitness, mindfulness, and evening rituals."
        canonical={`${BASE_URL}/`}
        robots="index, follow"
      />
      <JSONLD data={schemaData} />
      <RetentionBanner />

      <section className="hero-section">
        <h1>Transform Your Life, One Simple Tool at a Time.</h1>
        <p className="hero-description">
          Free, offline-first habit trackers, daily planners, and morning routines. No accounts, no distractions, 100% private in your browser.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/templates" className="btn-primary">Explore All Templates</Link>
          <Link to="/dashboard" className="btn-primary" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>Open My Dashboard</Link>
        </div>
      </section>

      <AdPlaceholder type="leaderboard" />

      <section style={{ marginTop: '5rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2.5rem' }}>How LifeHub Works</h2>
        <div className="grid">
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
            <h3>1. Choose Your Template</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Browse structured routine and habit frameworks tailored for professionals, students, parents, athletes, and creators.
            </p>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
            <h3>2. Customize Instantly</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Select, add, or modify habits and milestone goals to match your daily schedule and energy windows in seconds.
            </p>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📈</div>
            <h3>3. Track 100% Offline</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Your progress stays in your device’s LocalStorage and IndexedDB. Track streaks anywhere, even without internet.
            </p>
          </div>
        </div>
      </section>

      {/* Crawlable Category Directories */}
      <section style={{ marginTop: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2>Browse Templates by Life Category</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0.5rem auto 0' }}>
            Every category directory organizes specialized workflows by goal and audience so you can jump straight to a template that fits your routine.
          </p>
        </div>
        <div className="grid">
          {CATEGORIES.map(cat => (
            <Link to={`/category/${cat.slug}`} key={cat.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--primary)' }}>{cat.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', flex: 1, marginBottom: '1.25rem' }}>
                  {cat.description}
                </p>
                <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  Explore {cat.shortTitle} <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginTop: '6rem' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Featured Life Templates</h2>
        <div className="grid">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="glass-card" style={{ height: '200px', opacity: 0.5 }}>
                <div style={{ height: '1.5rem', background: 'var(--glass)', marginBottom: '1rem', width: '40%' }} />
                <div style={{ height: '1rem', background: 'var(--glass)', marginBottom: '0.5rem' }} />
                <div style={{ height: '1rem', background: 'var(--glass)', width: '80%' }} />
              </div>
            ))
          ) : (
            featuredTemplates.map(template => (
              <Link to={`/${template.slug}`} key={template.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
                    {template.category}
                  </span>
                  <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.2rem' }}>{template.title.replace(' (Type A)', '')}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flex: 1 }}>
                    {template.description}
                  </p>
                  <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {template.baseRoutines.slice(0, 3).map((item, idx) => (
                      <span key={idx} style={{ background: 'var(--glass)', border: '1px solid var(--border)', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.72rem' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/templates" className="btn-primary" style={{ background: 'none', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
            Browse Complete Curated Template Directory
          </Link>
        </div>
      </section>

      <section style={{ marginTop: '6rem', marginBottom: '4rem' }} className="glass-card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ marginBottom: '1rem' }}>
              100% Private. <br />
              <span style={{ color: 'var(--primary)' }}>Zero Account Required.</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Your personal habits and goals belong to you. LifeHub stores your tracker state directly in your browser’s LocalStorage and IndexedDB—no account signups, no cloud databases.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--accent)' }}>✓</span> <span>No email or login required</span>
              </li>
              <li style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--accent)' }}>✓</span> <span>Works offline via local browser storage</span>
              </li>
              <li style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--accent)' }}>✓</span> <span>Customizable habits, daily schedule, and milestone goals</span>
              </li>
            </ul>
          </div>
          <div style={{ background: 'var(--glass)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--border)', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem' }}>Local-First Architecture</h3>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🚀</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Storage Mode: <strong>LocalStorage + IndexedDB Backup</strong>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
