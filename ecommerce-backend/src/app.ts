import express from "express";
import { connectDB } from "./utils/features.js";
import { ErrorMiddleware } from "./middlewares/error.js";
import userRoutes from "./routes/user.js";   //importing user routes
import productRoutes from "./routes/product.js";   //importing product routes
import orderRoutes from "./routes/order.js";   //importing product routes
import paymentRoutes from './routes/payment.js';   // importing payment routes
import adminRoutes from './routes/stats.js';  // importing admin stats routes
import NodeCache from "node-cache";   // it also stores data in ram as reddish did
import { config } from "dotenv";    // dotenv configuration
import bodyParser from 'body-parser';
import morgan from "morgan";
import Stripe from "stripe";


config({
    path: "./.env"
})

const app = express();
const port =process.env.PORT || 3000;
const mongoURI = process.env.MONGO_DB_PARAMETERS || "";
const stripeKey = process.env.STRIPE_KEY || "";
// mongo connection

connectDB(mongoURI);

export const stripe = new Stripe(stripeKey);
export const myCache = new NodeCache();

// to take the request in the form of json
app.use(express.json());
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb",  extended: true, parameterLimit: 1000000 }));


// middle where which gives the api name which hit and req type and time takes to exe
app.use(morgan("dev"));

// health checking routes
app.get('/ecommerce_health', (req,res,next) => {
    res.send("Backend Working Fine with health of 100%");
});

app.get("/",(req, res, next)=>{
    res.status(200).json({
        status: 200,
        message: "Backend working fine",
    });
});

// using routes -> user route
app.use('/api/v1/user', userRoutes);

// using routes -> product route
app.use('/api/v1/product', productRoutes);

// using routes -> order route
app.use('/api/v1/order', orderRoutes);

// using routes -> payment route
app.use('/api/v1/payment', paymentRoutes);

// using routes -> Admin stats route
app.use('/api/v1/dashboard', adminRoutes);

app.use('/uploads', express.static("uploads"));
app.use(ErrorMiddleware);

// server on
app.listen(port, ()=>{
    console.log(`Server is working on http://localhost:${port}`);
})

// handling when server got crashed
process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node Not Existing.....");
    // console.log("Node Not Exiting...", err.message.split(":")[1].toUpperCase());
});