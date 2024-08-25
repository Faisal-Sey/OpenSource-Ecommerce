import axios, {AxiosResponse} from "axios";
import {Menu, ProductCart, ProductItem} from "../shopify/types";
import {
    constructAddItemToCartUrl,
    constructGetSingleProductCartUrl,
    constructGetSingleProductUrl, constructSingleCartItemUrl, createCartUrl,
    getAllMenusUrl, getAllProductsUrl,
    getCollectionProductsUrl
} from "./endpoints";
import {
    AddItemToCart,
    PaginatedQueryResult,
    ProductSearch,
    UpdateCartItem
} from "./types";


export const Api = axios.create({
    timeout: 10000,
    baseURL: process.env.API_URL
})

export async function getMenu(): Promise<Menu[]> {
    try {
        const res: AxiosResponse = await Api.get(getAllMenusUrl);

        return (
            res.data?.map((item: { title: string; url: string }) => ({
                title: item.title,
                path: item.url,
            })) || []
        );
    } catch (err) {
        return []
    }

}

export async function getCollectionProducts(productLocation: string[]): Promise<ProductItem[]> {
    try {
        const res: AxiosResponse = await Api.post(getCollectionProductsUrl, {
            "filter_query": {
                "product_locations__name__in": productLocation
            }
        });
        return res.data;

    } catch (err) {
        return []
    }
}

export async function getProduct(productId: string): Promise<ProductItem | null> {
    try {
        const res: AxiosResponse = await Api.get(constructGetSingleProductUrl(productId));
        return res.data;

    } catch (err) {
        return null;
    }
}

export async function getAllProductsBySearch(
    searchQuery: ProductSearch
): Promise<PaginatedQueryResult | null> {
    try {
        const res: AxiosResponse = await Api.post(getAllProductsUrl, {
            ...searchQuery,
            sort_key: searchQuery.sort_key.toLowerCase()
        });
        return res.data;
    } catch (err) {
        return null
    }
}

export async function getCart(cartId: string): Promise<ProductCart | null> {
    try {
        const res: AxiosResponse = await Api.get(constructGetSingleProductCartUrl(cartId));
        return res.data;

    } catch (err) {
        return null;
    }
}

export async function createCart(): Promise<ProductCart | null> {
    try {
        const res: AxiosResponse = await Api.post(createCartUrl, { currency: 1 });
        return res.data;

    } catch (err) {
        return null;
    }
}

export async function addItemToCart(cartId: string, cartInfo: AddItemToCart): Promise<ProductCart | null> {
    try {
        const res: AxiosResponse = await Api.patch(
            constructAddItemToCartUrl(cartId),
            {cart_items: [cartInfo]}
        );
        console.log("data", res.data);
        return res.data;

    } catch (err: any) {
        console.log("err", err.response.data);
        return null;
    }
}

export async function updateCartItem(cartItemId: string, cartItemInfo: UpdateCartItem): Promise<ProductCart | null> {
    try {
        const res: AxiosResponse = await Api.patch(
            constructSingleCartItemUrl(cartItemId),
            cartItemInfo
        );
        console.log("data", res.data);
        return res.data;

    } catch (err: any) {
        console.log("err", err.response.data);
        return null;
    }
}

export async function removeCartItem(cartItemId: string): Promise<ProductCart | null> {
    try {
        const res: AxiosResponse = await Api.delete(
            constructSingleCartItemUrl(cartItemId)
        );
        console.log("item deleted", res.data);
        return res.data;

    } catch (err: any) {
        console.log("err", err.response.data);
        return null;
    }
}
