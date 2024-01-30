import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";


// export const server = import.meta.env.VITE_BASE_URL;
// export const userUrl = server+import.meta.env.VITE_USER_BASE_URL;
// export const productUrl = server+import.meta.env.VITE_PRODUCT_BASE_URL;
// export const orderUrl = server+import.meta.env.VITE_ORDER_BASE_URL;
// export const paymentUrl = server+import.meta.env.VITE_PAYMENT_BASE_URL;
// export const adminUrl = server+import.meta.env.VITE_ADMIN_BASE_URL;

export const store = configureStore({
    reducer : {
        [userAPI.reducerPath]: userAPI.reducer,
        [userReducer.name]: userReducer.reducer,
    },
    middleware : (mid)=>[
        ...mid(),
        userAPI.middleware,
    ],
});

export type RootState = ReturnType<typeof store.getState>;