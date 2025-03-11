// HomePage.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductList from './Products/ProductList';

const HomePage = () => {
  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(true); // State to manage loading
  const navigate = useNavigate(); // Use navigate for redirection

  // Function to fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/product/getProductsWithAuth'); // Public endpoint
      setProducts(response.data); // Set products to state
      setLoading(false); // Set loading to false
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false); // Set loading to false even on error
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products when component mounts
  }, []);

 
  return (
    <div>
      {loading ? (
        <p>Loading products...</p> // Show loading message while fetching
      ) : (
        <ProductList  /> // Pass the handler to ProductList
      )}
    </div>
  );
};

export default HomePage;
