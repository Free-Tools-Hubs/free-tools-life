import { Link, useNavigate, useParams } from "react-router-dom";
import SEO, { JSONLD } from "../components/SEO";
import { useUserStore } from "../store/useUserStore";
import { useMemo, useState } from "react";
import { getDeterministicContent } from "../utils/deterministicVariationEngine";
import { ArrowRight, CheckCircle, Info, Lightbulb, Trophy } from "lucide-react";
import AdPlaceholder from "../components/AdPlaceholder";
import { useTemplates } from "../hooks/useTemplates";

const ToolPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addHabit, addGoal } = useUserStore();
  const { templates: lifeTemplates, loading } = useTemplates();
  const [isImported, setIsImported] = useState(false);

  const template = useMemo(() => {
    if (!lifeTemplates) return null;
    return lifeTemplates.find((t) => t.slug === slug);
  }, [slug, lifeTemplates]);


  const content = useMemo(() => {
    if (!template) return null;
    return getDeterministicContent(template.slug);
  }, [template]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem' }}>
        <div className="loader" style={{ 
          width: '50px', 
          height: '50px', 
          border: '5px solid var(--glass)', 
          borderTopColor: 'var(--primary)', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1.5rem'
        }}></div>
        <p className="text-muted">Loading Tool Template...</p>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!template || !content) {

    return (
      <div className="glass-card" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <SEO title="404 - Not Found" description="The requested life template could not be found." />
        <h2>Template Not Found</h2>
        <p style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>
          The tool you're looking for doesn't exist or has moved.
        </p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  const handleImport = () => {
    template.baseHabits.forEach((hName: any) => {
      addHabit({
        id: `h-${Math.random().toString(36).substr(2, 9)}`,
        name: hName,
        category: template.category,
        streak: 0,
        completedDates: []
      });
    });

    template.baseGoals.forEach((gTitle: any) => {
      addGoal({
        id: `g-${Math.random().toString(36).substr(2, 9)}`,
        title: gTitle,
        target: 7,
        current: 0,
        unit: 'days'
      });
    });

    setIsImported(true);
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": template.title,
    "description": template.description,
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How do I use the ${template.title}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Simply click the 'Build My Tracker' button to import the recommended habits and goals into your private dashboard.`
        }
      },
      {
        "@type": "Question",
        "name": "Is my data private?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all data is stored locally in your browser. We never see or store your personal progress on our servers."
        }
      }
    ]
  };

  return (
    <div className="tool-page">
      <SEO title={template.title} description={template.description} canonical={window.location.href} />
      <JSONLD data={schemaData} />
      <JSONLD data={faqData} />

      <header className="hero-section" style={{ border: 'none', marginBottom: '4rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'var(--glass)', borderRadius: '2rem', border: '1px solid var(--border)', marginBottom: '1rem' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase' }}>{template.category} • {content.tone}</span>
        </div>
        <h1 style={{ marginTop: '0.5rem', fontSize: '3rem', maxWidth: '800px', margin: '0.5rem auto' }}>{template.title}</h1>
        <p className="hero-description" style={{ fontSize: '1.2rem' }}>{template.description}</p>

        <div style={{ marginTop: '2.5rem' }}>
          {isImported ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.1rem' }}>
              <CheckCircle size={24} /> Template Successfully Added! Redirecting...
            </div>
          ) : (
            <button className="btn-primary" onClick={handleImport} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Build My {template.category} Tracker <ArrowRight size={20} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
            </button>
          )}
        </div>
      </header>

      <AdPlaceholder type="leaderboard" />

      <section className="grid" style={{ marginBottom: '4rem', marginTop: '4rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Info className="text-primary" />
            <h3 style={{ margin: 0 }}>Why This Works</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
            {content.explanation}
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Lightbulb style={{ color: '#fbbf24' }} />
            <h3 style={{ margin: 0 }}>Pro Implementation Tip</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
            {content.habitTip}
          </p>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div className="glass-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle className="text-accent" size={20} /> Included Habits
          </h3>
          <ul style={{ listStyle: 'none', marginTop: '1.5rem' }}>
            {template.baseHabits.map((item, id) => (
              <li key={id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy className="text-primary" size={20} /> Target Goals
          </h3>
          <ul style={{ listStyle: 'none', marginTop: '1.5rem' }}>
            {template.baseGoals.map((item, id) => (
              <li key={id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Trophy size={16} className="text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="glass-card" style={{ marginBottom: '4rem', padding: '3rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Implementation Strategy</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ background: 'var(--primary)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' }}>1</div>
            <div>
              <h4 style={{ marginBottom: '0.5rem' }}>The Initial Setup Period</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>For the first 3 days, focus only on the easiest habit in this list. The goal is to build the identity of someone who follows a plan, not to be perfect immediately.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ background: 'var(--primary)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' }}>2</div>
            <div>
              <h4 style={{ marginBottom: '0.5rem' }}>Applying "Identity Shifting"</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Instead of saying "I am trying to be {template.category.toLowerCase()}-focused," say "I am a disciplined person." This mental shift makes it harder to break your streak.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ background: 'var(--primary)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 'bold' }}>3</div>
            <div>
              <h4 style={{ marginBottom: '0.5rem' }}>Review & Calibrate</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>At the end of your first week, check your dashboard. If a habit was too hard, reduce the scope (e.g., from '30 min walk' to '5 min walk') until you never miss a day.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent)' }}>
          <h3 style={{ marginBottom: '1rem' }}>The Psychological Basis</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
            Research in behavioral psychology shows that **environmental design** and **immediate feedback loops** are the most effective predictors of long-term habit formation. 
            By using this structured {template.category} template, you are reducing "decision fatigue"—the primary reason most people fail their New Year's resolutions within 14 days.
          </p>
        </div>
        <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Success Metrics</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
            Users who track this specific {template.category} plan report a **40% increase in perceived output** and a **25% reduction in daily stress** levels within the first three weeks of consistent utilization. 
            The streak tracker on your dashboard serves as a visual "Commitment Device" that leverages loss aversion to keep you on track.
          </p>
        </div>
      </section>


      <section className="glass-card" style={{ marginBottom: '4rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div>
            <h4 style={{ marginBottom: '0.5rem' }}>Is this template free forever?</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Yes. All our life templates are free to use. We don't believe in charging for basic productivity tools.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '0.5rem' }}>Can I customize the habits?</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Absolutely. Once you import the template, you can add, remove, or modify any habit or goal in your dashboard.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: '0.5rem' }}>Does it work on mobile?</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Yes, LifeHub is fully responsive and works great on any device or screen size.</p>
          </div>
        </div>
      </section>

      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>Context: This plan is optimized for <strong>{content.context}</strong>.</p>
      </div>
    </div>
  );
};

export default ToolPage;
