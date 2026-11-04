import SEO from '../components/SEO';
import { BASE_URL } from '../utils/indexabilityPolicy';

const Terms = () => {
  return (
    <div className="glass-card" style={{ maxWidth: '800px', margin: '2rem auto', padding: '2.5rem' }}>
      <SEO
        title="Terms of Service"
        description="Terms of Service for using LifeHub's offline-first habit trackers, daily planners, and routine templates."
        canonical={`${BASE_URL}/terms`}
        robots="noindex, follow"
      />
      <h1>Terms of Service</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Effective Date: April 17, 2026</p>

      <section style={{ marginBottom: '2rem' }}>
        <h2>1. Acceptance of Terms</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
          By accessing and using LifeHub (<code>https://life.freetoolshubs.com</code>), you agree to these Terms of Service. If you do not agree with these terms, please discontinue use of the site.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>2. Personal Use & Educational Scope</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
          LifeHub provides general productivity, habit-tracking, and routine-planning templates for informational and personal organization purposes only. Content on LifeHub does not constitute medical, psychological, financial, or professional advice.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>3. Disclaimer of Warranties</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
          The tools and templates on LifeHub are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including implied warranties of merchantability or fitness for a particular purpose.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>4. Local Data Responsibility</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
          Because LifeHub stores your tracker state locally inside your browser rather than on remote servers, you are solely responsible for maintaining your browser storage and device backups. LifeHub is not liable for data loss caused by clearing browser cache, private browsing modes, or device failure.
        </p>
      </section>
    </div>
  );
};

export default Terms;
