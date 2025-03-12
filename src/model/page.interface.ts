export interface SortObject {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface PageableObject {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
  offset: number;
  sort: SortObject;
}

export interface PageResponse<T> {
  totalElements: number;
  totalPages: number;
  pageable: PageableObject;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: T;
  number: number;
  sort: SortObject;
  empty: boolean;
}