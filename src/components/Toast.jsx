import React, { createContext, useContext, useState, useCallback } from 'react';
// React Context hooks: createContext, useContext, useState, and useCallback for performance

import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
// Icons for toast types: success (green check), warning (triangle), info (blue circle)

// Context object to share the addToast function across the entire app
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  // toasts: stores array of currently active toast notification objects
  const [toasts, setToasts] = useState([]);

  // addToast: Adds a new notification and automatically removes it after 3.2 seconds
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random(); // Unique identifier for each toast
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto-dismiss after 3.2 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Container holding all active floating toast messages */}
      <div className="toast-container" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Dynamic icon according to toast type */}
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              {t.type === 'success' ? (
                <FaCheckCircle style={{ color: 'var(--success)' }} />
              ) : t.type === 'warning' ? (
                <FaExclamationTriangle style={{ color: 'var(--warning)' }} />
              ) : (
                <FaInfoCircle style={{ color: 'var(--primary)' }} />
              )}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Custom hook to trigger toasts easily from any component: const { addToast } = useToast();
export function useToast() {
  return useContext(ToastContext);
}
