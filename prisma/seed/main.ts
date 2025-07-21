import { PrismaClient } from '../../generated/prisma';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

type Video = {
  id: string;
  title: string;
  thumbnail_url: string;
  created_at: string;
  duration: number;
  views: number;
  tags: string[];
};

async function main() {
  const data = JSON.parse(
    readFileSync(join(__dirname, 'source.json'), 'utf-8')
  ) as { videos: Video[] };

  console.log('Starting to seed database...');

  for (const video of data.videos) {
    try {
      // Create video with auto-generated UUID (ignore the id from JSON)
      const createdVideo = await prisma.video.create({
        data: {
          title: video.title,
          duration: video.duration,
          thumbnail_url: video.thumbnail_url,
          created_at: new Date(video.created_at),
          views: video.views,
          videoTags: {
            create: video.tags.map(tagName => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName.toLowerCase() },
                  create: { name: tagName.toLowerCase() },
                },
              },
            })),
          },
        },
      });
      console.log(`✅ Created video: ${createdVideo.title}`);
    } catch (error) {
      console.error(`❌ Error creating video "${video.title}":`, error);
    }
  }

  console.log('Database seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
