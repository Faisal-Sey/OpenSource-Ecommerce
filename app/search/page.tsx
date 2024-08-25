import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import {getAllProductsBySearch} from "../../lib/axios";
import {ProductItem} from "../../lib/shopify/types";

export const metadata = {
  title: 'Search',
  description: 'Search for products in the store.'
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const paginatedQueryResult = await getAllProductsBySearch({
    query: searchValue,
    sort_key: sortKey,
    reverse,
    page_number: 1,
    items_per_page: 20
  });
  console.log("products", paginatedQueryResult);
  let products: ProductItem[] = [];
  let resultsText: string = "result";
  if (paginatedQueryResult) {
    products = paginatedQueryResult?.data;
    console.log("products", products);
    resultsText = products.length > 1 ? 'results' : 'result';
  }

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? 'There are no products that match '
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
