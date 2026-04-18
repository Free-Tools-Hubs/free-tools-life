import React, { useState } from 'react';
import { Plus, Trash2, Target, CheckCircle2, TrendingUp } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

const GoalDashboard: React.FC = () => {
  const { goals, addGoal, updateGoal, removeGoal } = useUserStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: 100,
    unit: '%',
    category: 'Productivity'
  });

  const categories = ['Productivity', 'Health', 'Finance', 'Learning', 'Personal', 'Work'];

  const handleAddGoal = () => {
    if (!newGoal.title) return;
    addGoal({
      id: Math.random().toString(36).substr(2, 9),
      title: newGoal.title,
      target: newGoal.target,
      current: 0,
      unit: newGoal.unit,
      // @ts-ignore - adding category support
      category: newGoal.category
    });
    setNewGoal({ title: '', target: 100, unit: '%', category: 'Productivity' });
    setIsAdding(false);
  };

  return (
    <div className="goal-dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <Target className="text-primary" /> Active Goals
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Track your long-term progress and key milestones.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setIsAdding(true)}
          style={{ padding: '0.6rem 1.2rem' }}
        >
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> New Goal
        </button>
      </div>

      {isAdding && (
        <div className="glass-card" style={{ marginBottom: '2.5rem', border: '1px solid var(--primary)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--primary)' }} />
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Create New Ambition
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Goal Title</label>
              <input
                className="form-input"
                placeholder="e.g. Run a Marathon"
                value={newGoal.title}
                onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Target Value</label>
              <input
                className="form-input"
                type="number"
                placeholder="42.2"
                value={newGoal.target}
                onChange={e => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Unit</label>
              <input
                className="form-input"
                placeholder="km, $, pages..."
                value={newGoal.unit}
                onChange={e => setNewGoal({ ...newGoal, unit: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Category</label>
              <select
                className="form-input"
                value={newGoal.category}
                onChange={e => setNewGoal({ ...newGoal, category: e.target.value })}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" onClick={handleAddGoal} style={{ flex: 1 }}>Create Goal</button>
            <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', flex: 1 }} onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="grid">
        {goals.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ background: 'var(--glass)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <TrendingUp size={32} className="text-muted" />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>No active goals</h3>
            <p className="text-muted" style={{ maxWidth: '300px', margin: '0 auto' }}>Setting clear targets is the first step toward significant results.</p>
          </div>
        ) : (
          [...goals].reverse().map(goal => {
            const percentage = Math.min(100, Math.max(0, (goal.current / goal.target) * 100));
            const isCompleted = percentage >= 100;

            return (
              <div key={goal.id} className="glass-card" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 'bold' }}>
                      {/* @ts-ignore */}
                      {goal.category || 'Personal'}
                    </span>
                    <h3 style={{ margin: '0.25rem 0', fontSize: '1.25rem', color: isCompleted ? 'var(--accent)' : 'inherit' }}>
                      {goal.title}
                    </h3>
                  </div>
                  <button onClick={() => removeGoal(goal.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}>
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ margin: '1.5rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                    <span className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {isCompleted ? <CheckCircle2 size={16} className="text-accent" /> : <TrendingUp size={16} />}
                      {isCompleted ? 'Completed' : 'Current Progress'}
                    </span>
                    <span style={{ fontWeight: '500' }}>{goal.current} / {goal.target} <small style={{ color: 'var(--text-muted)' }}>{goal.unit}</small></span>
                  </div>
                  <div style={{ height: '10px', background: 'var(--bg-dark)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: isCompleted
                          ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                          : 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)',
                        borderRadius: '10px',
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isCompleted ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    className="btn-primary"
                    style={{ flex: 2, padding: '0.6rem', fontSize: '0.9rem' }}
                    onClick={() => updateGoal(goal.id, 1)}
                  >
                    + Progress
                  </button>
                  <button
                    className="btn-primary"
                    style={{ flex: 1, padding: '0.6rem', background: 'rgba(255,255,255,0.05)', fontSize: '0.9rem' }}
                    onClick={() => updateGoal(goal.id, 10)}
                  >
                    +10
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .form-input {
          width: 100%;
          background: var(--bg-dark);
          border: 1px solid var(--border);
          color: white;
          padding: 0.75rem;
          border-radius: 0.5rem;
          outline: none;
          transition: border-color 0.3s ease;
          appearance: none;
        }
        .form-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
        .text-accent { color: var(--accent); }
        .text-primary { color: var(--primary); }
      `}</style>
    </div>
  );
};

export default GoalDashboard;
