import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { addProduct, deleteSingleProduct, getAdminProduct, getAllCategories, getAllProducts, getLatestProducts, getSingleProduct, updateProduct } from "../controllers/product.js";
import { singleupload } from "../middlewares/multer.js";

const router = express.Router();


router.post('/new',adminOnly, singleupload, addProduct);

router.get('/latest',getLatestProducts);

router.get('/all',getAllProducts);   // to get all product with filter

router.get('/categories',getAllCategories);

router.get('/admin-products',getAdminProduct);

router.route('/:id').get(getSingleProduct).put(adminOnly, singleupload, updateProduct).delete(adminOnly, deleteSingleProduct);




export default router;