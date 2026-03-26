// ─── hooks/useToasts.js ───────────────────────────────────────────────────────
import { useState, useCallback } from "react";

export function useToasts() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  return { toast, showToast, hideToast };
}