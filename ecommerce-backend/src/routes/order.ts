import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { singleupload } from "../middlewares/multer.js";
import { newOrder } from "../controllers/order.js";

const router = express.Router();

router.post("/new", newOrder);




export default router;


