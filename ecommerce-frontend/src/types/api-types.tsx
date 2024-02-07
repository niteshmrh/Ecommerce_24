import { Product, User, ShippingInfo, CartItems, Order } from "./types";

export type CustomError = {
    status: number;
    data : {
        success: boolean;
        message: string;
        count?: number;
    }
}

export type MessageResponse = {
    success: boolean;
    message: string;
};

export type userResponse = {
    success: boolean;
    result: User;
    message: string;
}

export type allProdutsResponse = {
    success: boolean;
    result: Product[];
    message: string;
    count: number;
}

export type categoriesResponse = {
    success: boolean;
    result: string[];
    message: string;
    count: number;
}

export type searchProdutsResponse = {
    success: boolean;
    result: Product[];
    message: string;
    count: number;
    totalPages: number;
}

// export type searchProdutsResponse = allProdutsResponse & {
//     totalPages: number;
// }

export type SearchProductsRequest = {
    price: number;
    page: number;
    category: string;
    search: string;
    sort: string;
};


export type NewProductRequest = {
    id: string;
    formData: FormData;
};

export type ProdutsResponse = {
    success: boolean;
    result: Product;
    message: string;
}

export type UpdateProductRequest = {
    adminId: string;
    productId: string;
    formData: FormData;
};

export type DeleteProductRequest = {
    adminId: string;
    productId: string;
};


export type NewOrderRequest = {
    id: string;
    shippingInfo: ShippingInfo,
    orderItems: CartItems[],
    user: string,
    subTotal: number,
    tax: number,
    discount: number,
    total: number,
    shippingCharges: number,
    status: string,
};

export type UpdateOrderRequest = {
    userId: string;
    orderId: string;
};


export type MyOrderResponse = {
    success: boolean;
    result: Order[];
    message: string;
};

export type OrderDetailsResponse = {
    success: boolean;
    result: Order;
    message: string;
};