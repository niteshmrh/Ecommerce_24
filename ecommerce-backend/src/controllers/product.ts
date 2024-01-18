import { TryCatch } from './../middlewares/error.js';
import { Product } from "../models/product.js";
import ErrorHandler from '../utils/utility-class.js';
import { NextFunction, Request, Response } from 'express';
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from '../types/types.js';
import { rm } from 'fs';
import { myCache } from '../app.js';
import { invalidatesCache } from '../utils/features.js';


// revalidate on new, update, delete product and order product -> stock management
export const getLatestProducts = TryCatch(async (req, res, next) =>{
    console.log("-------------- get Latest product hit --------------------");
    
    let products;
    if(myCache.has("latest-products")){                            // check data in cache 
        products = JSON.parse(myCache.get("latest-products")!);   // getting data from cache
    }else{
        products = await Product.find({}).sort({createdAt : -1}).limit(5);
        myCache.set("latest-products", JSON.stringify(products));   // set data in cache
    }

    return res.status(201).json({
        success:  true,
        result: products,
        message: `All Latest Product List`,
        count: products.length
    })
})


// revalidate on new, update, delete product and order product -> stock management
export const getAllCategories = TryCatch(async (req, res, next) =>{
    console.log("-------------- get Latest product hit --------------------");
    
    let categories;
    if(myCache.has("categories")){
        categories= JSON.parse(myCache.get("categories") as string);
    }else{
        categories = await Product.distinct("category");
        myCache.set("categories", JSON.stringify(categories));
    }

    return res.status(201).json({
        success:  true,
        result: categories,
        message: `Categories List`,
        count: categories.length
    })
})


// revalidate on new, update, delete product and order product -> stock management
export const getAdminProduct = TryCatch(async (req, res, next) =>{
    console.log("-------------- get Admin product hit --------------------");
    let products;
    if(myCache.has("all-products")){
        products = JSON.parse(myCache.get("all-products") as string);
    }else{
        products = await Product.find({});
        myCache.set("all-products", JSON.stringify(products));
    }

    return res.status(201).json({
        success:  true,
        result: products,
        message: `All Products Listed for Admin`,
        count: products.length
    })
})



export const getSingleProduct = TryCatch(async (req, res, next) =>{
    console.log("-------------- get Single product hit --------------------",req.params.id);
    
    let product;
    const id = req.params.id;
    if(myCache.has(`product-${id}`)){
        product = JSON.parse(myCache.get(`product-${id}`) as string);
    }else{
        product = await Product.findById(id);
        if(!product){
            return next(new ErrorHandler("Product Not Found", 404));
        }
    }
    myCache.set(`product-${id}`, JSON.stringify(product));

    return res.status(201).json({
        success:  true,
        result: product,
        message: `${id} Details Fetched`,
    })
})


export const addProduct = TryCatch(async (
    req: Request<{},{},NewProductRequestBody>, 
    res: Response,
    next: NextFunction
    ) =>{
    console.log("-------------- add product hit --------------------");

    const {name, category, price, stock} = req.body;
    const photo = req.file;

    if(!photo){
        return next(new ErrorHandler("Please Add Photo", 400));
    }

    if(!name || !category || !price || !stock){
        
        rm(photo.path, ()=>{
            console.log("Photo deleted");
        })
        return next(new ErrorHandler("Add Feilds are Reqired", 400));
    }


    let product = await Product.create({
        name, 
        category: category.toLowerCase(), 
        price, 
        stock,
        photo: photo?.path
    }) 

    await invalidatesCache({product : true});

    return res.status(201).json({
        success:  true,
        // result: product,
        message: `${product.name} Product Added Successfull with stock of ${stock}`,
        
    })
})


export const updateProduct = TryCatch(async (req, res, next) =>{
        console.log("-------------- single update product hit --------------------");
        
        const { id } = req.params;
        const {name, category, price, stock} = req.body;
        const photo = req.file;
        const product = await Product.findById(id);

        if(!product){
            return next(new ErrorHandler("Product Not Found", 404));
        }

        if(photo){
            rm(product.photo!, ()=>{
                console.log("Old Photo deleted");
            })
            product.photo = photo.path;
        }

        if(name) product.name = name;
        if(category) product.category = category.toLowerCase();
        if(price) product.price = price;
        if(stock) product.stock = stock;


        let saveMongo = await product.save();

        await invalidatesCache({product : true});

        if(saveMongo){
            return res.status(201).json({
                success:  true,
                // result: product,
                message: `${product.name} Product Updated Successfull with stock of ${stock}`, 
            })
        }

    return res.status(202).json({
        success:  false,
        // result: product,
        message: `${product.name} Product Not Updated`, 
    })
})




export const deleteSingleProduct = TryCatch(async (req, res, next) =>{
    console.log("-------------- delete Single product hit --------------------");

    const id = req.params.id;
    const product = await Product.findById(id);

    if(!product){
        return next(new ErrorHandler("Product Not Found", 404));
    }

    rm(product.photo!, ()=>{
        console.log("Product Photo deleted");
    })
    await Product.deleteOne();
    await invalidatesCache({product : true});

    return res.status(201).json({
        success:  true,
        result: product,
        message: `${product.name} Deleted Successfull`,
    })
})



export const getAllProducts = TryCatch(async (req : Request<{}, {}, {}, SearchRequestQuery>, res, next) =>{
    console.log("-------------- get All product hit --------------------");

    const {search, sort, category, price} = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8 ;
    const skip = limit * (page-1);

    const baseQuery : BaseQuery = {};

    if(search){
        baseQuery.name = {
            $regex : search,
            $options : "i",
        };
    }
    if(price){
        baseQuery.price = {
            $lte : Number(price),
        }
    }
    if(category){
        baseQuery.category = category;
    }

    console.log("***************************",baseQuery);
    // await here working here in parllel wise here   ('_')
    const [products, filterOnlyProduct] = await Promise.all([
        Product.find(baseQuery).sort(sort && {price : sort === "asc"  ? 1 : -1}).limit(limit).skip(skip),
        Product.find(baseQuery)
    ])
    
    // await works in series wise here (one by one) ---------------------------- :)
    // const products = await Product.find(baseQuery).sort(sort && {price : sort === "asc"  ? 1 : -1}).limit(limit).skip(skip);,
    // const filterOnlyProduct = await Product.find(baseQuery);
    
    const totalPage = Math.ceil(filterOnlyProduct.length/limit);

    return res.status(201).json({
        success:  true,
        result: products,
        message: `All Latest Product List`,
        totalPages : totalPage,
        count: products.length
    })
})