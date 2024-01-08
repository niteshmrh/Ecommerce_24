import { TryCatch } from './../middlewares/error.js';
import { NewUserRequestBody } from './../types/types.js';
import { NextFunction, Request, Response } from "express";
import { User } from "../models/users.js";
import ErrorHandler from '../middlewares/utility-class.js';

export const newUser = TryCatch(
    async (
        req: Request<{},{},NewUserRequestBody>, 
        res:Response, 
        next:NextFunction
        )=>{
            const {_id, name, email, photo, dob, gender} = req.body;
            let user = await User.findById(_id);
            
            if(user){
                return res.status(200).json({
                    success: true,
                    message: `Welcome ${user.name}`,
                })
            }
            
            user = await User.create(
            {
               _id, 
                name, 
                email, 
                photo, 
                dob : new Date(dob), 
                gender
            });


            console.log("user controller", user);

            return res.status(200).json({
                success: true,
                message: `Welcome ${user.name}`,
            });
        }
    );