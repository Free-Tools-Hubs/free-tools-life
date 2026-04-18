import React from 'react';
import { useUserStore } from '../store/useUserStore';
import { calculateStreak } from '../utils/streakEngine';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';

const RetentionBanner: React.FC = () => {
  const { habits } = useUserStore();
  
  if (habits.length === 0) return null;

  const totalStreaks = habits.reduce((acc, h) => {
    const { current } = calculateStreak(h.completedDates);
    return acc + current;
  }, 0);

  const today = new Date().toISOString().split('T')[0];
  const pendingHabits = habits.filter(h => !h.completedDates.includes(today)).length;

  if (pendingHabits === 0) {
    return (
      <div className="glass-card retention-banner" style={{ background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)', color: 'white', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ margin: 0 }}>All habits completed! 🌟</h3>
          <p style={{ margin: '0.25rem 0 0', opacity: 0.9 }}>You're crushing it today. Ready to plan tomorrow?</p>
        </div>
        <Link to="/dashboard" className="banner-link">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card retention-banner" style={{ background: 'linear-gradient(90deg, var(--primary) 0%, #818cf8 100%)', color: 'white', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Clock size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0 }}>Finish your daily checklist ({pendingHabits} items left)</h3>
          <p style={{ margin: '0.25rem 0 0', opacity: 0.9 }}>Your {totalStreaks}-day total streak is alive — continue today?</p>
        </div>
      </div>
      <Link to="/dashboard" className="banner-link">
        Continue Track <ArrowRight size={18} />
      </Link>
    </div>
  );
};


export default RetentionBanner;
