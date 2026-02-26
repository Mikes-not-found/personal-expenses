import { useState, useCallback, useRef } from 'react';

let idCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const showToast = useCallback((message, type = 'info') => {
    const id = ++idCounter;
    setToasts(prev => [...prev, { id, message, type }]);

    timersRef.current[id] = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      delete timersRef.current[id];
    }, 3200);

    return id;
  }, []);

  return { toasts, showToast };
}
