import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Carousel } from 'react-bootstrap'; // Import Carousel from React Bootstrap
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    let role = '';
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            role = decodedToken?.user?.role || '';
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5002/api/product/getProductsWithAuth', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const productList = Array.isArray(response.data) ? response.data : [];
    
                // Save the fetched product list to localStorage
                localStorage.setItem('products', JSON.stringify(productList));
    
                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                
                // Update product quantities based on the cart
                const updatedProducts = productList.map(product => {
                    const cartItem = cartItems.find(item => item.id === product.id);
                    if (cartItem) {
                        product.quantity -= cartItem.selectedQuantity;
                    }
                    return product;
                });
    
                setProducts(updatedProducts);
            } catch (err) {
                setError('Error fetching products. Please try again.');
            }
        };
    
        fetchProducts();
    }, [token]);

    const handleCardClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
        document.body.classList.add('no-scroll');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
        document.body.classList.remove('no-scroll');
    };

    const handleProceedToQuantitySelection = () => {
        if (selectedProduct) {
            // Check if the product is out of stock
            if (selectedProduct.quantity <= 0) {
                setError('This product is out of stock. Cannot add to cart.');
                return; // Prevent further actions if the product is out of stock
            }

            const cartItem = {
                ...selectedProduct,
                selectedQuantity: quantity,
                totalPrice: selectedProduct.price * quantity,
            };

            const existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];
            
            // If the product is already in the cart, update its quantity instead of adding a new item
            const existingItemIndex = existingCart.findIndex(item => item.id === selectedProduct.id);
            if (existingItemIndex !== -1) {
                existingCart[existingItemIndex].selectedQuantity += quantity;
            } else {
                existingCart.push(cartItem);
            }

            localStorage.setItem('cartItems', JSON.stringify(existingCart));

            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === selectedProduct.id
                        ? { ...product, quantity: product.quantity - quantity }
                        : product
                )
            );

            navigate('/cartpage', {
                state: {
                    selectedProduct,
                    quantity,
                },
            });
        }
    };

    const handleUpdateProduct = (productId) => navigate(`/update-product/${productId}`);

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`http://localhost:5002/api/product/deleteproduct/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(products.filter((product) => product.id !== productId));
        } catch (err) {
            setError('Error deleting product. Please try again.');
        }
    };

    return (
        <div className="product-list-container">
            {/* Carousel Component */}
            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/images/carousel1.jpg"
                        alt="First slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/images/carousel2.jpg"
                        alt="Second slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/images/carousel8.jpg"
                        alt="Third slide"
                    />
                </Carousel.Item>
            </Carousel>

            {/* Error Message */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Product Grid */}
            <div className="product-grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div 
                            key={product.id} 
                            className="product-card" 
                            onClick={() => role !== 'admin' && handleCardClick(product)} // Only clickable if not admin
                            style={{ cursor: role !== 'admin' ? 'pointer' : 'default' }} // Change cursor style based on role
                        >
                            <div className="product-image">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} />
                                ) : (
                                    <p>No image available</p>
                                )}
                            </div>
                            <div className="product-details">
                                <h3>{product.name}</h3>
                                <p>Price: Rs.{product.price}</p>
                                <p
                                    className={product.quantity > 0
                                        ? 'in-stock'
                                        : 'out-of-stock'}
                                >
                                    {product.quantity > 0
                                        ? 'In Stock'
                                        : 'Out of Stock'}
                                </p>
                                <p>Quantity: {product.quantity}</p>
                                <div className="action-buttons">
                                    {role === 'admin' ? (
                                        <>
                                            <button
                                                className="btn update"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdateProduct(product.id);
                                                }}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="btn delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteProduct(product.id);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    ) : (
                                        <a
                                            href="#"
                                            className="show-more-link"
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            Show More
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No products available.</p>
                )}
            </div>

            {/* Modal for product details */}
            {showModal && selectedProduct && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={handleCloseModal}>
                            &times;
                        </button>
                        <div className="modal-details">
                            <img src={selectedProduct.image} alt={selectedProduct.name} />
                            <h3>{selectedProduct.name}</h3>
                            <p>
                                <strong>Price:</strong> Rs.{selectedProduct.price}
                            </p>
                            <p>
                                <strong>Description:</strong> {selectedProduct.description}
                            </p>
                            <p>
                                <strong>Category:</strong> {selectedProduct.category || 'N/A'}
                            </p>
                            <p>
                                <strong>Status:</strong>
                                {selectedProduct.quantity > 0
                                    ? 'In Stock'
                                    : 'Out of Stock'}
                            </p>

                            {/* Display the error message inside the modal */}
                            {error && <div className="error-message">{error}</div>}

                            <button className="btn proceed" onClick={handleProceedToQuantitySelection}>
                                Proceed to Quantity Selection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
