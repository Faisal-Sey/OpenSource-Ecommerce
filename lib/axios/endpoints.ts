
// Get Queries
export const getAllMenusUrl = "/products/menus/";
export const getCollectionProductsUrl = "/products/filter/";
export const getProductUrl = "/products/:id/";

// Post Queries
export const createCartUrl = "/products/carts/";

// Common
export const singleCartUrl = "/products/carts/:id/";
export const addItemToCartUrl = "/products/carts/add-item/:id/";
export const singleCartItemUrl = "/products/carts/cart-item/:id/";


export const constructGetSingleProductUrl = (id: string) =>
    getProductUrl.replace(":id", id);
export const constructGetSingleProductCartUrl = (id: string) =>
    singleCartUrl.replace(":id", id);
export const constructAddItemToCartUrl = (id: string) =>
    addItemToCartUrl.replace(":id", id);

export const constructSingleCartItemUrl = (id: string) =>
    singleCartItemUrl.replace(":id", id);