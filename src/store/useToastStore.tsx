import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }))
}));

export const ToastContainer = () => {
  const { toasts } = useToastStore();
  
  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className="glass-card" 
          style={{ 
            padding: '1rem 2rem', 
            background: toast.type === 'error' ? 'var(--danger)' : 'var(--bg-card)',
            color: 'white',
            border: `1px solid ${toast.type === 'error' ? 'rgba(255,255,255,0.2)' : 'var(--primary)'}`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            transform: 'translateX(0)',
            transition: 'all 0.3s ease-out'
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};
