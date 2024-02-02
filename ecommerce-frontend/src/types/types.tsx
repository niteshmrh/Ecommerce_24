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



