import SEO from '../components/SEO';
import { BASE_URL } from '../utils/indexabilityPolicy';

const Privacy = () => {
  return (
    <div className="glass-card" style={{ maxWidth: '800px', margin: '2rem auto', padding: '2.5rem' }}>
      <SEO
        title="Privacy Policy"
        description="LifeHub Privacy Policy: Learn how your habit and goal data remains stored locally on your device in LocalStorage and IndexedDB."
        canonical={`${BASE_URL}/privacy`}
        robots="noindex, follow"
      />
      <h1>Privacy Policy</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Effective Date: April 17, 2026</p>

      <section style={{ marginBottom: '2rem' }}>
        <h2>1. Local-First Data Autonomy</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
          LifeHub is engineered as a local-first web application. We do not store your personal habit checklists, streak logs, or goals on any remote database. Everything you enter into your tracker remains within your browser’s local storage systems (LocalStorage and IndexedDB).
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>2. Cookies, Analytics, and Local Storage</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
          We use LocalStorage and IndexedDB strictly to persist your application state on your own device. We use aggregate traffic analytics (Google Analytics) to understand overall page visits and performance metrics without accessing your private habit tracker entries.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>3. Third-Party Services</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
          We may display sponsorships or advertisements from third-party networks. While those networks may receive standard HTTP request headers (such as IP address and browser user-agent) to deliver content, LifeHub never transmits your internal habit or goal data to third parties.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>4. Data Deletion</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
          To delete all of your stored habit and goal data at any time, clear your browser’s site data for <code>life.freetoolshubs.com</code> or remove individual habits and goals inside your dashboard. Because we do not maintain user accounts or server backups, cleared local data is permanently removed.
        </p>
      </section>
    </div>
  );
};

export default Privacy;
