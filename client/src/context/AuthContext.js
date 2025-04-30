"use client"

import { createContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem("user")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setCurrentUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("user")
    navigate("/login")
  }

  const register = (userData) => {
    setCurrentUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, loading }}>{children}</AuthContext.Provider>
  )
}
