import React from 'react';
import HabitTrackerGrid from '../components/HabitTrackerGrid';
import DailyPlanner from '../components/DailyPlanner';
import GoalDashboard from '../components/GoalDashboard';
import SEO from '../components/SEO';
import { useUserStore } from '../store/useUserStore';
import { calculateStreak } from '../utils/streakEngine';
import AdPlaceholder from '../components/AdPlaceholder';
import { BASE_URL } from '../utils/indexabilityPolicy';

const Dashboard: React.FC = () => {
  const { habits, goals } = useUserStore();

  const totalStreaks = habits.reduce((acc, h) => {
    const { current } = calculateStreak(h.completedDates);
    return acc + current;
  }, 0);

  return (
    <div className="dashboard-page">
      <SEO
        title="My Personal Habit & Goal Dashboard"
        description="Track your daily habits, streaks, time-blocked schedule, and active milestone goals locally in your browser."
        canonical={`${BASE_URL}/dashboard`}
        robots="noindex, nofollow"
      />
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>Your Life Dashboard</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <div className="glass-card" style={{ padding: '0.75rem 1.5rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Active Habits</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{habits.length}</div>
          </div>
          <div className="glass-card" style={{ padding: '0.75rem 1.5rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Focus Goals</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{goals.length}</div>
          </div>
          <div className="glass-card" style={{ padding: '0.75rem 1.5rem', textAlign: 'center' }}>
            <div style={{ color: '#fbbf24', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total Streaks</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalStreaks}</div>
          </div>
        </div>
      </div>

      <AdPlaceholder type="leaderboard" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        <section>
          <HabitTrackerGrid />
        </section>

        <AdPlaceholder type="rectangle" />

        <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
          <DailyPlanner />
          <GoalDashboard />
        </section>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-page section {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
