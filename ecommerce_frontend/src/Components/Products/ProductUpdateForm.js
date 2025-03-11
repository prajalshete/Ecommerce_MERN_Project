import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ProductUpdateForm = () => {
    const { id } = useParams(); // Get product ID from the URL
    const [product, setProduct] = useState({
        name: '',
        category: '', // Initialize as empty string
        price: '',
        quantity: '',
        // available: false, // Default as a Boolean
    });
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null); // State to handle image upload
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch product details and categories
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5002/api/product/getWithQuery/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProduct(response.data); // Set fetched product data in state
            } catch (err) {
                setError('Error fetching product details.');
            }
        };

        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5002/api/category/getAllCategory', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories(response.data.categories); // Set categories for the dropdown
            } catch (err) {
                setError('Error fetching categories.');
            }
        };

        if (id) {
            fetchProduct();
        }
        fetchCategories(); // Fetch categories for dropdown
    }, [id]); // Fetch product details again if the ID changes

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'available') {
            setProduct({ ...product, [name]: value === 'InStock' });
        } else {
            setProduct({ ...product, [name]: value });
        }
    };

    // Handle image upload
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            // Create a FormData object to handle file upload
            const formData = new FormData();
            formData.append('name', product.name);
            formData.append('category', product.category);
            formData.append('price', product.price);
            formData.append('quantity', product.quantity);
            // formData.append('available', product.available);
            if (image) {
                formData.append('image', image); // Append the image file if selected
            }

            // Make PUT request to update product
            await axios.patch(`http://localhost:5002/api/product/updateProduct/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigate('/productList'); // Navigate back to the product list page
        } catch (err) {
            setError('Error updating product.');
        }
    };

    return (
        <div className="container">
            <h2>Update Product</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={product.name || ''}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                        id="category"
                        name="category"
                        className="form-select"
                        value={product.category || ''}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        className="form-control"
                        value={product.price || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">Quantity</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        className="form-control"
                        value={product.quantity || ''}
                        onChange={handleInputChange}
                    />
                </div>
                {/* <div className="mb-3">
                    <label htmlFor="available" className="form-label">Availability</label>
                    <select
                        id="available"
                        name="available"
                        className="form-select"
                        value={product.available === true ? 'InStock' : 'OutOfStock'}
                        onChange={handleInputChange}
                    >
                        <option value="InStock">In Stock</option>
                        <option value="OutOfStock">Out of Stock</option>
                    </select>
                </div> */}
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Product Image</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        className="form-control"
                        onChange={handleImageChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
};

export default ProductUpdateForm;
