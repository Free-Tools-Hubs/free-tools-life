const About = () => {
  return (
    <div className="glass-card" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h1>About LifeHub</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
        LifeHub is a 100% client-side, privacy-focused platform designed to help you organize your life without being tracked.
      </p>

      <h2 style={{ marginTop: '2.5rem', marginBottom: '1rem' }}>Our Mission</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        We believe that personal growth tools should be accessible to everyone without the cost of their privacy.
        Most productivity apps require accounts, sync your data to the cloud, and track your every move.
        LifeHub is different.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
        <div className="glass-card" style={{ background: 'var(--glass)', padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>No Accounts</h3>
          <p style={{ fontSize: '0.9rem' }}>We don't ask for your email, password, or any personal info. You just start using the tools.</p>
        </div>
        <div className="glass-card" style={{ background: 'var(--glass)', padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>100% Private</h3>
          <p style={{ fontSize: '0.9rem' }}>Your data never leaves your device. It's stored in your browser's LocalStorage and IndexedDB.</p>
        </div>
        <div className="glass-card" style={{ background: 'var(--glass)', padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Offline First</h3>
          <p style={{ fontSize: '0.9rem' }}>LifeHub works perfectly without an internet connection once the site is loaded.</p>
        </div>
        <div className="glass-card" style={{ background: 'var(--glass)', padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Open Source</h3>
          <p style={{ fontSize: '0.9rem' }}>Transparency is key. Our code is open for anyone to inspect and contribute to.</p>
        </div>
      </div>

      <h2 style={{ marginTop: '3rem', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>Where is my data stored?</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your data is stored locally in your browser. If you clear your browser data, your progress will be lost unless you've exported it.</p>
        </div>
        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>How do you make money?</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>We use non-intrusive display ads to cover hosting costs. We do not use personalized tracking ads that compromise your privacy.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
