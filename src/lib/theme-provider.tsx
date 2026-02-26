import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "tech" | "childlike";
type Mode = "day" | "night" | "auto";

interface ThemeContextType {
  theme: Theme;
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSystemTheme = (): Theme => {
  const hour = new Date().getHours();
  // 晚上 6 点 (18:00) 到次日 6 点 (06:00) 为静谧夜 (tech)
  // 其余时间为明媚日 (childlike)
  return hour >= 18 || hour < 6 ? "tech" : "childlike";
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>(() => {
    const savedMode = localStorage.getItem("app-theme-mode") as Mode;
    // 默认开启自适应模式
    return savedMode || "auto";
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    if (mode === "auto") {
      return getSystemTheme();
    }
    return mode === "night" ? "tech" : "childlike";
  });

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem("app-theme-mode", newMode);
    
    if (newMode === "auto") {
      setThemeState(getSystemTheme());
    } else {
      setThemeState(newMode === "night" ? "tech" : "childlike");
    }
  };

  const toggleMode = () => {
    // 循环切换：自适应 -> 日间 -> 夜间 -> 自适应
    if (mode === "auto") {
      setMode("day");
    } else if (mode === "day") {
      setMode("night");
    } else {
      setMode("auto");
    }
  };

  // 自动切换轮询：每分钟检查一次时间 (仅在自适应模式下)
  useEffect(() => {
    if (mode !== "auto") return;

    const checkTheme = () => {
      const systemTheme = getSystemTheme();
      if (theme !== systemTheme) {
        setThemeState(systemTheme);
      }
    };

    checkTheme();
    const interval = setInterval(checkTheme, 60000); 
    return () => clearInterval(interval);
  }, [mode, theme]);

  // 响应式应用类名
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("theme-tech", "theme-childlike");
    root.classList.add(`theme-${theme}`);
    
    // 同步到存储
    localStorage.setItem("app-theme-mode", mode);
  }, [theme, mode]);

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
