'use client';

import type React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import { useRouter } from 'next/navigation';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { TagSelectDropdown } from '@/features/filters/components/TagSelectDropdown';
import { Input } from '@/components/ui/Input';
import { createVideo } from '@/db/videos';
import { VideoCreateInput, VideoSchema } from '@/db/schemas';
import { Button } from '@/components/ui/Button';
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { QueryProvider, queryClient } from '@/components/query/QueryProvider';

interface CreateVideoFormProps {
  tags: string[];
}

// Type guard utility for number or string values
function toInputValue(val: unknown): string | number | undefined {
  if (typeof val === 'number' || typeof val === 'string') return val;
  return undefined;
}

function CreateVideoFormImpl({ tags }: CreateVideoFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(VideoSchema),
    defaultValues: {
      title: '',
      thumbnailUrl: 'https://picsum.photos/seed/video23/300/200',
      views: 0,
      duration: 1,
      tags: [],
    },
    mode: 'onChange',
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<VideoCreateInput> = async data => {
    setSubmitError(null);
    try {
      await createVideo(data as VideoCreateInput);
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      router.push('/');
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Unexpected error occurred'
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-2xl font-semibold">Create New Video</h2>
        <p className="mt-1 text-sm text-gray-600">
          Add a new video to your library.
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Global error */}
          {submitError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="mt-0.5 mr-3 h-5 w-5 text-red-500" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    Error Creating Video
                  </h3>
                  <p className="mt-1 text-sm text-red-700">
                    Please make sure all the required fields are filled in
                    correctly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitError(null)}
                  className="text-red-400 transition-colors hover:text-red-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="relative">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input label="Title" {...field} error={errors.title?.message} />
              )}
            />
          </div>
          <div className="relative">
            <Controller
              name="thumbnailUrl"
              control={control}
              render={({ field }) => (
                <Input
                  label="Thumbnail URL"
                  {...field}
                  error={errors.thumbnailUrl?.message}
                />
              )}
            />
          </div>

          <div className="relative">
            <Controller
              name="views"
              control={control}
              render={({ field }) => (
                // Zod preprocessors make field.value unknown, so we safely narrow it
                <Input
                  label="Views"
                  type="number"
                  {...field}
                  value={toInputValue(field.value)}
                  error={errors.views?.message}
                />
              )}
            />
          </div>

          <div className="relative">
            <Controller
              name="duration"
              control={control}
              render={({ field }) => (
                // Zod preprocessors make field.value unknown, so we safely narrow it
                <Input
                  label="Duration (seconds)"
                  type="number"
                  {...field}
                  value={toInputValue(field.value)}
                  error={errors.duration?.message}
                />
              )}
            />
          </div>

          <div className="relative">
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <TagSelectDropdown
                  label="Tags (optional)"
                  items={tags}
                  selectedItems={field.value ?? []}
                  onItemsChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              loading={isSubmitting}
              loadingText="Creating..."
              className="flex-[0.6]"
              disabled={isSubmitting || !isValid}
            >
              Create Video
            </Button>

            <Button
              type="button"
              disabled={isSubmitting}
              variant="neutral"
              onClick={() => router.push('/')}
              className="flex-[0.4]"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CreateVideoForm(props: { tags: string[] }) {
  return (
    <QueryProvider>
      <CreateVideoFormImpl tags={props.tags} />
    </QueryProvider>
  );
}
