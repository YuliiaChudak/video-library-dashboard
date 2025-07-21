import { z } from 'zod';

export const VideoSchema = z.object({
  title: z.string().min(1, { message: 'Title of the video is required' }),
  thumbnailUrl: z.url(),
  views: z.preprocess(
    val => (val === '' ? undefined : Number(val)),
    z.number().min(0).default(0)
  ),
  duration: z.preprocess(
    val => (val === '' ? undefined : Number(val)),
    z.number().min(1, {
      message: 'Duration of the video is required to be at least 1 second',
    })
  ),
  tags: z.array(z.string()).optional().default([]),
});

export const VideoListCriteriaSchema = z.object({
  orderBy: z.enum(['newest', 'oldest']).optional().default('newest'),
  searchQuery: z
    .string()
    .optional()
    .default('')
    .transform(q => q.trim().toLowerCase()),
  tags: z
    .array(z.string())
    .optional()
    .default([])
    .transform(tags => tags.map(tag => tag.trim().toLowerCase())),
});

export type VideoCreateInput = z.infer<typeof VideoSchema>;

export type VideoListCriteria = z.infer<typeof VideoListCriteriaSchema>;
