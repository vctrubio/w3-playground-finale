import { createContext } from "react";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}
export type Theme = "light" | "dark";

export const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => { },
});