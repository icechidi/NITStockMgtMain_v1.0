"use client"

import { Link } from "react-router-dom"
import { FaTools, FaHome, FaClock, FaRocket, FaShieldAlt, FaChartLine, FaUsers, FaCogs } from "react-icons/fa"
import "./ComingSoon.css"

function ComingSoon({ pageTitle = "This Page", pageType = "under development" }) {
  const getPageMessage = () => {
    switch (pageType) {
      case "under-development":
        return {
          title: "Under Development",
          subtitle: `${pageTitle} is currently being built with amazing features`,
          description:
            "Our development team is working hard to bring you the best experience. This page will include advanced functionality and a modern interface.",
          icon: <FaTools />,
          status: "In Development - 75% Complete",
        }
      case "coming-soon":
        return {
          title: "Coming Soon",
          subtitle: `${pageTitle} will be available shortly`,
          description:
            "We're putting the finishing touches on this feature. It will be packed with powerful tools to enhance your workflow.",
          icon: <FaRocket />,
          status: "Launching Soon - 90% Complete",
        }
      case "maintenance":
        return {
          title: "Under Maintenance",
          subtitle: `${pageTitle} is temporarily unavailable`,
          description:
            "We're performing scheduled maintenance to improve performance and add new features. Please check back soon.",
          icon: <FaCogs />,
          status: "Maintenance in Progress",
        }
      default:
        return {
          title: "Under Development",
          subtitle: `${pageTitle} is being built`,
          description: "This page is currently under development. We're working to bring you an amazing experience.",
          icon: <FaTools />,
          status: "In Development",
        }
    }
  }

  const pageInfo = getPageMessage()

  const features = [
    {
      icon: <FaShieldAlt />,
      text: "Secure & Reliable",
    },
    {
      icon: <FaChartLine />,
      text: "Advanced Analytics",
    },
    {
      icon: <FaUsers />,
      text: "User Friendly",
    },
    {
      icon: <FaClock />,
      text: "Real-time Updates",
    },
  ]

  return (
    <div className="coming-soon-container">
      <div className="coming-soon-content">
        <div className="coming-soon-icon">{pageInfo.icon}</div>

        <h1 className="coming-soon-title">{pageInfo.title}</h1>

        <p className="coming-soon-subtitle">{pageInfo.subtitle}</p>

        <p className="coming-soon-description">{pageInfo.description}</p>

        <div className="coming-soon-features">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon">{feature.icon}</div>
              <span className="feature-text">{feature.text}</span>
            </div>
          ))}
        </div>

        <div className="coming-soon-actions">
          <Link to="/dashboard" className="btn-primary">
            <FaHome />
            Back to Dashboard
          </Link>
          <a href="mailto:support@stockmaster.com" className="btn-secondary">
            Contact Support
          </a>
        </div>

        <div className="coming-soon-status">
          <p className="status-text">{pageInfo.status}</p>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon
