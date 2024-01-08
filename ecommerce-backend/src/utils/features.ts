import mongoose from "mongoose";


// mongoose.connect(url, option(dbName)).then((var)=>operations on c)

export const connectDB = ()=>{
    mongoose.connect("mongodb://localhost:27017",{
        dbName:"Ecommerce_24"
    }).then((c)=> console.log(`Mongo DB is Connected to ${c.connection.host}`)).catch((e)=> {
        console.log(e);
    });
}