
const Category = require('../models/categoryModel');
const Product = require('../models/productModel'); // assuming your Product model is imported here



exports.createCategory = async (req, res) => {
    console.log(req.body);
    try {
        const { name } = req.body;

        // Check if the category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

       
        const category = new Category({
            name,
            createdBy: req.user.id 
        });

        const savedCategory = await category.save();
        res.status(201).send(savedCategory);
    } catch (error) {
        res.status(500).send({ message: 'Error creating category', error });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({},{name:1});
        res.status(200).send({categories:categories});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        // console.log(id, categoryName)

        let category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }
        category.name = name;  // Set the new name
        category = await category.save();
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Check if there are any products associated with this category
        const productsInCategory = await Product.find({ category: categoryId });

        if (productsInCategory.length > 0) {
            return res.status(400).json({ msg: 'Cannot delete category. Category contains products.' });
        }

        // If no products, delete the category
        await Category.findByIdAndDelete(categoryId);

        res.status(200).json({ msg: 'Category deleted successfully!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

