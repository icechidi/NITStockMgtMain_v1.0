"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import "./Login.css"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, currentUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard")
    }
  }, [currentUser, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    setIsLoading(true)

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Username and password are required")
      setIsLoading(false)
      return
    }

    try {
      const result = await login({ username, password })

      if (result.success) {
        // Redirect to dashboard or the page they were trying to access
        const from = location.state?.from?.pathname || "/dashboard"
        navigate(from, { replace: true })
      } else {
        setErrorMessage(result.message || "Invalid username or password")
      }
    } catch (error) {
      console.error("Error during login:", error)
      setErrorMessage("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Stock Management</h2>
        {errorMessage && (
          <div className="alert alert-danger">
            <p>{errorMessage}</p>
            {errorMessage.includes("Server returned an invalid response") && (
              <p className="mt-2">
                <strong>Troubleshooting:</strong>
                <ul className="mt-1">
                  <li>Make sure the server is running on port 5000</li>
                  <li>Check if the database is properly connected</li>
                  <li>Verify that the auth routes are correctly set up</li>
                </ul>
              </p>
            )}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <p className="mt-3 text-center">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
