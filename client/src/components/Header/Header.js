import React from 'react';
import './Header.css'; // Import the CSS for the header

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <h1>Admin</h1>
      </div>
      <div className="header-right">
        <i className="user-icon fas fa-user-circle"></i>
      </div>
    </header>
  );
}

export default Header;