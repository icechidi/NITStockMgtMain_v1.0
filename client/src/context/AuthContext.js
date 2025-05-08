"use client"

import { createContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// Create the auth context
export const AuthContext = createContext()

// API URL
const API_URL = "http://localhost:5000/api"

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const navigate = useNavigate()

  // Check for existing user session on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if (storedToken && storedUser) {
          setToken(storedToken)
          setCurrentUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (credentials) => {
    try {
      console.log("Login credentials:", { ...credentials, password: "[REDACTED]" })

      // Make sure we're sending the correct format
      const loginData = {
        username: credentials.username,
        password: credentials.password,
      }

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        return {
          success: false,
          message: "Server returned an invalid response. Please check if the server is running correctly.",
        }
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Save token and user data
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      setToken(data.token)
      setCurrentUser(data.user)

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: error.message || "Login failed. Please try again." }
    }
  }

  // Logout function
  const logout = () => {
    setCurrentUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  // Register function
  const register = async (userData) => {
    try {
      console.log("Registration data:", { ...userData, password: "[REDACTED]" })

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        return {
          success: false,
          message: "Server returned an invalid response. Please check if the server is running correctly.",
        }
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      // Save token and user data
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      setToken(data.token)
      setCurrentUser(data.user)

      return { success: true }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, message: error.message || "Registration failed. Please try again." }
    }
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
        token,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
