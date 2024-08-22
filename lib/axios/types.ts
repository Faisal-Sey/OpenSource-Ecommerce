import {ID} from "../shopify/types";


export interface AddItemToCart {
    product_id: ID,
    total_amount: number,
    image_id: ID | null,
    quantity: number,
    product_size: Record<string, string>,
}

export interface UpdateCartItem {
    quantity: number,
    total_amount: number,
}
