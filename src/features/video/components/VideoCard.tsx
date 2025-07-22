import Image from 'next/image';
import { CalendarDaysIcon, EyeIcon } from '@heroicons/react/24/outline';
import type { Video } from '@/db/types';
import {
  formatDate,
  formatDuration,
  formatViews,
} from '@/features/video/components/helpers/formatters';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={video.thumbnailUrl || '/placeholder.svg'}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute right-2 bottom-2 rounded bg-black/80 px-2 py-1 text-xs text-white">
          {formatDuration(video.duration)}
        </div>
      </div>
      <div className="p-4">
        <h2 className="mb-2 text-lg font-semibold transition-colors group-hover:text-blue-600">
          {video.title}
        </h2>

        <div className="mb-3 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <CalendarDaysIcon className="h-4 w-4" />
            {formatDate(video.createdAt, 'short')}
          </div>
          <div className="flex items-center gap-1.5">
            <EyeIcon className="h-4 w-4" />
            {formatViews(video.views)} views
          </div>
        </div>

        {video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {video.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800"
              >
                {tag}
              </span>
            ))}
            {video.tags.length > 3 && (
              <span className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                +{video.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
