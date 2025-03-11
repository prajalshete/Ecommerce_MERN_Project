const express = require('express');
// In your server.js or app.js
const path = require('path');


const bodyParser=require('body-parser');
const userRoutes=require('./routes/userRoutes');
const productRoutes=require('./routes/productRoutes');
const categoryRoutes=require('./routes/categoryRoutes');
const paymentRoutes = require('./routes/payment');
const {connectDB}=require('./config/db')


const app = express();

// app.get('/', (req, res) => {
//     res.status(200).send("hello world");
// })


//Middleware
app.use(express.json());
app.use(bodyParser.json());
// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const cors=require('cors');

app.use(cors())

//connection to mongodb
connectDB();

//app.use('/api',routesAPI);

app.use('/api/user',userRoutes);
app.use('/api/product',productRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api', paymentRoutes);
app.listen(5002, () => {
    console.log('server started');
})
