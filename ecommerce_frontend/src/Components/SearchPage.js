import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchPage.css';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      const searchParams = new URLSearchParams(location.search);
      const category = searchParams.get('category');
      const productName = searchParams.get('productName');

      try {
        setLoading(true);

        const response = await axios.get('http://localhost:5002/api/product/search', {
          params: { category, productName },
        });

        if (response.data.length === 0) {
          setSearchResults([]);
          setError('No products found matching your search criteria.');
        } else {
          const productList = response.data;

          // Adjust stock quantity based on cart items
          const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
          const updatedProducts = productList.map((product) => {
            const cartItem = cartItems.find((item) => item.id === product.id);
            if (cartItem) {
              product.quantity -= cartItem.selectedQuantity;
            }
            return product;
          });

          setSearchResults(updatedProducts);
          setError(null);
        }
        setLoading(false);
      } catch (err) {
        alert('Error fetching search results');
        setError(null);
        setLoading(false);
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [location.search]);

  const handleShowMore = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    document.body.classList.add('no-scroll');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    document.body.classList.remove('no-scroll');
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      if (selectedProduct.quantity < quantity) {
        alert('Insufficient stock!');
        return;
      }

      const cartItem = {
        ...selectedProduct,
        selectedQuantity: quantity,
        totalPrice: selectedProduct.price * quantity,
      };

      const existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];
      const existingItemIndex = existingCart.findIndex(
        (item) => item.id === selectedProduct.id
      );

      if (existingItemIndex !== -1) {
        existingCart[existingItemIndex].selectedQuantity += quantity;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem('cartItems', JSON.stringify(existingCart));

      setSearchResults((prevResults) =>
        prevResults.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, quantity: product.quantity - quantity }
            : product
        )
      );

      setShowModal(false);
      setSelectedProduct(null);

      // Navigate to cart page
      navigate('/cartpage', {
        state: {
          selectedProduct,
          quantity,
        },
      });
    }
  };

  return (
    <div className="search-page container">
      <h2>Search Results</h2>

      {loading && searchResults.length === 0 && !error && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="product-grid row">
  {searchResults.length > 0 ? (
    searchResults.map((product) => (
      <div
        key={product.id}
        className="col-md-4"
        onClick={() => handleShowMore(product)} // Add onClick to the card container
        style={{ cursor: 'pointer' }} // Add a pointer cursor for better UX
      >
        <div className="card">
          <img
            src={product.image || 'default-image.jpg'}
            alt={product.name}
            className="card-img-top"
          />
          <div className="card-body">
            <h3>{product.name}</h3>
            <p>Price: Rs.{product.price}</p>
            <p>Category: {product.category}</p>
            <p
              className={product.quantity > 0 ? 'in-stock' : 'out-of-stock'}
            >
              {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </p>
            <p>Quantity: {product.quantity}</p>
            <a
              href="#"
              className="show-more-link"
              onClick={(e) => {
                e.preventDefault();
                handleShowMore(product); // Still handle 'Show More' link separately
              }}
            >
              Show More
            </a>
          </div>
        </div>
      </div>
    ))
  ) : (
    !error && <p>No products found matching your search criteria.</p>
  )}
</div>


      {showModal && selectedProduct && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              &times;
            </button>
            <div className="modal-details">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="modal-image"
              />
              <h3>{selectedProduct.name}</h3>
              <p>
                <strong>Price:</strong> Rs.{selectedProduct.price}
              </p>
              {/* <p>
                <strong>Description:</strong> {selectedProduct.description}
              </p> */}
              <p>
                <strong>Category:</strong> {selectedProduct.category || 'N/A'}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                {selectedProduct.quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </p>
              {/* <p>
                <strong>Quantity:</strong>
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  max={selectedProduct.quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </p> */}
              <button className="btn btn-primary" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
