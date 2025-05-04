"use client"

import { useContext } from "react"
import { useLocation } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import "./Header.css"

function Header() {
  const { currentUser } = useContext(AuthContext)
  const location = useLocation()

  // Don't show header on login or register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null
  }

  return (
    <header className="header-container">
      <h1 className="header-title">Stock Management System</h1>

      {currentUser && (
        <div className="header-actions">
          <div className="header-user">
            <span className="header-user-name">Welcome, {currentUser.username}</span>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
