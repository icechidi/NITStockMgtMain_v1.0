import React, { useState, useEffect } from 'react';
import './Category.css'; // Custom CSS for styling

function Products() {
  const [categories] = useState([
    'Electronics',
    'Furniture',
    'Clothing',
    'Books',
    'Toys',
    'Groceries',
    'Sports',
    'Beauty',
    'Automotive',
    'Stationery',
  ]); // Static categories
  const [favorites, setFavorites] = useState([]); // Favorite items
  const [products, setProducts] = useState([]); // Available products

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items'); // Replace with your API endpoint
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Add a product to favorites
  const addToFavorites = (product) => {
    if (!favorites.some((fav) => fav.id === product.id)) {
      setFavorites((prevFavorites) => [...prevFavorites, product]);
    }
  };

  return (
    <div className="products-page">
      {/* Categories Section */}
      <section className="categories-section">
        <h2>Categories</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-card">
              <div className="category-icon">📦</div> {/* Placeholder icon */}
              <p>{category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Favorites Section */}
      <section className="favorites-section">
        <h2>Favorites</h2>
        <div className="favorites-grid">
          {favorites.length > 0 ? (
            favorites.map((favorite) => (
              <div key={favorite.id} className="favorite-card">
                <div className="favorite-icon">⭐</div> {/* Placeholder icon */}
                <p>{favorite.name}</p>
              </div>
            ))
          ) : (
            <p>No favorites added yet.</p>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <h2>Available Products</h2>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-icon">🛒</div> {/* Placeholder icon */}
              <p>{product.name}</p>
              <button
                className="btn btn-primary"
                onClick={() => addToFavorites(product)}
              >
                Add to Favorites
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2>Categories</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-card">
              <div className="category-icon">📦</div> {/* Placeholder icon */}
              <p>{category}</p>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
}

export default Products;