import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddProduct.css'; // Import the CSS file

const AddProduct = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [image, setImage] = useState(null);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Get token from localStorage
                const token = localStorage.getItem('token');
                
                const response = await axios.get('http://localhost:5002/api/category/getAllCategory', {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Add token to request headers
                    },
                });
                console.log('Categories fetched:', response.data);

                // Extract the categories array from the response and set it
                if (response.data && Array.isArray(response.data.categories)) {
                    setCategories(response.data.categories);
                } else {
                    console.error('Categories not found in response:', response.data);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };

        fetchCategories();
    }, []); // Empty dependency array to run this effect only once on mount

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('image', image); // Attach the image file

        // Get token from localStorage
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(
                'http://localhost:5002/api/product/addProduct', 
                formData, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}` // Add token to request headers
                    },
                }
            );
            alert(response.data.msg);
            setName('');
            setCategory('');
            setPrice('');
            setQuantity('');
            setImage(null);
        } catch (err) {
            console.error('Error adding product:', err);
            alert('Failed to add product.');
        }
    };

    return (
        <div className="add-product-container">
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>Product Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Category:</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Quantity:</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Image:</label>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        accept="image/*"
                    />
                </div>
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
