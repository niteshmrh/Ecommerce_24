import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer-types";
import { CartItems, ShippingInfo } from "../../types/types";


const initialState: CartReducerInitialState = {
    loading: false,
    cartItems: [],
    subtotal: 0,
    tax: 0,
    shippingCharges: 0,
    discount: 0,
    total: 0,
    shippingInfo: { address:"", city:"", state:"", country:"", pinCode:0 },
};

export const cartReducer = createSlice({
    name: "cartReducer",
    initialState,
    reducers:{
        addToCart : (state, action: PayloadAction<CartItems>) =>{
            state.loading = true;

            const index = state.cartItems.findIndex((i) => i.productId === action.payload.productId);
            if(index !== -1) state.cartItems[index] = action.payload
            else state.cartItems.push(action.payload);
            state.loading = false;
        },
        removeCartItem : (state, action: PayloadAction<string>) =>{
            state.loading = true;
            state.cartItems = state.cartItems.filter(i => i.productId !== action.payload);
            state.loading = false;
        },
        calculatePrice : (state) =>{
            // let subtotal = 0;
            // for(let i=0; i<state.cartItems.length; i++){
            //     subtotal += state.cartItems[i].price * state.cartItems[i].quantity;
            // }
            const subtotal = state.cartItems.reduce((total, item)=> total + item.price*item.quantity,0);

            state.subtotal = subtotal;
            state.shippingCharges = subtotal > 1000 ? 0 : 200;
            state.tax = Math.round(subtotal * 0.18);
            state.total = state.subtotal + state.shippingCharges + state.tax - state.discount;
        },
        discountApplied: (state, action: PayloadAction<number>) => {
            state.discount = action.payload;
        },
        saveShippingInfo : (state, action: PayloadAction<ShippingInfo>) => {
            state.shippingInfo = action.payload;
        },
        resetCart : ()=>{
            initialState
        },
    }
});


export const {addToCart, removeCartItem, calculatePrice, discountApplied, saveShippingInfo, resetCart } = cartReducer.actions;