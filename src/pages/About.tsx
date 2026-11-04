import { Link } from 'react-router-dom';
import SEO, { JSONLD } from '../components/SEO';
import { BASE_URL, CATEGORIES } from '../utils/indexabilityPolicy';

const About = () => {
  const canonicalUrl = `${BASE_URL}/about`;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Where is my habit and goal data stored?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Your data is stored locally in your browser using LocalStorage with an automated IndexedDB backup. No personal habit or goal progress is sent to a remote server.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do I customize a LifeHub template?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Open any template from our category directories, select or uncheck the specific habits you want to include, and click Import to add them to your personal dashboard where you can add custom habits and adjust goal targets.'
        }
      },
      {
        '@type': 'Question',
        name: 'Does LifeHub work offline?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Once loaded, LifeHub caches core application assets via a service worker and reads your tracker state directly from local browser storage.'
        }
      }
    ]
  };

  return (
    <div className="glass-card" style={{ maxWidth: '840px', margin: '2rem auto', padding: '2.5rem' }}>
      <SEO
        title="About LifeHub — Private, Offline-First Habit & Routine Tools"
        description="Learn how LifeHub helps you build sustainable habits, morning routines, and daily productivity systems with 100% local browser privacy and zero account tracking."
        canonical={canonicalUrl}
        robots="index, follow"
      />
      <JSONLD data={faqSchema} />

      <h1>About LifeHub</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: 1.7 }}>
        LifeHub is a client-side, privacy-first platform designed to help you structure your daily routines, build durable habits, and track milestone goals without creating an account or surrendering your personal data.
      </p>

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>Our Mission</h2>
      <p style={{ marginBottom: '1.5rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
        Most productivity applications require mandatory signups, lock basic habit tracking behind recurring subscriptions, and synchronize personal reflections to third-party servers. LifeHub takes a local-first approach: you can browse structured templates across eight core life domains, import habits with one click, and track your streaks entirely inside your own browser.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
        <div className="glass-card" style={{ background: 'var(--glass)', padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>No Accounts</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
            We never ask for your email, password, or profile details. Open any tool and begin tracking immediately.
          </p>
        </div>
        <div className="glass-card" style={{ background: 'var(--glass)', padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>100% Local Data</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
            Your habits and goals remain on your device inside LocalStorage and IndexedDB.
          </p>
        </div>
        <div className="glass-card" style={{ background: 'var(--glass)', padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Offline Ready</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
            LifeHub works reliably without an active internet connection once loaded in your browser.
          </p>
        </div>
        <div className="glass-card" style={{ background: 'var(--glass)', padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Structured Categories</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
            Every template combines cue-based habits, 2-minute minimum baselines, and clear implementation steps.
          </p>
        </div>
      </div>

      <h2 style={{ marginTop: '3rem', marginBottom: '1rem' }}>Explore Our Eight Template Categories</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2.5rem' }}>
        {CATEGORIES.map(cat => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '1.5rem',
              background: 'var(--bg-dark)',
              border: '1px solid var(--border)',
              color: 'var(--primary)',
              textDecoration: 'none',
              fontSize: '0.88rem',
              fontWeight: 600
            }}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <h2 id="faq" style={{ marginTop: '3rem', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>Where is my habit and goal data stored?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>
            Your data is stored locally in your browser using LocalStorage and backed up to IndexedDB. If you clear your browser’s site data for LifeHub, your local tracker state will be reset.
          </p>
        </div>
        <div>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>How do I customize a template?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>
            On any template page, you can check or uncheck individual habits before importing, then add custom habits or adjust goal targets directly inside your{' '}
            <Link to="/dashboard" style={{ color: 'var(--primary)' }}>Personal Dashboard</Link>.
          </p>
        </div>
        <div>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>How is LifeHub supported?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>
            LifeHub is free for all users and supported by non-intrusive display sponsorships. Your personal habit entries and goals are never shared with advertisers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
