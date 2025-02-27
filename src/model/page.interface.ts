export interface PageableObject {
  unpaged: boolean;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: SortObject;
}

export interface SortObject {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}
