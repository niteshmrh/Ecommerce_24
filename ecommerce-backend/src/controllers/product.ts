import { TryCatch } from './../middlewares/error.js';
import { Product } from "../models/product.js";
import ErrorHandler from '../utils/utility-class.js';
import { NextFunction, Request, Response } from 'express';
import { NewProductRequestBody, SearchRequestQuery } from '../types/types.js';
import { rm } from 'fs';



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


    return res.status(201).json({
        success:  true,
        // result: product,
        message: `${product.name} Product Added Successfull with stock of ${stock}`,
        
    })
})





export const getLatestProducts = TryCatch(async (req, res, next) =>{
    console.log("-------------- get Latest product hit --------------------");

    const products = await Product.find({}).sort({createdAt : -1}).limit(5);

    return res.status(201).json({
        success:  true,
        result: products,
        message: `All Latest Product List`,
        count: products.length
    })
})


export const getAllCategories = TryCatch(async (req, res, next) =>{
    console.log("-------------- get Latest product hit --------------------");

    const categories = await Product.distinct("category");

    return res.status(201).json({
        success:  true,
        result: categories,
        message: `Categories List`,
        count: categories.length
    })
})



export const getAdminProduct = TryCatch(async (req, res, next) =>{
    console.log("-------------- get Admin product hit --------------------");

    const products = await Product.find({});

    return res.status(201).json({
        success:  true,
        result: products,
        message: `All Products Listed for Admin`,
        count: products.length
    })
})



export const getSingleProduct = TryCatch(async (req, res, next) =>{
    console.log("-------------- get Single product hit --------------------",req.params.id);

    const id = req.params.id;
    const product = await Product.findById(id);

    if(!product){
        return next(new ErrorHandler("Product Not Found", 404));
    }

    return res.status(201).json({
        success:  true,
        result: product,
        message: `${id} Details Fetched`,
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

    return res.status(201).json({
        success:  true,
        result: product,
        message: `${product.name} Deleted Successfull`,
    })
})



export const getAllProducts = TryCatch(async (req : Request<{}, {}, {}, SearchRequestQuery>, res, next) =>{
    console.log("-------------- get All product hit --------------------");

    const {search, sort, category, price} = req.query;
    const page = Number(req.query.page);

    const products = await Product.find({}).sort({createdAt : -1}).limit(5);

    return res.status(201).json({
        success:  true,
        result: products,
        message: `All Latest Product List`,
        count: products.length
    })
})