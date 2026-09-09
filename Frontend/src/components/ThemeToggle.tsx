import { useState, useLayoutEffect, useCallback } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

function getInitialTheme(): boolean {
  const stored = localStorage.getItem("theme");
  if (stored) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(getInitialTheme);

  const applyTheme = useCallback((dark: boolean) => {
    if (dark) {
      document.documentElement.classList.remove("light-theme");
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
      document.documentElement.classList.add("light-theme");
    }
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, []);

  useLayoutEffect(() => {
    applyTheme(isDark);
  }, [isDark, applyTheme]);

  function toggleTheme() {
    setIsDark((prev) => !prev);
  }

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-label="Cambiar tema"
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        zIndex: 30,
        width: 86,
        height: 48,
        borderRadius: 9999,
        background: "var(--surface-2, #1a1a24)", // Fondo oscuro consistente en ambos estados
        border: "2px solid var(--accent, #8b5cf6)", // Borde morado destacado idéntico
        padding: 5,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
        outline: "none",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "var(--accent, #8b5cf6)", // Relleno morado constante
          color: "#ffffff", // Icono blanco
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: isDark ? "translateX(38px)" : "translateX(0px)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
        }}
      >
        {isDark ? <FiMoon size={20} /> : <FiSun size={20} />}
      </div>
    </button>
  );
}