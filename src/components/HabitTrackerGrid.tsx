import React from 'react';
import { CheckCircle2, Circle, Flame, XCircle } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { calculateStreak } from '../utils/streakEngine';

const HabitTrackerGrid: React.FC = () => {
  const { habits, toggleHabit, removeHabit, addHabit } = useUserStore();
  const [isAddingCustom, setIsAddingCustom] = React.useState(false);
  const [customHabitName, setCustomHabitName] = React.useState('');
  const today = new Date().toISOString().split('T')[0];

  const handleMarkAllDone = () => {
    habits.forEach(h => {
      if (!h.completedDates.includes(today)) {
        toggleHabit(h.id, today);
      }
    });
  };

  const handleAddCustomHabit = () => {
    if (!customHabitName) return;
    addHabit({
      id: `h-${Math.random().toString(36).substr(2, 9)}`,
      name: customHabitName,
      category: 'Custom',
      streak: 0,
      completedDates: []
    });
    setCustomHabitName('');
    setIsAddingCustom(false);
  };

  return (
    <div className="habit-grid-container">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Daily Consistency</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Small actions every day lead to massive results.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.85rem' }} onClick={handleMarkAllDone}>
            Mark All Done
          </button>
          <button className="btn-primary" style={{ fontSize: '0.85rem' }} onClick={() => setIsAddingCustom(true)}>
            + Add Custom
          </button>
        </div>
      </div>

      {isAddingCustom && (
        <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid var(--primary)' }}>
          <h3 style={{ marginBottom: '1rem' }}>New Custom Habit</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              className="form-input"
              placeholder="What do you want to track?"
              value={customHabitName}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--bg-dark)', border: '1px solid var(--border)', color: 'white' }}
              onChange={e => setCustomHabitName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCustomHabit()}
            />
            <button className="btn-primary" onClick={handleAddCustomHabit}>Add</button>
            <button className="btn-primary" style={{ background: 'none' }} onClick={() => setIsAddingCustom(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="grid">
        {habits.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <p className="text-muted">No habits added yet. Start by adding one above or from the templates!</p>
          </div>
        ) : (
          habits.map((habit) => {
            const isCompletedToday = habit.completedDates.includes(today);
            const { current } = calculateStreak(habit.completedDates);

            return (
              <div key={habit.id} className="glass-card habit-card" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => removeHabit(habit.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0.5 }}
                    title="Remove"
                  >
                    <XCircle size={18} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>
                      {habit.category}
                    </span>
                    <h3 style={{ marginTop: '0.25rem', fontSize: '1.25rem' }}>{habit.name}</h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: current > 0 ? '#fbbf24' : 'var(--text-muted)', background: 'rgba(251, 191, 36, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>
                    <Flame size={18} fill={current > 0 ? '#fbbf24' : 'none'} />
                    <span style={{ fontWeight: 'bold', marginLeft: '0.25rem', fontSize: '0.9rem' }}>{current}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
                  <button
                    onClick={() => toggleHabit(habit.id, today)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: isCompletedToday ? 'var(--accent)' : 'var(--text-muted)',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      filter: isCompletedToday ? 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.3))' : 'none'
                    }}
                    className="complete-btn"
                  >
                    {isCompletedToday ? <CheckCircle2 size={80} /> : <Circle size={80} strokeWidth={1.5} />}
                  </button>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: isCompletedToday ? 'var(--accent)' : 'var(--text-muted)' }}>
                    {isCompletedToday ? "Well done! Check back tomorrow." : "Mark as complete"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>


      <style>{`
        .habit-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .habit-card:hover {
            border-color: var(--primary);
            transform: translateY(-4px);
        }
        .complete-btn:hover {
            transform: scale(1.1);
        }
        .complete-btn:active {
            transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default HabitTrackerGrid;
