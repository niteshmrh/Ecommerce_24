import express from "express";
import { connectDB } from "./utils/features.js";
import { ErrorMiddleware } from "./middlewares/error.js";
import userRoutes from "./routes/user.js";   //importing user routes
import productRoutes from "./routes/product.js";   //importing product routes
import NodeCache from "node-cache";   // it also stores data in ram as reddish did

const app = express();
const port =3000;

// mongo connection

connectDB();

export const myCache = new NodeCache();

app.use(express.json());

// health checking routes
app.get('/ecommerce_health', (req,res,next) => {
    res.send("Backend Working Fine");
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

app.use('/uploads', express.static("uploads"));
app.use(ErrorMiddleware);

app.listen(port, ()=>{
    console.log(`Server is working on http://localhost:${port}`);
})