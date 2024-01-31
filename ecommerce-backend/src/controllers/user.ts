import { TryCatch } from './../middlewares/error.js';
import { NewUserRequestBody } from './../types/types.js';
import { NextFunction, Request, Response } from "express";
import { User } from "../models/users.js";
import ErrorHandler from '../utils/utility-class.js';


// create new user
export const newUser = TryCatch(
    async (
        req: Request<{},{},NewUserRequestBody>, 
        res:Response, 
        next:NextFunction
        )=>{
            console.log("Create new User Hits");
            const {_id, name, email, photo, dob, gender} = req.body;
            
            let user = await User.findById(_id);
            
            if(user){
                return res.status(200).json({
                    success: true,
                    message: `Welcome ${user.name}`,
                })
            }

            if(!_id || !name || !email || !photo || !dob || !gender){
                return next(new ErrorHandler('Please add all feilds', 400));
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


// get all users
export const getAllUsers = TryCatch(async (req, res, next) =>{
    console.log("All users fetch hits");
    const users = await User.find({});
    return res.status(200).json({
        success: true,
        result: users,
        message:"All Users SuccessFully Fetched"
    })
});


// get particular user
export const getUser = TryCatch(async (req, res, next) =>{
    console.log("One user fetch hits");
    const id = req.params.id;
    const user = await User.findById(id);

    if(!user){
        return next(new ErrorHandler("No User Found", 400));
    }
    return res.status(200).json({
        success: true,
        user,
        message:"User Data SuccessFully Fetched"
    })
});


// delete particular user
export const deleteUser = TryCatch(async (req, res, next) =>{
    console.log("One user delete hits");
    const id = req.params.id;
    const user = await User.findById(id);

    if(!user){
        return next(new ErrorHandler("No User Found", 400));
    }

    await user.deleteOne();

    return res.status(200).json({
        success: true,
        result: "",
        message:"User Deleted SuccessFully"
    })
});