import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/users.js";
import { calculatePercentage, getChartData, getInventories } from "../utils/features.js";

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

        const revenue = allOrders.reduce((total, order)=> total+ (order.total || 0),0);

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

        const categoryCount = await getInventories({categories, productCount});

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
    let charts;
    const key = "admin-pie-charts";
    if(myCache.has(key)){
        charts = JSON.parse(myCache.get(key)!);
    }else{

        const allOrderPromise = Order.find({}).select(["total","discount","subtotal","tax","shippingCharges",]);

        const [
            processingOrder, 
            shippedOrder, 
            deliveredOrder,
            categories,
            productCount,
            outOfStock,
            allOrders,
            allUsers,
            adminUsers,
            customerUsers,
        ] =await Promise.all([
            Order.countDocuments({status: "Processing"}),
            Order.countDocuments({status: "Shipped"}),
            Order.countDocuments({status: "Delivered"}),
            Product.distinct("category"),
            Product.countDocuments(),
            Product.countDocuments({stock:0}),
            allOrderPromise,
            User.find({}).select(["dob"]),
            User.countDocuments({ role: "admin" }),
            User.countDocuments({ role: "user" }),
        ]);


        const orderFullfillment = {
            processing: processingOrder,
            shipped: shippedOrder,
            delivered: deliveredOrder,
        };

        const productsCategories = await getInventories({categories, productCount});

        const stockAvalibility = {
            inStock:productCount - outOfStock,
            outOfStock: outOfStock,
        }

        const grossIncome = allOrders.reduce((prev, order) => prev + (order.total || 0),0);
        const discount = allOrders.reduce((prev, order) => prev + (order.discount || 0),0);
        const productionCost = allOrders.reduce((prev, order) => prev + (order.shippingCharges || 0),0);
        const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
        const marketingCost = Math.round(grossIncome * (30 / 100));
        const netMargin =grossIncome - discount - productionCost - burnt - marketingCost;

        const revenueDistribution = {netMargin,discount,productionCost,burnt,marketingCost,};

        const usersAgeGroup = {
            teen: allUsers.filter((i) => i.age < 20).length,
            adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
            old: allUsers.filter((i) => i.age >= 40).length,
          };
      
        const adminCustomer = {
            admin: adminUsers,
            customer: customerUsers,
        };

        charts = {
            orderFullfillment,
            productsCategories,
            stockAvalibility,
            revenueDistribution,
            usersAgeGroup,
            adminCustomer,
        };

        myCache.set(key, JSON.stringify(charts));
    }

    return res.status(200).json({
        success : true,
        result : charts,
        message : "Pie Charts Data Successfully Fetched"
    })

})



export const getBarCharts  = TryCatch(async(req, res, next)=>{
    let charts;
    const key = 'admin-bar-charts';
    console.log("--------------------- get bar charts hit -------------------------");
    if(myCache.has(key)){
        charts = JSON.parse(myCache.get(key)!);
    }else{
        const today = new Date();
        
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);


        const sixMonthProductPromise = Product.find({
            createdAt: {
              $gte: sixMonthsAgo,
              $lte: today,
            },
          }).select("createdAt");
      
        const sixMonthUsersPromise = User.find({
            createdAt: {
              $gte: sixMonthsAgo,
              $lte: today,
            },
        }).select("createdAt");
      
        const twelveMonthOrdersPromise = Order.find({
            createdAt: {
              $gte: twelveMonthsAgo,
              $lte: today,
            },
        }).select("createdAt");
      
        const [
            products, 
            users, 
            orders
        ] = await Promise.all([
            sixMonthProductPromise,
            sixMonthUsersPromise,
            twelveMonthOrdersPromise,
        ]);

        const productCount = await getChartData({length:6, today, docArr:products});
        const usersCounts = await getChartData({ length: 6, today, docArr: users });
        const ordersCounts = await getChartData({ length: 12, today, docArr: orders });

        charts = {
            users: usersCounts,
            products: productCount,
            orders: ordersCounts,
        };
        myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({
        success : true,
        result : charts,
        message : "Bar Charts Data Successfully Fetched"
    })
})



export const  getLineCharts = TryCatch(async(req, res, next)=>{
    let charts;
    const key = 'admin-line-charts';

    if(myCache.has(key)){
        charts = JSON.parse(myCache.get(key)!);
    }else{
        const today = new Date();

        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);


        // const twelveMonthProductPromise = Product.find({
        //     createdAt: {
        //       $gte: twelveMonthsAgo,
        //       $lte: today,
        //     },
        //   }).select("createdAt");
      
        // const twelveMonthUsersPromise = User.find({
        //     createdAt: {
        //       $gte: twelveMonthsAgo,
        //       $lte: today,
        //     },
        // }).select("createdAt");
      
        // const twelveMonthOrdersPromise = Order.find({
        //     createdAt: {
        //       $gte: twelveMonthsAgo,
        //       $lte: today,
        //     },
        // }).select("createdAt");

        const baseQuery = {
            createdAt: {
                $gte: twelveMonthsAgo,
                $lte: today,
            },
        }
      
        const [
            products, 
            users, 
            orders
        ] = await Promise.all([
            // twelveMonthProductPromise,
            // twelveMonthUsersPromise,
            // twelveMonthOrdersPromise,
            Product.find(baseQuery).select("createdAt"),
            User.find(baseQuery).select("createdAt"),
            Order.find(baseQuery).select(["createdAt", "discount", "total"]),
        ]);

        const productCount = await getChartData({length:12, today, docArr:products});
        const usersCounts = await getChartData({ length: 12, today, docArr: users });
        const discount = await getChartData({length: 12,today,docArr: orders,property: "discount",});
        const revenue = await getChartData({length: 12,today,docArr: orders,property: "total",});

        charts = {
            users: usersCounts,
            products: productCount,
            discount,
            revenue,
        };
        myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({
        success : true,
        result : charts,
        message : "Line Charts Data Successfully Fetched"
    })
})
