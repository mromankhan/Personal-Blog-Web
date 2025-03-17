import { create } from "zustand";

type Theme = "light" | "dark";

type ThemeStore = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    detectTheme: () => void;
};




export const useThemeStore = create<ThemeStore>((set) => ({
    theme: "light",
    setTheme: (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
        set({ theme })
    },

    detectTheme: () => {
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        const theme = savedTheme || (systemPrefersDark ? "dark" : "light");

        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
        set({ theme });
    },

}));