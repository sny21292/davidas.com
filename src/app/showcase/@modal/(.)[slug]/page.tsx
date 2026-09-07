import { notFound } from 'next/navigation';
import '@/styles/showcase.css';
import { getShowcaseItems } from '@/data/showcase.server';
import ShowcaseRouteModal from '@/components/ShowcaseRouteModal';

type Params = { slug: string };

// Intercepts a soft navigation to /showcase/[slug] and renders the quick-view
// modal over the case listing. `(.)` = same level as the @modal slot's parent
// (app/showcase), so it matches app/showcase/[slug].
export default async function InterceptedShowcaseModal({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const items = await getShowcaseItems();
  const item = items.find((i) => i.slug === slug);
  if (!item) notFound();
  return <ShowcaseRouteModal item={item} items={items} />;
}
