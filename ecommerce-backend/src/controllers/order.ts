import { TryCatch } from './../middlewares/error.js';
import ErrorHandler from '../utils/utility-class.js';
import { NextFunction, Request, Response } from 'express';
import { myCache } from '../app.js';
import { invalidatesCache, reduceStock } from '../utils/features.js';
import { NewOrderRequestBody } from '../types/types.js';
import { Order } from '../models/order.js';
import { Product } from '../models/product.js';


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
        orders = await Order.find().populate("user", "name");
        myCache.set("all-orders", JSON.stringify(orders));
    }
    

    res.status(200).json({
        success: true,
        result: orders,
        message : "Admin All Orders",
    })

});


export const getSingleOrders = TryCatch( async(req, res, next)=>{

    console.log("-------------- get Single Order hit -----------------");
    const { id } = req.params;

    if(!id){
        return next(new ErrorHandler("Order id Required!!!", 404));
    }

    let order;

    if(myCache.has(`order-${id}`)){
        order = JSON.parse(myCache.get(`order-${id}`)!)
    }else{
        order = await Order.findById(id).populate("user", "name");
        if(!order){
            return next(new ErrorHandler("Order Not Found!!!", 404));
        }
        myCache.set(`order-${id}`, JSON.stringify(order));
    }
    

    res.status(200).json({
        success: true,
        result: order,
        message : "Your Orders",
    })

});

export const newOrder = TryCatch( async(req:Request<{}, {}, NewOrderRequestBody>, res:Response, next:NextFunction)=>{

    console.log("-------------- new Order hit -----------------");

    const {shippingInfo, orderItems, user, subTotal, tax, discount, total, shippingCharges, status} = req.body;

    if(!shippingInfo || !orderItems || !user || !subTotal || !tax || !total){
        return next(new ErrorHandler("All Feild are required", 400));
    }

    for(let i=0; i<orderItems.length; i++){
        const findProduct = await Product.findById(orderItems[i].productId);
        if(!findProduct){
            return next(new ErrorHandler("Product Not Found", 400));
        }
    }

    const order = await Order.create({
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
    await invalidatesCache({
        product : true, 
        order : true, 
        admin: true, 
        userId: user, 
        productId: order.orderItems.map((i) =>String(i.productId)),
    });

    res.status(200).json({
        success: true,
        message : "Order Placed Successfully",
        thankYou: "Thank you!! Visit Again",
    })

});



export const processOrder = TryCatch( async(req, res, next)=>{

    console.log("-------------- Process Order hit -----------------");
    const {id} = req.params;
    const order = await Order.findById(id);

    if(!order){
        return next(new ErrorHandler("Order Not Found!!!", 404));
    }

    switch (order.status) {
        case "Processing":
            order.status ="Shipped";
            break;
        case "Shipped":
            order.status ="Delivered";
            break;
        default:
            order.status ="Delivered";
            break;
    }
    
    await order.save();
    await invalidatesCache({product: false, order: true, admin: true, userId: order.user, orderId: String(order._id)});

    res.status(200).json({
        success: true,
        message : "Order Placed Forward Successfully",
        thankYou: "Thank you ! Visit Again",
    })

});


export const deleteOrder = TryCatch( async(req, res, next)=>{

    console.log("-------------- Process Order hit -----------------");
    const {id} = req.params;
    const order = await Order.findById(id);

    if(!order){
        return next(new ErrorHandler("Order Not Found!!!", 404));
    }

    await order.deleteOne();
    
    await invalidatesCache({product: false, order: true, admin: true, userId: order.user, orderId: String(order._id)});

    res.status(200).json({
        success: true,
        message : "Order Deleted Successfully",
        thankYou: "Thank you ! Visit Again",
    })

});
