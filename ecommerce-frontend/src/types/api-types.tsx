import { Product, User } from "./types";

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
    totalPages: number;
    count: number;
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