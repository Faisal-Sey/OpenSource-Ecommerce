import axios, {AxiosResponse} from "axios";
import {Menu, ProductItem} from "../shopify/types";
import {constructGetSingleProductUrl, getAllMenusUrl, getCollectionProductsUrl} from "./endpoints";


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