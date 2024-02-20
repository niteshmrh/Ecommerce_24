import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";


export const createPaymentIntent = TryCatch(async(req, res, next) =>{
    const { amount } = req.body;
    if(!amount){
        return next(new ErrorHandler("Please Enter Amount!!!", 400));
    }

    const paymentIntent = await stripe.paymentIntents.create({ 
        amount: Number(amount)*100, 
        currency:"inr", 
    });
    // console.log("-----------", paymentIntent);
    res.status(201).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
    });
});


export const newCoupon = TryCatch(async(req, res, next) =>{
    console.log("------------- new coupon hit --------------------")
    const {coupon, amount} = req.body;
    console.log(coupon+"-----------"+amount);
    if(!coupon || !amount){
        return next(new ErrorHandler("Please enter both coupon and amount", 400));
    }

    await Coupon.create({
        code : coupon,
        amount
    })

    res.status(201).json({
        success: true,
        message: `Coupon code ${coupon} created successfully`,
    });
});



export const applyDiscount = TryCatch(async(req, res, next) =>{
    const { coupon } = req.query;

    if(!coupon){
        return next(new ErrorHandler("Enter Coupon Code", 400));
    }
    const discount = await Coupon.findOne({code : coupon});

    if(!discount){
        return next(new ErrorHandler("Invalid Coupon Code", 400));        
    }
    res.status(201).json({
        success: true,
        discount: discount?.amount,
        message: `Coupon Code ${discount?.code} Applied`,
    });
});


export const allCoupons = TryCatch(async(req, res, next) =>{
    console.log("---------------- all coupon hits --------------")
    const allCoupon = await Coupon.find({});

    if(!allCoupon){
        return next(new ErrorHandler("No Coupon Found", 400));        
    }
    res.status(201).json({
        success: true,
        coupons: allCoupon,
        message: `All Coupon Code Fetched`,
    });
});


export const deleteCoupon = TryCatch(async(req, res, next) =>{
    console.log("------------- deleted coupon hit ---------------");
    const {id} = req.params;
    
    const coupon = await Coupon.findById(id);
    if(!coupon){
        return next(new ErrorHandler("Invalid Coupon Id", 400));        
    }
    await coupon.deleteOne();
    res.status(201).json({
        success: true,
        message: `Coupon ${coupon.code} Deleted Successfull`,
    });
});