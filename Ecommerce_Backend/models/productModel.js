const mongoose=require('mongoose');



const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    // category: { type: String, required: true },
    price: { type: Number, required: true },
    // available: { type: Boolean, default: true },
    quantity: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
  });


const Product=mongoose.model("Product",productSchema);
module.exports=Product;




// {
//     "name":"Samsung A50s",
//     "Discription":"fgcvhbjn fgcvhbjn fgvhbjn gvhbjn",
//     "category":"Mobile",
//     "price":25000,
//     "quantity":100
// }