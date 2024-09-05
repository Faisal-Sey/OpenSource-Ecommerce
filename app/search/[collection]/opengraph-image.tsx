import OpengraphImage from 'components/opengraph-image';
import {getMenu} from "../../../lib/axios";

export const runtime = 'edge';

export default async function Image({ params }: { params: { collection: string } }) {
  const collection = await getMenu(params.collection);
  const title = collection?.seo?.title || collection?.title;

  return await OpengraphImage({ title });
}
