const express = require('express');
const productControllers=require('../controllers/productController')
const authorize = require('../middleware/authorize')
const upload = require('../middleware/multer');

// const userControllers=require('../controllers/userController')
const router=express.Router();



// router.get('/getAllProducts',productControllers.getAllProducts);
router.post('/addProduct', authorize.auth,authorize.admin, upload.single('image'), productControllers.addProduct);


// http://localhost:5005/api/getAllProducts

router.get('/getWithQuery',productControllers.getWithQuery);



// router.get('/getByCategory')
// router.get('/getByName')

// http://localhost:5005/api//deleteproduct/:id

 router.delete('/deleteproduct/:id',productControllers.deleteProduct)

//    http://localhost:5005/api/updateProduct

 router.put('/updateProduct/:id',productControllers.updateProduct);

//  http://localhost:5005/api/registeruser
// router.post('/registeruser',userControllers.registeruser);


// http://localhost:5005/api/loginuser
// router.post('/loginuser',userControllers.loginuser);


router.get('/getProductsWithAuth', authorize.auth, productControllers.getAllProducts);


module.exports=router;