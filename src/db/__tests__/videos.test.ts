import { getVideoListByCriteria, createVideo } from '../videos';
import { prisma } from '../prisma';
import { VideoListCriteria } from '../schemas';

jest.mock('../prisma', () => ({
  prisma: {
    video: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('videos db functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getVideoListByCriteria', () => {
    it('returns mapped videos', async () => {
      (prisma.video.findMany as jest.Mock).mockResolvedValue([
        {
          id: '1',
          title: 'Test',
          duration: 100,
          thumbnail_url: 'url',
          views: 10,
          created_at: new Date('2020-01-01T00:00:00Z'),
          updated_at: new Date('2020-01-02T00:00:00Z'),
          videoTags: [{ tag: { name: 'tag1' } }, { tag: { name: 'tag2' } }],
        },
      ]);

      const criteria: VideoListCriteria = {
        orderBy: 'newest',
        searchQuery: '',
        tags: [],
      };

      const result = await getVideoListByCriteria(criteria);

      expect(result).toEqual([
        {
          id: '1',
          title: 'Test',
          duration: 100,
          thumbnailUrl: 'url',
          views: 10,
          createdAt: '2020-01-01T00:00:00.000Z',
          updatedAt: '2020-01-02T00:00:00.000Z',
          tags: ['tag1', 'tag2'],
        },
      ]);
      expect(prisma.video.findMany).toHaveBeenCalled();
    });

    it('handles empty result', async () => {
      (prisma.video.findMany as jest.Mock).mockResolvedValue([]);
      const criteria: VideoListCriteria = {
        orderBy: 'newest',
        searchQuery: '',
        tags: [],
      };
      const result = await getVideoListByCriteria(criteria);
      expect(result).toEqual([]);
    });
  });

  describe('createVideo', () => {
    it('creates and returns a video', async () => {
      (prisma.video.create as jest.Mock).mockResolvedValue({
        id: '1',
        title: 'Test',
        duration: 100,
        thumbnail_url: 'https://example.com/image.jpg',
        views: 10,
        created_at: new Date('2020-01-01T00:00:00Z'),
        updated_at: new Date('2020-01-02T00:00:00Z'),
        videoTags: [{ tag: { name: 'tag1' } }],
      });

      const input = {
        title: 'Test',
        duration: 100,
        thumbnailUrl: 'https://example.com/image.jpg',
        views: 10,
        tags: ['tag1'],
      };

      const result = await createVideo(input);

      expect(result).toEqual({
        id: '1',
        title: 'Test',
        duration: 100,
        thumbnailUrl: 'https://example.com/image.jpg',
        views: 10,
        createdAt: '2020-01-01T00:00:00.000Z',
        updatedAt: '2020-01-02T00:00:00.000Z',
        tags: ['tag1'],
      });
      expect(prisma.video.create).toHaveBeenCalled();
    });

    it('throws on invalid input', async () => {
      await expect(
        createVideo({
          title: '',
          duration: 0,
          thumbnailUrl: '',
          views: -1,
          tags: [],
        })
      ).rejects.toThrow();
    });
  });
});
