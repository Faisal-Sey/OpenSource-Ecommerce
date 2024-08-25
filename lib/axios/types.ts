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

export interface ProductSearch {
    query?: string,
    sort_key: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_ON' | 'PRICE',
    reverse: boolean,
    items_per_page: number
    custom_query?: any
    page_number: number
}

export interface PaginatedQueryResult {
    status: string,
    detail: string,
    current_page: number,
    total_data: number,
    total_pages: number,
    data: any[]
}