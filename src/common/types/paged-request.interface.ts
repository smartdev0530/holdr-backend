export interface IPagedRequest<T, U> {
  limit: number;
  count: number;
  offset: U;
  data: T[];
}
