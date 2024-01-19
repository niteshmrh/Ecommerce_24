import { TryCatch } from './../middlewares/error.js';
import ErrorHandler from '../utils/utility-class.js';
import { NextFunction, Request, Response } from 'express';
import { myCache } from '../app.js';
import { invalidatesCache, reduceStock } from '../utils/features.js';
import { NewOrderRequestBody } from '../types/types.js';
import { Order } from '../models/order.js';



export const newOrder = TryCatch( async(req:Request<{}, {}, NewOrderRequestBody>, res:Response, next:NextFunction)=>{

    console.log("-------------- new Order hit -----------------");

    const {shippingInfo, orderItems, user, subTotal, tax, discount, total, shippingCharges, status} = req.body;

    if(!shippingInfo || !orderItems || !user || !subTotal || !tax || !total){
        return next(new ErrorHandler("All Feild are required", 400));
    }
    await Order.create({
        shippingInfo, 
        orderItems, 
        user, 
        subTotal, 
        tax, 
        discount, 
        total, 
        shippingCharges, 
        status
    })

    await reduceStock(orderItems);
    await invalidatesCache({product : true, order : true, admin: true});

    res.status(200).json({
        success: true,
        message : "Order Placed Successfully",
        thankYou: "Thank you ! Visit Again",
    })

});



export const myOrders = TryCatch( async(req, res, next)=>{

    console.log("-------------- my Order hit -----------------");
    const {id: user} = req.query;

    if(!user){
        return next(new ErrorHandler("User id Required", 404));
    }

    let orders = [];

    if(myCache.has(`my-order-${user}`)){
        orders = JSON.parse(myCache.get(`my-order-${user}`)!)
    }else{
        orders = await Order.find({user})
        myCache.set(`my-order-${user}`, JSON.stringify(orders));
    }
    

    res.status(200).json({
        success: true,
        result: orders,
        message : "Your Orders",
    })

});




export const allOrders = TryCatch( async(req, res, next)=>{

    console.log("-------------- all Order hit only for admin-----------------");

    let orders = [];

    if(myCache.has("all-orders")){
        orders = JSON.parse(myCache.get("all-orders")!)
    }else{
        orders = await Order.find();
        myCache.set("all-orders", JSON.stringify(orders));
    }
    

    res.status(200).json({
        success: true,
        result: orders,
        message : "Admin All Orders",
    })

});