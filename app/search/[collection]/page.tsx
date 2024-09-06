import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import {getAllProductsBySearch, getMenu} from "../../../lib/axios";
import {PaginatedQueryResult} from "../../../lib/axios/types";
import {ProductItem} from "../../../lib/shopify/types";

export async function generateMetadata({
  params
}: {
  params: { collection: string };
}): Promise<Metadata> {
  const collection = await getMenu(params.collection);

  if (!collection) return notFound();

  return {
    title: collection?.seo?.title || collection.title,
    description:
      collection?.seo?.description || collection.description || `${collection.title} products`
  };
}

export async function getStaticPaths() {
  return {
    paths: [], // No pre-generated paths
    fallback: 'blocking', // Serve dynamic pages on-demand
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { collection: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort} = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const paginatedQueryResult: PaginatedQueryResult | null = await getAllProductsBySearch({
    custom_query: {product_type__title__iexact: params.collection.toLowerCase()},
    sort_key: sortKey,
    reverse,
    page_number: 1,
    items_per_page: 20
  });

  const products: ProductItem[] = paginatedQueryResult ? paginatedQueryResult?.data : [];

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}
