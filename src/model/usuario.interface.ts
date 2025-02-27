export interface Pessoa {
  codigo?: number;
  nome?: string;
  tipoPessoa: 'FISICA' | 'JURIDICA';
  documento?: string;
  dataNascimento?: string;
  email: string;
  telefone?: string;
}

export interface Usuario {
  codigo?: number;
  pessoa: Pessoa;
}

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

export interface PageUsuarioResponse {
  totalElements: number;
  totalPages: number;
  pageable: PageableObject;
  numberOfElements: number;
  size: number;
  content: Usuario[];
  number: number;
  sort: SortObject;
  first: boolean;
  last: boolean;
  empty: boolean;
}
