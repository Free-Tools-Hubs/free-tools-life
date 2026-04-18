const Terms = () => {
  return (
    <div className="glass-card" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h1>Terms of Service</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Last updated: {new Date().toLocaleDateString()}</p>

      <section style={{ marginBottom: '2rem' }}>
        <h2>1. Acceptance of Terms</h2>
        <p>By using LifeHub, you agree to these terms. If you do not agree, please do not use the application.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>2. Use of License</h2>
        <p>
          LifeHub provides these tools for personal use. You may not attempt to decompile or reverse engineer any software
          contained on the site for commercial gain without explicit permission.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>3. Disclaimer</h2>
        <p>
          The materials on LifeHub are provided on an 'as is' basis. LifeHub makes no warranties, expressed or implied,
          and hereby disclaims and negates all other warranties including, without limitation, implied warranties or
          conditions of merchantability, or fitness for a particular purpose.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>4. Data Responsibility</h2>
        <p>
          You are solely responsible for the data you enter. Since data is stored locally, LifeHub is not responsible
          for any data loss due to browser clearing, device failure, or software bugs.
        </p>
      </section>
    </div>
  );
};

export default Terms;
