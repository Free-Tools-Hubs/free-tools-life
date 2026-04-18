import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { buildDailyPlan } from '../utils/plannerUtils';

const DailyPlanner: React.FC = () => {
  const { habits, goals } = useUserStore();
  const schedule = buildDailyPlan(goals, habits);

  return (
    <div className="daily-planner-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Daily Schedule</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <Calendar size={18} />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {schedule.map((item, idx) => (
          <div 
            key={idx} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '1rem 1.5rem', 
              borderBottom: idx === schedule.length - 1 ? 'none' : '1px solid var(--border)',
              background: idx % 2 === 0 ? 'var(--glass)' : 'transparent'
            }}
          >
            <div style={{ width: '80px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>
              <Clock size={16} />
              {item.time}
            </div>
            
            <div style={{ flex: 1, padding: '0 1rem' }}>
              <span style={{ fontWeight: 500 }}>{item.task}</span>
              <span 
                style={{ 
                  marginLeft: '1rem', 
                  fontSize: '0.75rem', 
                  padding: '0.1rem 0.4rem', 
                  borderRadius: '4px', 
                  background: 'var(--bg-dark)',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase'
                }}
              >
                {item.category}
              </span>
            </div>

            <button style={{ background: 'none', border: 'none', color: 'var(--border)', cursor: 'pointer' }}>
               <CheckCircle size={20} />
            </button>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>
           Tips: Time blocking your habits increases consistency by 2x.
        </p>
      </div>
    </div>
  );
};

export default DailyPlanner;
