import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const CheckoutForm = ({ clientSecret, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return; // Stripe.js has not loaded yet
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (error) {
            console.error('Payment error:', error);
            alert('Payment failed. Please try again.');
        } else if (paymentIntent.status === 'succeeded') {
            console.log('Payment successful:', paymentIntent);
            alert('Payment successful!');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#32325d',
                            '::placeholder': { color: '#aab7c4' },
                        },
                        invalid: { color: '#fa755a' },
                    },
                }}
            />
            <div className="button-group mt-3">
                <button type="submit" className="btn btn-primary" disabled={!stripe}>
                    Pay
                </button>
                <button
                    type="button"
                    className="btn btn-secondary ml-2"
                    onClick={onCancel}
                >
                    Cancel Payment
                </button>
            </div>
        </form>
    );
};

export default CheckoutForm;
