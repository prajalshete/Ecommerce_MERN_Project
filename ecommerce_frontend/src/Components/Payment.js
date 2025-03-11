// src/components/Payment.js
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import './Payment.css';


const Payment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const handlePayment = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        // Get a reference to the card element
        const cardElement = elements.getElement(CardElement);

        if (!stripe || !elements || !cardElement) {
            return;
        }

        // Create payment method
        const { token, error: stripeError } = await stripe.createToken(cardElement);

        if (stripeError) {
            setError(stripeError.message);
            setLoading(false);
            return;
        }

        // Send token to backend for creating the payment
        try {
            const response = await axios.post('http://localhost:5002/api/payment/process', {
                token: token.id,
                amount: 1000, // For example, 1000 = $10. Adjust as necessary
            });

            if (response.data.success) {
                setSuccess(true);
                setLoading(false);
            } else {
                setError('Payment failed. Please try again.');
                setLoading(false);
            }
        } catch (err) {
            setError('Error processing payment. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="payment-container">
            <h2>Complete Your Payment</h2>

            <form onSubmit={handlePayment}>
                <div className="card-element">
                    <CardElement />
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">Payment successful!</div>}

                <button type="submit" disabled={loading || !stripe || !elements}>
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
            </form>
        </div>
    );
};

export default Payment;
