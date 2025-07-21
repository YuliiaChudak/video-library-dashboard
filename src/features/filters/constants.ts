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
