import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { userUrl } from "../reducer/store";
import { MessageResponse, userResponse } from "../../types/api-types";
import { User } from "../../types/types";
import axios from "axios";


export const userAPI = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({baseUrl: `${import.meta.env.VITE_BASE_URL+import.meta.env.VITE_USER_BASE_URL}`}),    // server/api/v1/user
    endpoints: (builder)=> ({
        login: builder.mutation<MessageResponse, User>({query: (user)=> ({
            url: "/new",
            method: "POST",
            body: user,
        })}),
    }),
});

export const getUser = async(id:string) => {
    try {
        const {data}:{data:userResponse} = await axios.get(`${import.meta.env.VITE_BASE_URL+import.meta.env.VITE_USER_BASE_URL}/${id}`);
        // const data :userResponse = res.data;
        return data;
    } catch (error) {
        throw error;
    }
}

export const { useLoginMutation } = userAPI;