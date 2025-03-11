import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm'; // Create this component below
import { jwtDecode } from 'jwt-decode'; // Corrected import

const stripePromise = loadStripe('pk_test_51QXdnDFqTFeDjJYR97WsH3tuXbn5Im6dpPGen4hcp4LINgWnBYmKl5CnZ48B4AX5UzgaH7asQIgBAsPvq4TdTrT000HjxagZO7'); // Replace with your Stripe public key

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [clientSecret, setClientSecret] = useState(null);
    const [userId, setUserId] = useState(null);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false); // State to toggle form visibility

    // Extract userId from JWT token
    useEffect(() => {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        if (token) {
            const decoded = jwtDecode(token); // Decode the JWT token
            setUserId(decoded.user.id); // Extract userId from the decoded token
        }
    }, []);

    // Fetch cart items from localStorage
    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(storedCartItems);
    }, []);

    const handleCheckout = async () => {
        try {
            // Calculate total price in INR
            const totalAmount = cartItems.reduce(
                (total, item) => total + item.price * item.selectedQuantity,
                0
            );

            console.log('Amount in INR to send:', totalAmount);

            if (!userId) {
                alert("User ID is missing! Please log in.");
                return;
            }

            // Send the amount in INR directly
            const response = await axios.post('http://localhost:5002/api/create-payment-intent', {
                userId,
                amount: totalAmount,
            });

            const { clientSecret } = response.data;
            setClientSecret(clientSecret);
            setShowCheckoutForm(true); // Show the checkout form
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    const handleCancelPayment = () => {
        setShowCheckoutForm(false); // Hide the checkout form
        setClientSecret(null); // Reset client secret
    };

    // Calculate the total price of all items
    const totalPrice = cartItems
        .reduce((total, item) => total + item.price * item.selectedQuantity, 0)
        .toFixed(2);

    return (
        <div className="Checkout">
            <div className="container">
                <h2>Checkout</h2>
                <ul className="list-group">
                    {cartItems.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>
                                <strong>{item.name}</strong> <br />
                                <p>Price: Rs.{item.price}</p>
                                Quantity: {item.selectedQuantity}
                            </span>
                           
                            <span>Total Rs.{(item.price * item.selectedQuantity).toFixed(2)}</span>
                            <div className="cart-item-image">
                                        <img src={item.image} alt={item.name} width="100" height="100" />
                                    </div>
                        </li>
                    ))}
                </ul>
                <h3>Total: Rs.{totalPrice}</h3>

                {showCheckoutForm && clientSecret ? (
                    <Elements stripe={stripePromise}>
                        <CheckoutForm clientSecret={clientSecret} onCancel={handleCancelPayment} />
                    </Elements>
                ) : (
                    <button className="btn btn-primary mt-3" onClick={handleCheckout}>
                        Proceed to Payment
                    </button>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;
