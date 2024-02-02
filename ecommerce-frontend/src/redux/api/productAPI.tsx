import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DeleteProductRequest, MessageResponse, NewProductRequest, ProdutsResponse, SearchProductsRequest, UpdateProductRequest, allProdutsResponse, categoriesResponse, searchProdutsResponse } from "../../types/api-types";
// import { Product } from "../../types/types";


export const productAPI = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({baseUrl: `${import.meta.env.VITE_BASE_URL+import.meta.env.VITE_PRODUCT_BASE_URL}`}),
    tagTypes: ["product"],
    endpoints: (builder) =>({
            latestProduct: builder.query<allProdutsResponse, string>({query: ()=>({
                url: "/latest",
                method: "GET",
                }),
                providesTags:["product"],
            }),
            allProduct: builder.query<allProdutsResponse, string>({query: (id)=>({
                    url: `/admin-products/?id=${id}`,
                    method: "GET",
                }),
                providesTags:["product"],
            }),
            categories: builder.query<categoriesResponse, string>({query: ()=>({
                    url: "/categories",
                    method: "GET",
                }),
                providesTags:["product"],
            }),
            searchProduct: builder.query<searchProdutsResponse, SearchProductsRequest>(
                {query: ({search, sort, price, category, page})=>{
                    let searchQuery = `/all?search=${search}&page=${page}`;
                    if(price) searchQuery += `&price=${price}`;
                    if(sort) searchQuery += `&sort=${sort}`;
                    if(category) searchQuery += `&category=${category}`;
                    
                    return searchQuery;
                },
                providesTags:["product"],
            }),
            productDetails: builder.query<ProdutsResponse, string>({query: (id)=>({
                    url: id,
                    method: "GET",
                }),
                providesTags:["product"],
            }),
            newProduct: builder.mutation<MessageResponse, NewProductRequest>({query: ({formData, id})=>({
                    url: `/new?id=${id}`,
                    method: "POST",
                    body: formData,
                }),
                invalidatesTags:["product"],
            }),
            updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({query: ({formData, adminId, productId})=>({
                    url: `/${productId}?id=${adminId}`,
                    method: "PUT",
                    body: formData,
                }),
                invalidatesTags:["product"],
            }),
            deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({query: ({adminId, productId})=>({
                    url: `/${productId}?id=${adminId}`,
                    method: "DELETE",
                }),
                invalidatesTags:["product"],
            }),
    }),
});


export const { 
    useLatestProductQuery, 
    useAllProductQuery, 
    useCategoriesQuery, 
    useSearchProductQuery, 
    useNewProductMutation,
    useProductDetailsQuery,
    useUpdateProductMutation, 
    useDeleteProductMutation,   
} = productAPI;