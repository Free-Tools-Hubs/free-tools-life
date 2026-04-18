import React from 'react';

interface AdProps {
  type: 'leaderboard' | 'rectangle' | 'sidebar' | 'mobile';
  className?: string;
}

const AdPlaceholder: React.FC<AdProps> = ({ type, className = "" }) => {
  const styles: Record<string, React.CSSProperties> = {
    leaderboard: { width: '970px', height: '90px', maxWidth: '100%' },
    rectangle: { width: '300px', height: '250px' },
    sidebar: { width: '300px', height: '600px' },
    mobile: { width: '320px', height: '100px', position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 100 }
  };

  return (
    <div 
      className={`ad-container ${className}`} 
      style={{
        ...styles[type],
        background: 'var(--bg-card)',
        border: '1px dashed var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        margin: '2rem auto',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p>Sponsored Content</p>
        <p style={{ fontSize: '0.6rem' }}>{styles[type].width} x {styles[type].height}</p>
      </div>
    </div>
  );
};

export default AdPlaceholder;
