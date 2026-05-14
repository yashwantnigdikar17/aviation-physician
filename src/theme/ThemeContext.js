import React, { createContext, useContext, useState } from "react";
import { lightTheme, darkTheme } from "./theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(true);

  const toggleTheme = () => setDark((prev) => !prev);

  const theme = dark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);