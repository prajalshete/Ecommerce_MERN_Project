const express = require('express');
const categoryControllers = require('../controllers/categoryController');
const authorize = require('../middleware/authorize');

const router = express.Router();

// Route to create a new category
router.post('/createCategory', authorize.auth,authorize.admin, categoryControllers.createCategory);

// Route to get all categories
router.get('/getAllCategory', authorize.auth, categoryControllers.getCategories);

// Route to update a category by ID
router.put('/updateCategory/:id', authorize.auth, authorize.admin, categoryControllers.updateCategory);

// Route to delete a category by ID
router.delete('/deleteCategory/:id', authorize.auth, authorize.admin, categoryControllers.deleteCategory);

module.exports = router;




// http://localhost:5005/api/category/createCategory
//http://localhost:5005/api/categories/updateCategory
//http://localhost:5005/api/categories/deleteCategory/${caterory._id}
//http://localhost:5005/api/categories/getAllCategory