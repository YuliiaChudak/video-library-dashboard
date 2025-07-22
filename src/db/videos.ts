'use server';

import { prisma } from './prisma';
import type { Video } from '@/db/types';
import { DefaultOrderValue } from '@/db/types';
import {
  VideoListCriteria,
  VideoCreateInput,
  VideoSchema,
  VideoListCriteriaSchema,
} from './schemas';

export async function getVideoListByCriteria(
  criteria: VideoListCriteria
): Promise<Video[]> {
  const { orderBy, searchQuery, tags } =
    await VideoListCriteriaSchema.parseAsync(criteria);

  const videos = await prisma.video.findMany({
    include: {
      videoTags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      created_at: orderBy === DefaultOrderValue ? 'desc' : 'asc',
    },
    where: {
      title: {
        contains: searchQuery,
        mode: 'insensitive',
      },
      ...(tags.length > 0 && {
        videoTags: {
          some: {
            tag: {
              name: { in: tags },
            },
          },
        },
      }),
    },
  });

  return videos.map(video => ({
    id: video.id,
    title: video.title,
    duration: video.duration,
    thumbnailUrl: video.thumbnail_url,
    views: video.views,
    createdAt: video.created_at.toISOString(),
    updatedAt: video.updated_at.toISOString(),
    tags: video.videoTags.map(vt => vt.tag.name),
  }));
}

export const createVideo = async (input: VideoCreateInput): Promise<Video> => {
  const { title, thumbnailUrl, views, duration, tags } =
    await VideoSchema.parseAsync(input);

  const video = await prisma.video.create({
    data: {
      title,
      thumbnail_url: thumbnailUrl,
      views,
      duration,
      videoTags: {
        create: tags.map(tag => ({
          tag: {
            connectOrCreate: {
              where: { name: tag },
              create: { name: tag },
            },
          },
        })),
      },
    },
    include: {
      videoTags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return {
    id: video.id,
    title: video.title,
    duration: video.duration,
    thumbnailUrl: video.thumbnail_url,
    views: video.views,
    createdAt: video.created_at.toISOString(),
    updatedAt: video.updated_at.toISOString(),
    tags: video.videoTags.map(vt => vt.tag.name),
  };
};
