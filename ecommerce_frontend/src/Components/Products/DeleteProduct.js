import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeleteProduct = () => {
    const [productId, setProductId] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleDelete = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            setError('User is not authenticated.');
            return;
        }

        try {
            await axios.delete(
                `http://localhost:5002/api/product/deleteProduct/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess('Product deleted successfully!');
            setProductId('');
            setError(null);
            // Optionally, you can redirect to the product list after deletion
            navigate('/productlist');
        } catch (err) {
            setError('Error deleting product. Please try again.');
            setSuccess(null);
        }
    };

    return (
        <div className="container">
            <h2>Delete Product</h2>
            <form onSubmit={handleDelete}>
                <input
                    type="text"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="Product ID"
                    required
                />
                <button type="submit">Delete Product</button>
            </form>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
        </div>
    );
};

export default DeleteProduct;
