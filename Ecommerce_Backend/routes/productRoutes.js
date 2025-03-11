const express = require('express');
const productControllers=require('../controllers/productController')
const authorize = require('../middleware/authorize')
const upload = require('../middleware/multer');

// const userControllers=require('../controllers/userController')
const router=express.Router();



// router.get('/getAllProducts',productControllers.getAllProducts);
router.post('/addProduct', authorize.auth,authorize.admin, upload.single('image'), productControllers.addProduct);


// http://localhost:5005/api/getAllProducts

router.get('/getWithQuery/:id',productControllers.getWithQuery);



// router.get('/getByCategory')
// router.get('/getByName')

// http://localhost:5005/api//deleteproduct/:id

 router.delete('/deleteproduct/:id',productControllers.deleteProduct)

//    http://localhost:5005/api/updateProduct

 router.patch('/updateProduct/:id',upload.single('image'), productControllers.updateProduct);

//  http://localhost:5005/api/registeruser
// router.post('/registeruser',userControllers.registeruser);


// http://localhost:5005/api/loginuser
// router.post('/loginuser',userControllers.loginuser);


// router.get('/getProductsWithAuth', authorize.auth, productControllers.getAllProducts);

router.get('/getProductsWithAuth', productControllers.getAllProducts);

// Route to get products with optional search filters
router.get('/search', productControllers.getAllProducts);
module.exports=router;