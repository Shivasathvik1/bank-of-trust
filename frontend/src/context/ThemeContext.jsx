import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


const ThemeContext =
  createContext(null);


export function ThemeProvider({
  children,
}) {

  const [
    theme,
    setTheme,
  ] =
    useState(() => {

      return (
        localStorage.getItem(
          "trustledger-theme"
        ) ||
        "light"
      );

    });


  useEffect(() => {

    document.documentElement
      .setAttribute(
        "data-theme",
        theme
      );


    localStorage.setItem(
      "trustledger-theme",
      theme
    );

  }, [theme]);


  const toggleTheme = () => {

    setTheme(
      (currentTheme) =>
        currentTheme === "light"
          ? "dark"
          : "light"
    );

  };


  return (

    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >

      {children}

    </ThemeContext.Provider>

  );

}


export function useTheme() {

  const context =
    useContext(
      ThemeContext
    );


  if (!context) {

    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );

  }


  return context;

}