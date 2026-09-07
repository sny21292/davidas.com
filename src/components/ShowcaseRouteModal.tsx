'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { ProductModal, VideoModal } from '@/components/ShowcaseCollection';
import type { ShowcaseItem } from '@/data/showcase';

const VELVET_GREEN = '/images/showcase/green-velvet.png';

// Renders the quick-view modal for the @modal intercepting route. Reuses the
// existing ProductModal/VideoModal so prev/next, video and favorites all work.
// Close = router.back(); prev/next = soft-navigate to the sibling slug (which the
// interceptor picks up again). The `.showcase-page` wrapper (display:contents so
// it adds no box) carries the --sc-* CSS variables the modal styling needs, since
// the @modal slot lives outside the page's own `.showcase-page` element.
export default function ShowcaseRouteModal({
  item,
  items,
}: {
  item: ShowcaseItem;
  items: ShowcaseItem[];
}) {
  const router = useRouter();
  const [videoOpen, setVideoOpen] = useState(false);

  const close = useCallback(() => router.back(), [router]);
  const navigate = useCallback(
    (it: ShowcaseItem) => router.push(`/showcase/${it.slug}`),
    [router],
  );

  return (
    <div className="showcase-page" data-velvet="emerald" style={{ display: 'contents' }}>
      <ProductModal
        item={item}
        items={items}
        onClose={close}
        onPlayVideo={() => setVideoOpen(true)}
        onNavigate={navigate}
        velvet={VELVET_GREEN}
      />
      {videoOpen && <VideoModal item={item} onClose={() => setVideoOpen(false)} />}
    </div>
  );
}
