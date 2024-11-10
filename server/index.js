const express=require('express')
const dbConnection=require('./db')
const cors=require('cors');
const categoryRoutes = require("./route/category_route");
const path = require("path");
const deliveryWorkersRoutes = require("./route/deliveryworkers_route");
const productRoutes = require("./route/product_route");
const expertRoutes = require("./route/expert_route");
const queryRoutes = require("./route/queryRoutes");
require("dotenv").config();


const app=express()

const PORT=5000

app.use(express.json())
app.use(cors());


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

dbConnection()


app.use('/api/admin',require('./route/adminRoute'));

app.use("/api/users", require("./route/user_route"));
app.use("/api/experts", expertRoutes);
app.use("/api/products", productRoutes);
app.use("/api/deliveryworkers", deliveryWorkersRoutes);
app.use('/api', categoryRoutes);  
app.use("/api/deliveryworkers", require("./route/deliveryworkers_route"));
app.use("/api/categories", require("./route/category_route"));
app.use('/api/cart', require("./route/cartRoutes"));


app.use('/api/payment', require("./route/paymentRoutes"));
app.use('/api/order', require("./route/orderRoutes"));
app.use("/api/queries", queryRoutes);


app.listen(PORT,()=>{
    console.log(`Server is listening on port: ${PORT}`)
})