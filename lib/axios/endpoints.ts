
// Get Queries
export const getAllMenusUrl = "/products/menus/";
export const singleMenuUrl = "/products/menus/:id/";
export const singleMenuByTitleUrl = "/products/menus/title/:title/";
export const getCollectionProductsUrl = "/products/filter/";
export const getProductUrl = "/products/:id/";
export const getAllProductsUrl = "/products/search/";

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
export const constructSingleMenuItemUrl = (id: string) =>
    singleMenuUrl.replace(":id", id);
export const constructSingleMenuByTitleItemUrl = (title: string) =>
    singleMenuByTitleUrl.replace(":title", title);