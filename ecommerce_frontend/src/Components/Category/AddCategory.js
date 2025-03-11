import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddCategory.css'; // Import the CSS file

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showList, setShowList] = useState(false); // State to manage category list visibility

    const fetchCategories = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('User is not authenticated.');
            return;
        }
        try {
            const response = await axios.get('http://localhost:5002/api/category/getAllCategory', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(response.data.categories);
        } catch (error) {
            alert('Failed to fetch categories');
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('User is not authenticated.');
            return;
        }
        const formData = { name: categoryName };
        try {
            await axios.post(
                'http://localhost:5002/api/category/createCategory',
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Category added successfully!');
            setCategoryName('');
            fetchCategories();
        } catch (err) {
            alert('Error adding category. Please try again.');
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setCategoryName(category.name);
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('User is not authenticated.');
            return;
        }
        try {
            await axios.put(
                `http://localhost:5002/api/category/updateCategory/${editingCategory._id}`,
                { name: categoryName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Category updated successfully!');
            setEditingCategory(null);
            setCategoryName('');
            fetchCategories();
        } catch (err) {
            alert('Error updating category. Please try again.');
        }
    };

    const handleDeleteCategory = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('User is not authenticated.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                const response = await axios.delete(
                    `http://localhost:5002/api/category/deleteCategory/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.msg) {
                    alert(response.data.msg);
                }
                fetchCategories();
            } catch (err) {
                if (err.response && err.response.data.msg) {
                    alert(err.response.data.msg);
                } else {
                    alert('Error deleting category. Please try again.');
                }
            }
        }
    };

    return (
        <div className="add-category">
            <h2 className="add-category-title">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
            <form
                className="add-category-form"
                onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
            >
                <input
                    className="add-category-input"
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Category Name"
                    required
                />
                <button className="add-category-btn" type="submit">
                    {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
            </form>
            <button
                className="add-category-show-btn"
                onClick={() => {
                    if (!showList) fetchCategories(); // Fetch categories when showing the list
                    setShowList(!showList);
                }}
            >
                {showList ? 'Hide List' : 'Show List'}
            </button>
            {showList && (
                <>
                    <h3 className="add-category-list-title">Category List</h3>
                    <ul className="add-category-list">
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <li key={category._id} className="add-category-item">
                                    <span className="add-category-name">{category.name}</span>
                                    <div className="add-category-actions">
                                        <button
                                            className="add-category-edit"
                                            onClick={() => handleEditCategory(category)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="add-category-delete"
                                            onClick={() => handleDeleteCategory(category._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className="add-category-empty">No categories found</p>
                        )}
                    </ul>
                </>
            )}
        </div>
    );
};

export default AddCategory;
