"use client"

import { createContext, useState, useEffect } from "react"

// Create the theme context
export const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
})

// Create the theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if user has a saved preference in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode")
    return savedTheme ? JSON.parse(savedTheme) : false
  })

  // Update localStorage and document body class when theme changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))

    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [darkMode])

  // Toggle function to switch between light and dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode)
  }

  // Context value
  const value = {
    darkMode,
    toggleDarkMode,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
