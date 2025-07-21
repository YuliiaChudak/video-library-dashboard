'use server';

import { prisma } from './prisma';

export async function getUniqueTagList() {
  const tags = await prisma.tag.findMany({
    distinct: ['name'],
    select: {
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
  return tags.map(tag => tag.name);
}
