export type User = {
    name: string,
    email: string,
    photo: string,
    gender: string,
    role: string,
    dob: string,
    _id: string,
};

export type Product = {
    _id: string,
    name: string,
    photo: string,
    price: number,
    stock: number,
    category: string,
};

export type ShippingInfo = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: number;
};

export type CartItems = {
    productId: string;
    name: string;
    photo: string;
    price: number;
    stock:number;
    quantity: number;
};


export type OrderItems = {
    productId: string;
    name: string;
    photo: string;
    price: number;
    quantity: number;
    _id:number;
};

// export type Orderitems = Omit<CartItems, "stock"> & {_id: string};

export type Order = {
    orderItems: OrderItems[];
    shippingInfo: ShippingInfo;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    status: string,
    _id: string,
    user:{
        name: string;
        _id: string;
    };
}


