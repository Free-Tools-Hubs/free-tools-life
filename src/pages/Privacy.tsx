const Privacy = () => {
  return (
    <div className="glass-card" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h1>Privacy Policy</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Last updated: {new Date().toLocaleDateString()}</p>

      <section style={{ marginBottom: '2rem' }}>
        <h2>1. Data Autonomy</h2>
        <p>
          LifeHub is designed as a "Zero-Data" application. We do not store your personal information, habit data, or goals on any remote server.
          Everything you input remains entirely within your browser's local storage systems (LocalStorage and IndexedDB).
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>2. Cookies and Tracking</h2>
        <p>
          We do not use tracking cookies. We may use local storage to remember your theme preference or app state, which remains on your device.
          We use simple, non-tracking analytics to understand basic site traffic without identifying individuals.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>3. Third-Party Services</h2>
        <p>
          We may display advertisements from third-party networks. These networks may collect basic technical information (like your IP address)
          to serve ads, but LifeHub does not share your internal app data with them.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>4. Data Deletion</h2>
        <p>
          To delete all your data, simply clear your browser's site data for LifeHub. Since we don't have a backend, once you clear your local storage,
          your data is gone forever and cannot be recovered by us.
        </p>
      </section>
    </div>
  );
};

export default Privacy;
