console.log('FOLIOGEN_STABLE_V2');
console.log('%c FOLIOGEN LIVE - V1.0.2 ', 'background: #4f46e5; color: white; font-weight: bold;');

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="foliogen-ui-theme">
    <App />
  </ThemeProvider>
);
