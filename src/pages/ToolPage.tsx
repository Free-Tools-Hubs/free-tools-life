import { Link, useNavigate, useParams } from 'react-router-dom';
import SEO, { JSONLD } from '../components/SEO';
import { useUserStore } from '../store/useUserStore';
import { useMemo, useState, useEffect } from 'react';
import { getDeterministicContent } from '../utils/deterministicVariationEngine';
import {
  BASE_URL,
  CATEGORY_BY_NAME,
  classifyTemplateRecord,
  parseTemplateTitle
} from '../utils/indexabilityPolicy';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Compass,
  Info,
  Layers,
  Lightbulb,
  Sliders,
  Trophy,
  Users
} from 'lucide-react';
import AdPlaceholder from '../components/AdPlaceholder';
import { useTemplates } from '../hooks/useTemplates';

const ToolPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addHabit, addGoal } = useUserStore();
  const { templates: lifeTemplates, loading } = useTemplates({ requiredSlug: slug });
  const [isImported, setIsImported] = useState(false);

  const template = useMemo(() => {
    if (!lifeTemplates || !slug) return null;
    return lifeTemplates.find(t => t.slug === slug) || null;
  }, [slug, lifeTemplates]);

  const classification = useMemo(() => {
    if (!template) return null;
    return classifyTemplateRecord(template);
  }, [template]);

  const content = useMemo(() => {
    if (!template) return null;
    return getDeterministicContent(template.slug, template);
  }, [template]);

  const combinedHabits = useMemo(() => {
    if (!template || !content) return [];
    const seen = new Set<string>();
    const list: string[] = [];
    for (const rec of content.domainRecommendedHabits) {
      if (!seen.has(rec.name)) {
        seen.add(rec.name);
        list.push(rec.name);
      }
    }
    for (const h of template.baseHabits) {
      if (!seen.has(h)) {
        seen.add(h);
        list.push(h);
      }
    }
    return list;
  }, [template, content]);

  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  useEffect(() => {
    setSelectedHabits(combinedHabits);
  }, [combinedHabits]);

  const relatedTemplates = useMemo(() => {
    if (!template || !lifeTemplates || !classification) return { sameCategory: [], sameAudience: [] };
    const { scenario, context } = classification.attributes;

    const tier1Pool = lifeTemplates.filter(
      t => t.slug !== template.slug && classifyTemplateRecord(t).tier === 'tier1'
    );

    const sameCategory = tier1Pool
      .filter(t => t.category === template.category)
      .sort((a, b) => {
        const aScen = parseTemplateTitle(a.title, a.category).scenario === scenario ? 0 : 1;
        const bScen = parseTemplateTitle(b.title, b.category).scenario === scenario ? 0 : 1;
        return aScen - bScen;
      })
      .slice(0, 6);

    const sameAudience = tier1Pool
      .filter(
        t =>
          t.category !== template.category &&
          parseTemplateTitle(t.title, t.category).context === context
      )
      .slice(0, 4);

    return { sameCategory, sameAudience };
  }, [template, lifeTemplates, classification]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem' }}>
        <div
          className="loader"
          style={{
            width: '50px',
            height: '50px',
            border: '5px solid var(--glass)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem'
          }}
        />
        <p className="text-muted">Loading Tool Template...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!template || !content || !classification) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem' }}>
        <SEO
          title="404 - Template Not Found"
          description="The requested life template could not be found."
          robots="noindex, nofollow"
        />
        <h1>Template Not Found</h1>
        <p style={{ margin: '1rem 0 2rem', color: 'var(--text-muted)' }}>
          The routine or habit template you requested does not exist or may have moved. Explore our category directories below.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/templates" className="btn-primary">Browse All Templates</Link>
          <Link to="/" className="btn-primary" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>Back to Home</Link>
        </div>
      </div>
    );
  }

  const categoryMeta = CATEGORY_BY_NAME[template.category];
  const categorySlug = categoryMeta ? categoryMeta.slug : 'habit-building';

  const toggleHabitSelection = (habitName: string) => {
    setSelectedHabits(prev =>
      prev.includes(habitName) ? prev.filter(h => h !== habitName) : [...prev, habitName]
    );
  };

  const handleImport = () => {
    const habitsToImport = selectedHabits.length > 0 ? selectedHabits : combinedHabits;
    habitsToImport.forEach((hName: string) => {
      addHabit({
        id: `h-${Math.random().toString(36).slice(2, 11)}`,
        name: hName,
        category: template.category,
        streak: 0,
        completedDates: []
      });
    });

    template.baseGoals.forEach((gTitle: string) => {
      addGoal({
        id: `g-${Math.random().toString(36).slice(2, 11)}`,
        title: gTitle,
        target: 7,
        current: 0,
        unit: 'days'
      });
    });

    setIsImported(true);
    setTimeout(() => navigate('/dashboard'), 1200);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: template.title,
    description: content.purposeSummary,
    url: classification.canonicalUrl,
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };

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
        name: template.category,
        item: `${BASE_URL}/category/${categorySlug}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: template.title,
        item: classification.canonicalUrl
      }
    ]
  };

  return (
    <div className="tool-page">
      <SEO
        title={template.title}
        description={`${template.description} Includes a structured 3-phase ${template.category.toLowerCase()} workflow, customizable habits, and offline streak tracking for ${content.context.toLowerCase()}.`}
        canonical={classification.canonicalUrl}
        robots={classification.robotsDirective}
      />
      <JSONLD data={softwareSchema} />
      <JSONLD data={breadcrumbSchema} />

      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link to="/templates" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Templates</Link>
        <span>/</span>
        <Link to={`/category/${categorySlug}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
          {template.category}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--text-main)' }}>{template.title}</span>
      </nav>

      {classification.canonicalSlug !== template.slug && (
        <div
          className="glass-card"
          style={{
            marginBottom: '2rem',
            padding: '1rem 1.5rem',
            borderLeft: '4px solid var(--primary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text-main)' }}>Persona Edition Notice:</strong> You are viewing the{' '}
            <strong>{content.persona}</strong> variation. All four execution styles are unified on our primary template page.
          </div>
          <Link
            to={`/${classification.canonicalSlug}`}
            style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            View Primary Unified Edition <ArrowRight size={16} />
          </Link>
        </div>
      )}

      <header className="hero-section" style={{ border: 'none', marginBottom: '3.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', padding: '0.3rem 0.9rem', background: 'var(--glass)', borderRadius: '2rem', border: '1px solid var(--border)', marginBottom: '1rem' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase' }}>
            {template.category} • {content.scenario} • {template.plannerFrameworks}
          </span>
        </div>
        <h1 style={{ marginTop: '0.5rem', fontSize: '2.75rem', maxWidth: '860px', margin: '0.5rem auto' }}>
          {template.title}
        </h1>
        <p className="hero-description" style={{ fontSize: '1.15rem', maxWidth: '780px', margin: '1rem auto 0', lineHeight: 1.7 }}>
          {content.purposeSummary}
        </p>

        <div style={{ marginTop: '2.25rem' }}>
          {isImported ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.1rem' }}>
              <CheckCircle size={24} /> {selectedHabits.length} Habits Added to Your Local Dashboard! Redirecting...
            </div>
          ) : (
            <button className="btn-primary" onClick={handleImport} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Import {selectedHabits.length} Selected Habits to My Tracker <ArrowRight size={20} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
            </button>
          )}
        </div>
      </header>

      <AdPlaceholder type="leaderboard" />

      {/* Purpose, Audience Fit & Framework Guide */}
      <section className="grid" style={{ marginBottom: '3.5rem', marginTop: '3.5rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Info className="text-primary" />
            <h2 style={{ margin: 0, fontSize: '1.35rem' }}>Template Purpose & Workflow Design</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '1rem' }}>
            {content.explanation}
          </p>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, margin: 0, fontSize: '0.95rem' }}>
            <strong>Scheduling Framework ({template.plannerFrameworks}):</strong> {content.frameworkGuide}
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Users style={{ color: 'var(--accent)' }} />
            <h2 style={{ margin: 0, fontSize: '1.35rem' }}>Intended Audience: {content.context}</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '1rem' }}>
            {content.audienceUseCase}
          </p>
          <div style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#fbbf24', fontWeight: 600, fontSize: '0.9rem' }}>
              <Lightbulb size={16} /> Key Adaptation for {content.context}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>
              {content.habitTip}
            </p>
          </div>
        </div>
      </section>

      {/* 3-Phase Routine Structure */}
      <section className="glass-card" style={{ marginBottom: '3.5rem', padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Clock className="text-primary" />
          <h2 style={{ margin: 0 }}>Structured {template.category} Sequence</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Follow this three-phase progression to execute your {content.scenario.toLowerCase()} plan without decision fatigue.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {content.routineSteps.map((step, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-dark)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>{step.phase}</span>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', background: 'var(--glass)', borderRadius: '1rem', color: 'var(--text-muted)' }}>
                  {step.timing}
                </span>
              </div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.98rem' }}>{step.action}</p>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.purpose}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Core Daily Routine Anchors:</span>
          {template.baseRoutines.map((routine, idx) => (
            <span
              key={idx}
              style={{
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid var(--border)',
                padding: '0.3rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.82rem',
                color: 'var(--text-main)'
              }}
            >
              {routine}
            </span>
          ))}
        </div>
      </section>

      {/* Detailed Habit Breakdown with Rationale & 2-Minute Minimum Baselines */}
      <section className="glass-card" style={{ marginBottom: '3.5rem', padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: '0 0 0.5rem 0' }}>
              <CheckCircle className="text-accent" size={22} /> Included Habits & Execution Guide
            </h2>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
              Each habit below includes its daily trigger cue, why it supports {content.scenario.toLowerCase()}, and a 2-minute minimum baseline for hectic days. Uncheck any habit you wish to exclude before importing.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {combinedHabits.map((habitName, idx) => {
            const detail = content.habitDetails[habitName] || {
              name: habitName,
              cue: `During your scheduled ${template.category.toLowerCase()} block`,
              rationale: `Supports daily consistency for ${content.scenario.toLowerCase()}.`,
              minimumViableVersion: `Complete a 2-minute starter version of "${habitName}".`
            };
            const isChecked = selectedHabits.includes(habitName);
            const isDomainCore = idx < content.domainRecommendedHabits.length;

            return (
              <div
                key={habitName}
                onClick={() => toggleHabitSelection(habitName)}
                style={{
                  background: isChecked ? 'var(--bg-dark)' : 'transparent',
                  border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      aria-label={`Select ${habitName}`}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                    <h3 style={{ margin: 0, fontSize: '1.08rem' }}>{habitName}</h3>
                  </div>
                  {isDomainCore && (
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '1rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent)' }}>
                      Core {content.scenario} Habit
                    </span>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', paddingLeft: '1.9rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>Trigger Cue:</strong> {detail.cue}
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>Why It Works:</strong> {detail.rationale}
                  </div>
                  <div>
                    <strong style={{ color: 'var(--accent)' }}>2-Min Minimum Baseline:</strong> {detail.minimumViableVersion}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Target Goals & Customization Advice */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
        <div className="glass-card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.35rem', marginBottom: '1rem' }}>
            <Trophy className="text-primary" size={20} /> Target Milestones & Checklists
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Importing this template also configures these 7-day consistency milestones in your Goal Dashboard:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
            {template.baseGoals.map((item, id) => (
              <li key={id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Trophy size={16} className="text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <strong>Review Cadence ({template.checklistTemplates.join(' → ')}):</strong> Score your daily habits each evening and calibrate weekly targets every 7 days.
          </div>
        </div>

        <div className="glass-card">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.35rem', marginBottom: '1rem' }}>
            <Sliders className="text-accent" size={20} /> Practical Customization Guide
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.85rem' }}>
            {content.customizationAdvice.map((advice, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{idx + 1}.</span>
                <span>{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Unified 4-Persona Execution Tracks */}
      <section className="glass-card" style={{ marginBottom: '3.5rem', padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <Layers className="text-primary" size={22} />
          <h2 style={{ margin: 0 }}>Adapt by Execution Style (Persona Tracks)</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.95rem' }}>
          Whether you prefer strict time-blocking or flexible modular windows, adjust this {content.scenario.toLowerCase()} template to match your current bandwidth:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
          {content.personaTracks.map(track => {
            const isCurrentPersona = track.persona === content.persona;
            return (
              <div
                key={track.persona}
                style={{
                  background: 'var(--bg-dark)',
                  border: `1px solid ${isCurrentPersona ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: '0.75rem',
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: isCurrentPersona ? 'var(--primary)' : 'var(--text-main)' }}>
                    {track.persona} Mode
                  </h3>
                  {isCurrentPersona && (
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', borderRadius: '1rem', fontWeight: 600 }}>
                      Active
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                  {track.summary}
                </p>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '0.6rem' }}>
                  <div><strong>Daily Rule:</strong> {track.dailyRule}</div>
                  <div style={{ marginTop: '0.35rem' }}><strong>Target:</strong> {track.weeklyTarget}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Related Templates & Internal Discovery */}
      {(relatedTemplates.sameCategory.length > 0 || relatedTemplates.sameAudience.length > 0) && (
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0 }}>
              <Compass className="text-primary" size={22} /> Related {template.category} & {content.context} Templates
            </h2>
            <Link to={`/category/${categorySlug}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              View All {template.category} Templates →
            </Link>
          </div>

          <div className="grid">
            {[...relatedTemplates.sameCategory.slice(0, 4), ...relatedTemplates.sameAudience.slice(0, 2)].map(rel => (
              <Link to={`/${rel.slug}`} key={rel.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.72rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    {rel.category}
                  </span>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{rel.title.replace(' (Type A)', '')}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', flex: 1, margin: '0 0 1rem 0' }}>
                    {rel.description}
                  </p>
                  <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    Explore Template <ArrowRight size={14} />
                  </span>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ToolPage;
