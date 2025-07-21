import { CreateVideoForm } from '@/features/video/components/CreateVideoForm';
import { getUniqueTagList } from '@/db/tags';
import { Header } from '@/components/layout/Header';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ButtonLink } from '@/components/ui/ButtonLink';

export const revalidate = 60;

export default async function CreateVideoPage() {
  const tags = await getUniqueTagList();

  return (
    <div className="container mx-auto px-4 py-8">
      <Header title="Add New Video" subtitle="Add a new video">
        <ButtonLink href="/" variant="primary" aria-label="Back to library">
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to Library
        </ButtonLink>
      </Header>

      <CreateVideoForm tags={tags} />
    </div>
  );
}
