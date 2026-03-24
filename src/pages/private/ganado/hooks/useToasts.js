import { useState } from "react";

export default function useToasts() {
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, type = "success") => {
    const texto = typeof msg === "string" ? msg : msg?.mensaje || "Ocurrió un error";
    const id = Date.now() + Math.random();

    setToasts((t) => [...t, { id, msg: texto, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  };

  return { toasts, addToast };
}