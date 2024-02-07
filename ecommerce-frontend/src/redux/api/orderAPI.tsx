import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageResponse, MyOrderResponse, NewOrderRequest, OrderDetailsResponse, UpdateOrderRequest } from "../../types/api-types";



export const orderAPI = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({baseUrl: `${import.meta.env.VITE_BASE_URL+import.meta.env.VITE_ORDER_BASE_URL}`}),
    tagTypes: ["orders"],
    endpoints: (builder)=>({
        newOrder: builder.mutation<MessageResponse, NewOrderRequest>({query: (order)=>({
            url: "/new",
            method: "POST",
            body:order,
            }),
            invalidatesTags:["orders"],
        }),
        updateOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({query: ({userId, orderId})=>({
            url: `${orderId}?id=${userId}`,
            method: "PUT",
            }),
            invalidatesTags:["orders"],
        }),
        deleteOrder: builder.mutation<MessageResponse, UpdateOrderRequest>({query: ({userId, orderId})=>({
            url: `${orderId}?id=${userId}`,
            method: "DELETE",
            }),
            invalidatesTags:["orders"],
        }),
        myOrder: builder.query<MyOrderResponse, string>({query: (id)=>({
            url: `/my?id=${id}`,
            method: "GET",
            }),
            providesTags:["orders"],
        }),
        allOrder: builder.query<MyOrderResponse, string>({query: (id)=>({
            url: `/all?id=${id}`,
            method: "GET",
            }),
            providesTags:["orders"],
        }),
        orderDetails: builder.query<OrderDetailsResponse, string>({query: (id)=>({
            url: id,
            method: "GET",
            }),
            providesTags:["orders"],
        }),
    }),
});




export const {useNewOrderMutation, useAllOrderQuery, useDeleteOrderMutation, useMyOrderQuery, useOrderDetailsQuery, useUpdateOrderMutation} = orderAPI;