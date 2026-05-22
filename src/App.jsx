import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";

export default function App() {
  useEffect(() => {
    const redirect = sessionStorage.getItem("redirect");

    if (redirect) {
      sessionStorage.removeItem("redirect");

      const url = new URL(redirect);
      const path = url.pathname.replace("/frontend-2", "");

      window.history.replaceState(
        null,
        "",
        `/frontend-2${path}${url.search}${url.hash}`
      );
    }
  }, []);

  return <AppRouter />;
}