import { useState, useCallback, useRef } from 'react';

export function useToast() {
  const [message, setMessage] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setMessage(msg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMessage(null), 3000);
  }, []);

  const Toast = message ? (
    <div className="fixed bottom-5 right-5 z-[200] max-w-xs rounded-lg bg-ink px-4 py-3 text-[12.5px] font-medium text-white shadow-lg">
      {message}
    </div>
  ) : null;

  return { showToast, Toast };
}
