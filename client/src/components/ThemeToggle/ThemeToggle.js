"use client"

import { useContext } from "react"
import { FaSun, FaMoon } from "react-icons/fa"
import { ThemeContext } from "../../context/ThemeContext"
import "./ThemeToggle.css"

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext)

  return (
    <button
      className="theme-toggle"
      onClick={toggleDarkMode}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <FaSun className="theme-toggle-icon" /> : <FaMoon className="theme-toggle-icon" />}
    </button>
  )
}

export default ThemeToggle
