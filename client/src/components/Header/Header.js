import React, { useEffect, useState } from 'react';
import './Header.css'; // Import the CSS for the header

function Header() {

  
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch items
      // Fetch recent movements

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Error loading dashboard data');
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Redirect to a search results page or filter items dynamically
      alert(`Searching for: ${searchQuery}`);
      // Example: Redirect to a search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    } else {
      alert('Please enter a search term.');
    }
  };

  

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }


  return (
    <header className="header">
      <div className="header-left">
        <h1>NITStockMgt</h1>
      </div>

      <div className="search-bar">
          <input
            type="text"
            id="search-input"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button id="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>

      
    </header>
  );
}

export default Header;