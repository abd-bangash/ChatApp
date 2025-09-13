import { create } from "zustand";

const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("chat-theme") || "coffee";
  }
  return "coffee";
};

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
    // Set theme on <html> immediately
    document.documentElement.setAttribute("data-theme", theme);
  },
}));
