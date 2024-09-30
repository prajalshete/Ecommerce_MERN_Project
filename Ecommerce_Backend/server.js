const express = require('express');
const bodyParser=require('body-parser');
const userRoutes=require('./routes/userRoutes');
const productRoutes=require('./routes/productRoutes');
const categoryRoutes=require('./routes/categoryRoutes');
const {connectDB}=require('./config/db')


const app = express();

// app.get('/', (req, res) => {
//     res.status(200).send("hello world");
// })


//Middleware
app.use(express.json());
app.use(bodyParser.json());



const cors=require('cors');

app.use(cors())

//connection to mongodb
connectDB();

//app.use('/api',routesAPI);

app.use('/api/user',userRoutes);
app.use('/api/product',productRoutes);
app.use('/api/category',categoryRoutes);

app.listen(5005, () => {
    console.log('server started');
})
