import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useUserContext } from '../context/userContext';
import '../Components/Navbar.css';

const Navbar = () => {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to monitor route changes

  const [category, setCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const totalQuantity = cartItems.reduce(
        (total, item) => total + (item.selectedQuantity || 1),
        0
      );
      setCartCount(totalQuantity);
    };

    updateCartCount(); // Initial load

    // Listen for custom cartUpdated event
    const handleCartUpdated = (event) => setCartCount(event.detail);

    window.addEventListener('cartUpdated', handleCartUpdated);
    window.addEventListener('storage', updateCartCount); // For other tabs

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  // Reset search bar when navigating to pages other than the search page
  useEffect(() => {
    if (location.pathname !== '/search') {
      setCategory('');
      setProductName('');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const handleSearch = () => {
    const searchQuery = new URLSearchParams();
    if (category) searchQuery.append('category', category);
    if (productName) searchQuery.append('productName', productName);
    navigate(`/search?${searchQuery.toString()}`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">Ecommerce</a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/addproduct">Add Product</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/addcategory">Add Category</Link>
          </li>
        </ul>

        <div className="navbar-search d-flex ml-auto">
          <input
            type="text"
            className="form-control mr-2"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="text"
            className="form-control mr-2"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="cart-icon-container ml-3">
          <Link to="/cart" className="cart-link">
            <FaShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </div>

        {user ? (
          <div className="user-info ml-3">
            <span>Welcome, {user.name}!</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links ml-3">
            <Link className="nav-link" to="/register">Register</Link>
            <Link className="nav-link" to="/login">Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
