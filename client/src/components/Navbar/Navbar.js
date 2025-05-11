"use client"

import { useState, useEffect, useContext } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  FaUser,
  FaTachometerAlt,
  FaBoxes,
  FaExchangeAlt,
  FaStore,
  FaLayerGroup,
  FaChartBar,
  FaSignOutAlt,
  FaUserCog,
  FaBuilding,
  FaTags,
  FaBoxOpen,
  FaShoppingCart,
  FaClipboardList,
  FaBox,
} from "react-icons/fa"
import { AuthContext } from "../../context/AuthContext"
import "./Navbar.css"

function Navbar() {
  const location = useLocation()
  const { currentUser, logout } = useContext(AuthContext)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close navbar when route changes on mobile
  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  // Close navbar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileOpen && !event.target.closest(".navbar-container") && !event.target.closest(".navbar-toggle")) {
        setMobileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [mobileOpen])

  // Prevent body scroll when navbar is open on mobile
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="navbar-toggle d-md-none" onClick={() => setMobileOpen(true)} aria-label="Open menu">
        <FaBoxes />
      </button>

      {/* Mobile Overlay */}
      <div className={`navbar-overlay ${mobileOpen ? "active" : ""}`}></div>

      <div className={`navbar-container ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Mobile Close Button */}
        <button className="navbar-close d-md-none" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          &times;
        </button>

        <div className="navbar-user-icon-admin">
          <FaUser />
          <div className="navbar-user-name">{currentUser?.username || "User"}</div>
        </div>

        <ul className="navbar-nav">
          <li className="navbar-nav-item">
            <Link to="/dashboard" className={`navbar-nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}>
              <FaTachometerAlt className="navbar-nav-icon" /> Dashboard
            </Link>
          </li>
          <li className="navbar-nav-item">
            <Link to="/items" className={`navbar-nav-link ${location.pathname === "/items" ? "active" : ""}`}>
              <FaBox className="navbar-nav-icon" /> Items
            </Link>
          </li>
          <li className="navbar-nav-item">
            <Link to="/products" className={`navbar-nav-link ${location.pathname === "/products" ? "active" : ""}`}>
              <FaBoxes className="navbar-nav-icon" /> Products
            </Link>
          </li>
          <li className="navbar-nav-item">
            <Link to="/orders" className={`navbar-nav-link ${location.pathname === "/orders" ? "active" : ""}`}>
              <FaShoppingCart className="navbar-nav-icon" /> Orders
            </Link>
          </li>
          <li className="navbar-nav-item">
            <Link to="/requests" className={`navbar-nav-link ${location.pathname === "/requests" ? "active" : ""}`}>
              <FaClipboardList className="navbar-nav-icon" /> Requests
            </Link>
          </li>
          <li className="navbar-nav-item">
            <Link
              to="/stock-movements"
              className={`navbar-nav-link ${location.pathname === "/stock-movements" ? "active" : ""}`}
            >
              <FaExchangeAlt className="navbar-nav-icon" /> Stock Movements
            </Link>
          </li>
          <li className="navbar-nav-item">
            <Link to="/stores" className={`navbar-nav-link ${location.pathname === "/stores" ? "active" : ""}`}>
              <FaStore className="navbar-nav-icon" /> Stores
            </Link>
          </li>
          <li className="navbar-nav-item">
            <Link to="/groups" className={`navbar-nav-link ${location.pathname === "/groups" ? "active" : ""}`}>
              <FaLayerGroup className="navbar-nav-icon" /> Groups
            </Link>
          </li>
          <li className="navbar-nav-item">
            <Link to="/brands" className={`navbar-nav-link ${location.pathname === "/brands" ? "active" : ""}`}>
              <FaTags className="navbar-nav-icon" /> Brands
            </Link>
          </li>
          <li className="navbar-nav-item">
            <Link to="/stocks" className={`navbar-nav-link ${location.pathname === "/stocks" ? "active" : ""}`}>
              <FaBoxOpen className="navbar-nav-icon" /> Stocks
            </Link>
          </li>
          <li className="navbar-nav-item">
            <Link to="/reports" className={`navbar-nav-link ${location.pathname === "/reports" ? "active" : ""}`}>
              <FaChartBar className="navbar-nav-icon" /> Reports
            </Link>
          </li>
          <li className="navbar-nav-item">
            <Link to="/company" className={`navbar-nav-link ${location.pathname === "/company" ? "active" : ""}`}>
              <FaBuilding className="navbar-nav-icon" /> Company
            </Link>
          </li>
          <li className="navbar-nav-item">
            <Link to="/profile" className={`navbar-nav-link ${location.pathname === "/profile" ? "active" : ""}`}>
              <FaUserCog className="navbar-nav-icon" /> Profile
            </Link>
          </li>
          <li className="navbar-nav-item">
            <Link to="/login" className="navbar-nav-link text-danger" onClick={logout}>
              <FaSignOutAlt className="navbar-nav-icon" /> Logout
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}

export default Navbar
