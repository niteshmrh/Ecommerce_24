import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/users.js";
import { calculatePercentage } from "../utils/features.js";

export const getDashboardStats  = TryCatch(async(req, res, next)=>{
    console.log("------------------ getDashboard hit -------------------------");
    let stats;
    if(myCache.has("admin-stats")){
        stats = JSON.parse(myCache.get("admin-stats")!);
    }else{
        const today = new Date();
        // const startOfThisMonths = new Date(today.getFullYear(), today.getMonth(), 1);
        // const startOfLastMonths = new Date(today.getFullYear(), today.getMonth()-1, 1);

        // const endOfThisMonths = new Date(today.getFullYear(), today.getMonth()+1, 0);
        // const endOfThisMonths = today;
        // const endOfLastMonths = new Date(today.getFullYear(), today.getMonth(), 0);

        const thisMonths = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end : today
        };

        const lastMonths = {
            start: new Date(today.getFullYear(), today.getMonth()-1, 1),
            end: new Date(today.getFullYear(), today.getMonth(), 0)
        }

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        // console.log(sixMonthsAgo);


        // product
        // await lagane pe ye parallel chalenege or huuuum isse kisi array me add krke series me bdl skte h
        const thisMonthProductsPromise = Product.find({
            createdAt:{
                $gte : thisMonths.start,
                $lte : thisMonths.end,
            },
        });

        const lastMonthProductsPromise = Product.find({
            createdAt:{
                $gte : lastMonths.start,
                $lte : lastMonths.end,
            },
        })

        // user
        const thisMonthUsersPromise = User.find({
            createdAt:{
                $gte : thisMonths.start,
                $lte : thisMonths.end,
            },
        });

        const lastMonthUsersPromise = User.find({
            createdAt:{
                $gte : lastMonths.start,
                $lte : lastMonths.end,
            },
        })

        //order
        const thisMonthOrdersPromise = Order.find({
            createdAt:{
                $gte : thisMonths.start,
                $lte : thisMonths.end,
            },
        });

        const lastMonthOrdersPromise = Order.find({
            createdAt:{
                $gte : lastMonths.start,
                $lte : lastMonths.end,
            },
        })


        // last six month order
        const lastSixMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today,
            },
        });

        const latestTransactionsPromise = Order.find({}).select(["orderItems", "discount", "total", "status"]).limit(4);

        const [thisMonthProducts,
            lastMonthProducts,
            thisMonthOrders,
            lastMonthOrders,
            thisMonthUsers,
            lastMonthUsers,
            productCount,
            userCount,
            allOrders,
            lastSixMonthOrders,
            categories,
            femaleUsersCount,
            latestTransaction,] = await Promise.all([
            thisMonthProductsPromise,
            lastMonthProductsPromise,
            thisMonthOrdersPromise,
            lastMonthOrdersPromise,
            thisMonthUsersPromise,
            lastMonthUsersPromise,
            Product.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("total"),
            lastSixMonthOrdersPromise,
            Product.distinct("category"),
            User.countDocuments({ gender: "female" }),
            latestTransactionsPromise,
        ]);


        const thisMonthRevenue = thisMonthOrders.reduce(
            (total, order)=> total+ (order.total || 0), 0
        );

        const lastMonthRevenue = lastMonthOrders.reduce(
            (total, order)=> total+ (order.total || 0), 0
        );

        const changePercent = {
            revenue : await calculatePercentage(thisMonthRevenue, lastMonthRevenue),
            product : await calculatePercentage(thisMonthProducts.length, lastMonthProducts.length),
            order : await calculatePercentage(thisMonthOrders.length, lastMonthOrders.length),
            user : await calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
        };

        const revenue = allOrders.reduce(
            (total, order)=> total+ (order.total || 0), 0
        );

        const count = {
            revenue : revenue,
            user : userCount,
            product : productCount,
            order : allOrders.length
        }

        const orderMonthCounts = new Array(6).fill(0);
        const orderMonthyRevenue = new Array(6).fill(0);

        lastSixMonthOrders.forEach((order) => {
            const creationDate = order.createdAt;
            const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

            if (monthDiff < 6) {
                orderMonthCounts[6 - monthDiff - 1] += 1;
                orderMonthyRevenue[6 - monthDiff - 1] += order.total;
            }
        });

        const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category }));

        const categoriesCount = await Promise.all(categoriesCountPromise);
        const categoryCount : Record<string, number>[] = [];

        categories.forEach((category, i) =>{
            categoryCount.push({
                [category!] : Math.round((categoriesCount[i]/ productCount)*100),
            })
        })


        const userRatio = {
            male : userCount - femaleUsersCount,
            female : femaleUsersCount
        }

        const modifiedLatestTransaction = latestTransaction.map((i) => ({
            _id: i._id,
            discount: i.discount,
            amount: i.total,
            quantity: i.orderItems.length,
            status: i.status,
          }));
      

        stats = {
            categoryCount,
            changePercent,
            count,
            charts:{
                order : orderMonthCounts,
                revenue : orderMonthyRevenue,
            },
            userRatio,
            latestTransaction : modifiedLatestTransaction,
        }
        myCache.set("admin-stats", JSON.stringify(stats));
    }

    return res.status(200).json({
        success : true,
        result : stats,
        message : "Dashboard Data Successfully Fetched"
    })
})



export const getPieCharts  = TryCatch(async(req, res, next)=>{
    
})



export const getBarCharts  = TryCatch(async(req, res, next)=>{
    
})



export const  getLineCharts = TryCatch(async(req, res, next)=>{
    
})
