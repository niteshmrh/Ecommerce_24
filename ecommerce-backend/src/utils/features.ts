import mongoose from "mongoose";
import { OrderItemType, invalidateCacheProps } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";


// mongoose.connect(url, option(dbName)).then((var)=>operations on c)

export const connectDB = (uri: string)=>{
    mongoose.connect(uri,{
        dbName:"Ecommerce_24"
    }).then((c)=> console.log(`Mongo DB is Connected to ${c.connection.host}`)).catch((e)=> {
        console.log(e);
    });
}

// delete from the cache memory when changes added in new, update products
export const invalidatesCache = async ({product, order, admin} : invalidateCacheProps) =>{
    if(product){
        const productKeys : string[] = ["latest-products", "categories", "all-products"];
        // find id of all product for deleted particular product from the cache memory
        const products = await Product.find({}).select("_id");
        products.forEach(i => {
            productKeys.push(`product-${i._id}`);
            
        });

        myCache.del(productKeys);
    }
    
    if(order){

    }

    if(admin){

    }
};


export const reduceStock = async(orderItems: OrderItemType[]) =>{
    
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if(!product){
            throw new Error("Product Not Found");
        }

        product.stock -= order.quantity;
        await product.save();
    }
};