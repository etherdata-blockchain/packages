export interface PaginationResult<T> {
  results: T[];
  count: number;
  totalPage: number;
  currentPage: number;
  pageSize: number;
}
