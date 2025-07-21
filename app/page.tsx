import { Suspense } from 'react';
import { VideoGrid } from '@/features/video/components/VideoGrid';
import { getUniqueTagList } from '@/db/tags';
import { Header } from '@/components/layout/Header';
import { VideoGridSkeleton } from '@/features/video/components/VideoGridSkeleton';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { PlusIcon } from '@heroicons/react/24/outline';

export const revalidate = 60;

export default async function HomePage() {
  const tags = await getUniqueTagList();

  return (
    <section className="container mx-auto px-4 py-8">
      <Header>
        <ButtonLink href="/new" variant="primary" aria-label="Add new video">
          <PlusIcon className="mr-1 h-4 w-4" />
          Add Video
        </ButtonLink>
      </Header>

      <section aria-labelledby="video-library-heading">
        <h2 id="video-library-heading" className="sr-only">
          Video Library Content
        </h2>
        <Suspense fallback={<VideoGridSkeleton />}>
          <VideoGrid tags={tags} />
        </Suspense>
      </section>
    </section>
  );
}
