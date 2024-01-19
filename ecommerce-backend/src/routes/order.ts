import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { singleupload } from "../middlewares/multer.js";
import { allOrders, myOrders, newOrder } from "../controllers/order.js";

const router = express.Router();


// api routes - /api/v1/order/new
router.post("/new", newOrder);

// api routes - /api/v1/order/my
router.get("/my", myOrders);

// api routes - /api/v1/order/all
router.get("/all", adminOnly, allOrders);




export default router;


