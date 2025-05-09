"use client"

import { createContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// Create the auth context
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check for existing user session on component mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error parsing stored user:", error)
      localStorage.removeItem("user") // Clear invalid data
    } finally {
      setLoading(false)
    }
  }, [])

  // Login function
  const login = (userData) => {
    setCurrentUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  // Logout function
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("user")
    navigate("/login")
  }

  // Register function
  const register = (userData) => {
    setCurrentUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  // Provide the auth context to children components
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        register,
        loading,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
