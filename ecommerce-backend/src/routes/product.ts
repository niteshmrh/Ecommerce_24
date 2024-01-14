import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { addProduct } from "../controllers/product.js";
import { singleupload } from "../middlewares/multer.js";

const router = express.Router();


router.post('/new',singleupload, addProduct);


export default router;