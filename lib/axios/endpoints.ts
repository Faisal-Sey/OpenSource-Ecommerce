export const getAllMenusUrl = "/products/menus/";
export const getCollectionProductsUrl = "/products/filter/";
export const getProductUrl = "/products/:id/";


export const constructGetSingleProductUrl = (id: string) =>
    getProductUrl.replace(":id", id);