const mongoose=require('mongoose');

async function connectDB(){
    try{
 await mongoose.connect("mongodb+srv://prajalshete:jKRpzNiiUuUWstGg@cluster0.uqq0bh6.mongodb.net/Ecommerce")
console.log("connect to MongoDB");    
}
    catch(error){
        console.log("Erroe in Connection",error);
    }
}
module.exports={connectDB};