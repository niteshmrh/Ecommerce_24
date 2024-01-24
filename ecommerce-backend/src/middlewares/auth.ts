import { User } from "../models/users.js";
import { TryCatch } from "./error.js";
import ErrorHandler from "../utils/utility-class.js";

// middleware to make sure to only Admin is allowed.
export const adminOnly = TryCatch(async (req, res, next) =>{
    const {id} = req.query;
    if(!id){
        return next(new ErrorHandler("Unauthorize Access", 401));
    }

    // agr id h toh ? toh user dhundenge
    const user = await User.findById(id);
    if(!user){
        return next(new ErrorHandler("Unauthorize User", 401));
    }
    // check user is admin or not
    if(user.role !== "admin"){
        return next(new ErrorHandler("Unauthorize Rights", 403));
    }

    // if all is good;
    next();
});