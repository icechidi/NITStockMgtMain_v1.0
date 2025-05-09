"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import "./Login.css"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
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

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Username and password are required")
      return
    }

    try {
      // For demo purposes, we'll simulate a successful login
      // In a real app, you would validate with your backend
      login({ username, role: "admin" })

      // Redirect to dashboard or the page they were trying to access
      const from = location.state?.from?.pathname || "/dashboard"
      navigate(from, { replace: true })

      /* Uncomment this for real backend integration
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } else {
        setErrorMessage(data.message || "Invalid username or password.");
      }
      */
    } catch (error) {
      console.error("Error during login:", error)
      setErrorMessage("An error occurred. Please try again.")
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Stock Management</h2>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
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
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
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
