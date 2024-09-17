const Product=require('../models/productModel')

async function addProduct(req,res){
    console.log("req.body getAllPoduct****",req.body);
    console.log("req.file:", req.file); // Log file to ensure multer is working correctly
    try{

 // Check if `req.user` exists (especially if using authentication)
//  if (!req.user || !req.user.id) {
//     return res.status(401).send({ message: "User not authenticated" });
// }


// Check if the user is an admin
if (req.user.role !== 'admin') { // Assuming 'role' field in user object
    return res.status(403).send({ message: "Access denied" });
}

    // const newProduct=new Products(req.body);

 // Extract data from request body
 const { name, category, price, available, quantity } = req.body;
 // Handle file upload
 const image = req.file ? req.file.filename : null;

    product = new Product({
        name,
        image,
        category,
        price,
        available,
        quantity,
        createdBy: req.user.id,
    });

    
    const result= await product.save();
    res.status(200).send({message:"product added successfully",task:result})
    } catch(error){
        res.status(500).send(error);
    }
}



async function getAllProducts(req,res){
    console.log("********")
    try{
    result=await Product.find({},{__v:0});
    console.log(result);

    const modifiedProducts = result.map(product => ({
        id: product._id,
        name:product.name,
        productImage: product.image ? `http://localhost:5002/uploads/${product.image}` : null,
        category:product.category,
        price:product.price,
        // availability:product.available ? 'InStock' : 'OutOfStock',
        // quantity:product.quantity,
      }));
  
    res.status(200).send( modifiedProducts);
    // res.send('hello')
}catch(error){
    res.status(500).send(error);
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


async function updateProduct (req, res)  {
    try {
        const { name, category, price, availability, quantity } = req.body;

        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        product.name = name || product.name;
        product.category = category || product.category;
        product.price = price || product.price;
        product.available = available !== undefined ? available : product.available;
        product.quantity = quantity || product.quantity;

        await product.save();
        res.status(200).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};




module.exports={
    getAllProducts,
    addProduct,
    getWithQuery,
    deleteProduct,
    updateProduct
};
