import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
    updateCartCount(storedCartItems); // Initialize cart count when page loads
  }, []);

  const updateCartCount = (updatedCart) => {
    const totalQuantity = updatedCart.reduce(
      (total, item) => total + item.selectedQuantity,
      0
    );
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    localStorage.setItem('cartCount', totalQuantity);

    // Dispatch custom event to notify Navbar
    const cartUpdatedEvent = new CustomEvent('cartUpdated', { detail: totalQuantity });
    window.dispatchEvent(cartUpdatedEvent);
  };

  const handleRemoveFromCart = (index) => {
    const updatedCart = [
      ...cartItems.slice(0, index),
      ...cartItems.slice(index + 1),
    ];
    setCartItems(updatedCart);
    updateCartCount(updatedCart);
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedCart = [...cartItems];
    const product = updatedCart[index];

    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productInStock = products.find((p) => p.id === product.id);

    if (!productInStock) {
      setErrorMessage('Product not found in the product list.');
      return;
    }

    if (newQuantity < 1) {
      setErrorMessage('Quantity cannot be less than 1.');
      return;
    }

    if (newQuantity > productInStock.quantity) {
      setErrorMessage(`Quantity exceeds available stock. Only ${productInStock.quantity} items are available.`);
      return;
    }

    setErrorMessage('');
    updatedCart[index].selectedQuantity = newQuantity;

    setCartItems(updatedCart);
    updateCartCount(updatedCart);

    const updatedProducts = products.map((prod) => {
      if (prod.id === updatedCart[index].id) {
        prod.quantity -= newQuantity - product.selectedQuantity;
      }
      return prod;
    });

    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.selectedQuantity,
    0
  ).toFixed(2);

  return (
    <div className="Cart">
      <div className="container">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <ul className="list-group">
              {cartItems.map((item, index) => (
                <li key={`${item.id}-${index}`} className="list-group-item d-flex align-items-center">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} width="100" height="100" />
                  </div>
                  <div className="cart-item-details ml-3">
                    <h3>{item.name}</h3>
                    <p>Price: Rs.{item.price}</p>
                    <div>
                      <label>Quantity:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.selectedQuantity}
                        onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                        style={{ width: '50px', marginLeft: '10px' }}
                      />
                    </div>
                    <p>Total for this item: Rs.{(item.price * item.selectedQuantity).toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => handleRemoveFromCart(index)} 
                    className="btn btn-danger ml-auto"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <h3>Total Price: Rs.{totalPrice}</h3>
            <button 
              className="btn btn-primary mt-3" 
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
