import { Link } from "react-router-dom";
import RetentionBanner from "../components/RetentionBanner";
import AdPlaceholder from "../components/AdPlaceholder";
import SEO, { JSONLD } from "../components/SEO";
import { useTemplates } from "../hooks/useTemplates";

const Home = () => {
  const { templates: lifeTemplates, loading } = useTemplates();
  const schemaData = {

    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "LifeHub",
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${window.location.origin}/templates?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div>
      <SEO 
        title="LifeHub - Your Daily Routine & Habit Planning Tool" 
        description="Transform your life with 1100+ free life-improvement templates. 100% private, offline-first habit trackers and goal planners."
      />
      <JSONLD data={schemaData} />
      <RetentionBanner />

      <section className="hero-section">
        <h1>Transform Your Life, One Simple Tool at a Time.</h1>
        <p className="hero-description">
          Free, offline-first habit trackers, daily planners, and morning routines. No accounts, no distractions, 100% private.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/templates" className="btn-primary">Explore All Templates</Link>
          <Link to="/dashboard" className="btn-primary" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>Open My Dashboard</Link>
        </div>
      </section>

      <AdPlaceholder type="leaderboard" />

      <section style={{ marginTop: '6rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>How LifeHub Works</h2>
        <div className="grid">
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
            <h3>1. Find Your Template</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Browse 1,100+ expert-curated routines for students, professionals, and parents.</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
            <h3>2. Customize Instantly</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Add or remove habits and goals to match your unique lifestyle in seconds.</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📈</div>
            <h3>3. Track Offline</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your data stays on your device. Track progress anywhere, even without internet.</p>
          </div>
        </div>
      </section>

      <section style={{ marginTop: '6rem' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Featured Life Templates</h2>
        <div className="grid">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="glass-card" style={{ height: '200px', opacity: 0.5, animation: 'pulse 1.5s infinite ease-in-out' }}>
                <div style={{ height: '1.5rem', background: 'var(--glass)', marginBottom: '1rem', width: '40%' }}></div>
                <div style={{ height: '1rem', background: 'var(--glass)', marginBottom: '0.5rem' }}></div>
                <div style={{ height: '1rem', background: 'var(--glass)', width: '80%' }}></div>
              </div>
            ))
          ) : (
            lifeTemplates.slice(0, 6).map((template) => (
              <Link to={`/${template.slug}`} key={template.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
                    {template.category}
                  </span>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>{template.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flex: 1 }}>
                    {template.description}
                  </p>
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {template.baseRoutines.slice(0, 3).map((item, idx) => (
                      <span key={idx} style={{ background: 'var(--glass)', border: '1px solid var(--border)', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.7rem' }}>
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
            View All {lifeTemplates ? lifeTemplates.length : '12,000'}+ Templates
          </Link>
        </div>
        <style>{`
          @keyframes pulse {
            0% { opacity: 0.3; }
            50% { opacity: 0.6; }
            100% { opacity: 0.3; }
          }
        `}</style>
      </section>


      <section style={{ marginTop: '8rem', marginBottom: '4rem' }} className="glass-card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ marginBottom: '1rem' }}>100% Private. <br /><span style={{ color: 'var(--primary)' }}>Zero Tracking.</span></h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              We believe your personal growth shouldn't be products for advertisers. LifeHub stores everything in your browser's LocalStorage. No databases, no accounts, no cookies.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--accent)' }}>✓</span> <span>No email required</span>
              </li>
              <li style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--accent)' }}>✓</span> <span>Works without internet</span>
              </li>
              <li style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--accent)' }}>✓</span> <span>Data exportable as JSON</span>
              </li>
            </ul>
          </div>
          <div style={{ background: 'var(--glass)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid var(--border)', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem' }}>Running Offline Mode</h3>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🚀</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Current Status: <strong>Safe & Synchronized Locally</strong>
            </p>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
