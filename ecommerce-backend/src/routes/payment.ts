import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { allCoupons, applyDiscount, createPaymentIntent, deleteCoupon, newCoupon } from "../controllers/payment.js";


const router = express.Router();

// route - /api/v1/payment/create
router.post("/create", createPaymentIntent);

// route - /api/v1/payment/discount
router.get("/discount", applyDiscount);

// route - /api/v1/payment/coupon/new
router.post("/coupon/new", adminOnly, newCoupon);

// route - /api/v1/payment/all
router.get("/coupon/all", adminOnly, allCoupons);

// route - /api/v1/payment/coupon/:id
router.delete("/coupon/:id", adminOnly, deleteCoupon);




export default router;