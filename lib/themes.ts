export type ThemeMode = "light" | "dark" | "system";

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem("tm_theme") as ThemeMode) || "light";
}

export function setStoredTheme(mode: ThemeMode) {
  localStorage.setItem("tm_theme", mode);
  applyTheme(mode);
}

export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "system") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", mode === "dark");
  }
}
