export interface Video {
  id: string;
  title: string;
  duration: number;
  thumbnailUrl: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export type SortOrder = 'newest' | 'oldest';
