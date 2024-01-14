import { TryCatch } from './../middlewares/error.js';
import { Product } from "../models/product.js";
import ErrorHandler from '../utils/utility-class.js';
import { NextFunction, Request, Response } from 'express';
import { NewProductRequestBody } from '../types/types.js';



export const addProduct = TryCatch(async (
    req: Request<{},{},NewProductRequestBody>, 
    res: Response,
    next: NextFunction
    ) =>{
    console.log("-------------- add product called --------------------");

    const {name, category, price, stock} = req.body;
    const photo = req.file;


    let product = await Product.create({
        name, 
        category: category.toLowerCase(), 
        price, 
        stock,
        photo: photo?.path
    }) 


    res.status(201).json({
        success:  true,
        // result: product,
        message: `${product.name} Product Added Successfull`,
        
    })
})