export type ListResponse<T> = {
  result: T;
  count: number;
  page: number;
  size: number;
};

export type ListParams = {
  page: number;
  size: number | 20;
};
