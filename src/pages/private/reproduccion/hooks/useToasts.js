// src/pages/private/reproduccion/hooks/useToasts.js

import { useState } from "react";

export default function useToasts() {
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  return { toasts, addToast };
}