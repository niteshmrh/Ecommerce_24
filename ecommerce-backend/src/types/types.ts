import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody{
    _id: string;
    name: string;
    email: string;
    photo: string;
    gender: string;
    dob: Date;
};

export interface NewProductRequestBody{
    name: string;
    category: string;
    price: Number;
    stock: Number;
};

export type ControllerType = (
    req: Request, 
    res: Response, 
    next: NextFunction
    ) => Promise< void | Response<any, Record<string, any>>>;


export type SearchRequestQuery = {
    search? : string;
    price? : string;
    category? : string;
    sort? : string;
    page? : string;
}