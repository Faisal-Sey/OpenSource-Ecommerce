import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import {ProductItem} from 'lib/shopify/types';
import Link from 'next/link';

export default function ProductGridItems({ products }: { products: ProductItem[] }) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.url} className="animate-fadeIn">
          <Link className="relative inline-block h-full w-full" href={`/product/${product.url}`}>
            <GridTileImage
              alt={product.name}
              label={{
                title: product.name,
                amount: String(product.price),
                currencyCode: product.currency.symbol
              }}
              src={product.featured_image?.image_path}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
