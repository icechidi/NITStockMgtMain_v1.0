"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import "../Login/Login.css"

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState(null)
  const { register, currentUser, error } = useContext(AuthContext)
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard")
    }
  }, [currentUser, navigate])

  // Update error message from context
  useEffect(() => {
    if (error) {
      setErrorMessage(error)
    }
  }, [error])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setIsLoading(true)
    setDebugInfo(null)

    const { username, email, password, confirmPassword } = formData

    // Basic validation
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage("All fields are required")
      setIsLoading(false)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.")
      setIsLoading(false)
      return
    }

    // Validate password standards
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.")
      setIsLoading(false)
      return
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.")
      setIsLoading(false)
      return
    }

    try {
      console.log("Sending registration data:", {
        username,
        email,
        passwordLength: password.length,
      })

      // Direct API call for debugging
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await response.json()
      console.log("Registration response:", data)

      if (response.ok) {
        // Store token and user data
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        navigate("/dashboard")
      } else {
        setErrorMessage(data.message || "Registration failed. Please try again.")
        setDebugInfo(data)
      }
    } catch (error) {
      console.error("Error during registration:", error)
      setErrorMessage(`Registration error: ${error.message}`)
      setDebugInfo({ error: error.toString() })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Create Account</h2>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
          <p className="mt-3 text-center">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>

        {debugInfo && (
          <div className="mt-4 p-3 bg-light border rounded">
            <h5>Debug Information</h5>
            <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default Register
