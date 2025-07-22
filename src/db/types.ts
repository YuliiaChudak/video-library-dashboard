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

export const QueryParamsNames = {
  Search: 'search',
  Tags: 'tags',
  OrderBy: 'sort',
} as const;

export const OrderByValues = {
  Newest: 'newest',
  Oldest: 'oldest',
} as const;

export const DefaultOrderValue = OrderByValues.Newest;

export type SortOrder = (typeof OrderByValues)[keyof typeof OrderByValues];
