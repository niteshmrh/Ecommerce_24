import express from "express";
import userRoutes from "./routes/user.js";   //importing user routes
import { connectDB } from "./utils/features.js";
import { ErrorMiddleware } from "./middlewares/error.js";

const app = express();
const port =3000;

// mongo connection

connectDB();

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

// using routes
app.use('/api/v1/user', userRoutes);

app.use(ErrorMiddleware);

app.listen(port, ()=>{
    console.log(`Server is working on http://localhost:${port}`);
})