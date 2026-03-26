import { useCallback, useRef, useState } from "react";

let toastId = 0;

export default function usePotreroToasts() {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));

    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const pushToast = useCallback((mensaje, tipo = "success", duracion = 3000) => {
    const id = ++toastId;

    setToasts((prev) => [...prev, { id, mensaje, tipo }]);

    timersRef.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timersRef.current[id];
    }, duracion);
  }, []);

  return {
    toasts,
    pushToast,
    removeToast,
  };
}