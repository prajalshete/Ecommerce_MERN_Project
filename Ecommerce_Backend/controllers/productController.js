const mongoose = require('mongoose');
const Product=require('../models/productModel')
const Category = require('../models/categoryModel');


// Add a product
async function addProduct (req, res)  {
    try {
        // Extract product details from the request body
        const { name, category, price, quantity } = req.body;

        // Validate if the category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ msg: 'Category not found' });
        }

        // Handle the uploaded image file
        const image = req.file ? `http://localhost:5002/uploads/${req.file.filename}` : null;

        // Create the new product
        const newProduct = new Product({
            name,
            category,
            price,
            quantity,
            image,
            // available: true, // Default availability
        });

        await newProduct.save();

        res.status(201).json({ msg: 'Product added successfully', product: newProduct });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};






// Get all products with optional filters
async function getAllProducts(req, res) {
    console.log("Fetching products with filters...");
    const { category, productName } = req.query; // Extract query parameters

    try {
        const query = {};

        // Apply category filter if provided
        if (category) {
            const categoryRegex = new RegExp(category, 'i'); // Case-insensitive regex
            const categoryMatch = await Category.findOne({ name: categoryRegex }); // Match category
            if (categoryMatch) {
                query.category = categoryMatch._id; // Use matched category's ID
            } else {
                return res.status(404).send({ message: 'No matching category found' });
            }
        }

        // Apply product name filter if provided
        if (productName) {
            query.name = new RegExp(productName, 'i'); // Case-insensitive regex
        }

        // Fetch products based on the query filters
        const result = await Product.find(query, { __v: 0 })
            .populate('category', 'name') // Populate category name
            .exec();

        // Check if any products were found
        if (result.length === 0) {
            return res.status(404).send({ message: 'No products found matching the search criteria' });
        }

        // Format the product data
        const modifiedProducts = result.map(product => ({
            id: product._id,
            name: product.name,
            image: product.image ? `${product.image}` : null,
            category: product.category ? product.category.name : 'N/A',
            price: product.price,
            // available: !!product.available,
            quantity: product.quantity,
        }));

        res.status(200).send(modifiedProducts); // Send the formatted product data
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send({ error: 'Failed to fetch products' });
    }
}




async function getWithQuery(req,res){
    console.log(req.query);
    // Category=req.query.CATEGORY,
    // Price=req.query.price
    try{
        // result=await Products.find({category:Category,price:Price});
        result=await Product.findById(req.params.id).populate('category');
        res.status(200).send(result);
    }
    catch(error){
        res.status(500).send(error);
    }
}

async function deleteProduct(req,res){
    // console.log(req.params.id);
    try{
        result=await Product.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: 'Product deleted successfully', task:result});
        console.log('Product deleted successfully');
    } catch(error){
        res.status(500).send(error);
    }
}


// async function updateProduct(req,res){
//     console.log(req.body); 
//     const productId = req.params.id;
//     const updateData = req.body;
// try{ 
//     result= await Products.findByIdAndUpdate(productId, updateData, { new: true });
//     res.status(200).send(result)
//     } catch(error){
//         res.status(500).send(error);
//     }
// }




async function updateProduct(req, res) {
    try {
        const { name, category, price, quantity } = req.body;

        console.log("Incoming request data:", req.body);

        // Find the product by ID
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        console.log("Existing product:", product);

        // If category is provided, validate if it exists
        if (category) {
            // Validate the category ID
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({ msg: 'Invalid category ID' });
            }

            // Check if the category exists
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({ msg: 'Category not found' });
            }

            product.category = category; // Update category
        }

        // Handle the uploaded image file
        if (req.file) {
            product.image = `http://localhost:5002/uploads/${req.file.filename}`;
        }

        // Update other product fields if provided
        if (name) product.name = name;
        if (price !== undefined) product.price = price;

        // Update quantity explicitly if sent in the request
        if (quantity !== undefined) {
            if (quantity < 0) {
                return res.status(400).json({ msg: 'Quantity cannot be negative.' });
            }
            product.quantity = quantity;
        }

        console.log("Updated product data before saving:", product);

        // Save the updated product
        await product.save();

        console.log("Final updated product:", product);

        res.status(200).json({
            message: "Product updated successfully",
            product,
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
}



module.exports={
    getAllProducts,
    addProduct,
    getWithQuery,
    deleteProduct,
    updateProduct
};
