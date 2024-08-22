import {ProductColor, ProductSize, ProductSizeItem} from "../lib/shopify/types";

export const getProductDescriptionFilters = (
    optionKey: string,
    item: any,
    items: ProductSize[]
): ProductColor[] => {
    if (isPlainObject(item)) {
        return items.reduce(
            (acc: ProductColor[], elt: ProductSize) => {
                if (elt[optionKey]?.title !== "Default") {
                    return [
                        ...acc,
                        elt[optionKey]
                    ]
                } else {
                    return acc
                }
            }
            , [])
    } else if (Array.isArray(item)) {
        return item
    }

    return []
}

export const getValues = (item: ProductSize, excluded: string[]) => {
    return Object.keys(item).reduce((acc: string[], key: string) => {
        if (!excluded.includes(key)) {
            if (isPlainObject(item[key])) {
                return [...acc, item[key]?.title]
            } else if (Array.isArray(item[key])) {
                return [...acc, ...item[key].map((elt: ProductSizeItem) => elt.title)]
            } else if (typeof item[key] === 'string') {
                return [...acc, item[key]]
            }
        }
        return acc
    }, [])
}


export const getAvailableFilters = (
    optionKey: string,
    items: ProductSize[],
    value: string,
): string[] => {
    const availableItems = items?.reduce((acc: string[], item: ProductSize) => {
        let filterItem: any;
        if (optionKey) {
            filterItem = item[optionKey.toLowerCase()];
            if (isPlainObject(filterItem)) {
                if (filterItem?.title === value) {
                    return [
                        value,
                        ...acc,
                        ...getValues(
                            item,
                            [
                                "id",
                                "disabled",
                                optionKey.toLowerCase()
                            ]
                        )
                    ]
                } else {
                    return [
                        value,
                        filterItem?.title,
                        ...acc
                    ]
                }
            } else if (Array.isArray(filterItem)) {
                if (filterItem.map((elt: ProductSizeItem) => elt.title)?.includes(value)) {
                    return [
                        value,
                        ...acc,
                        ...getValues(
                            item,
                            [
                                "id",
                                "disabled",
                                optionKey.toLowerCase()
                            ]
                        ),
                        ...filterItem.map((elt: ProductSizeItem) => elt.title)
                    ]
                }
            }
        } else {
            return [
                ...acc,
                ...getValues(
                    item,
                    [
                        "id",
                        "disabled",
                    ]
                )
            ]
        }

        return acc
    }, []);

    return Array.from(new Set(availableItems));
}


function isPlainObject(value: any) {
    return Object.prototype.toString.call(value) === '[object Object]';
}

const filterItemsValuesCheck = (
    productSize: ProductSize,
    selectedGroupId: string,
    itemName: string,
) => {
    return Object.keys(productSize).map((productSizeKey: string) => {
        if (productSizeKey === selectedGroupId) {
            return true;
        }
        const item: string | ProductColor | ProductSize = productSize[productSizeKey];
        // console.log(item, itemName);
        if (Array.isArray(item)) {
            const objectValues = item.map((arrayItem) => arrayItem.title);
            return objectValues.includes(itemName);
        } else if (isPlainObject(item)) {
            const objectItem = item as { [key: string]: string }
            return objectItem?.title === itemName
        }

        return false
    }).some((elt) => elt);
}

export const isItemAvailable = (
    items: ProductSize[],
    selectedGroupId: string,
    itemName: string,
    selectedName: string | null,
) => {
    if (selectedName === null) {
        return true;
    }
    const itemChecks: boolean[] = items.map((productSize: ProductSize) => {
        const item: string | ProductColor | ProductSize = productSize[selectedGroupId];
        if (Array.isArray(item)) {
            const objectValues = item.map((arrayItem) => arrayItem.title);
            if (objectValues.includes(selectedName)) {
                return filterItemsValuesCheck(
                    productSize,
                    selectedGroupId,
                    itemName,
                )
            }
        } else if (isPlainObject(item)) {
            const objectItem = item as { [key: string]: string }
            if (objectItem?.title === selectedName) {
                return filterItemsValuesCheck(
                    productSize,
                    selectedGroupId,
                    itemName,
                )
            }
        }
        return false
    });
    return itemChecks.some((elt) => elt);
}

  export const getAllParams = (searchParams: IterableIterator<[string, string]>): Record<string, string> => {
    const params: Record<string, string> = {};
    const searchParamsArray = Array.from(searchParams);
    for (const [key, value] of searchParamsArray) {
      params[key] = value;
    }
    return params;
  };

  export const isObjectLengthValid = (obj: Record<string, string>, length: number): boolean => {
    return Object.keys(obj).length >= length;
  };