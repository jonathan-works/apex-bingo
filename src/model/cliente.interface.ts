import { PageableObject, SortObject } from './page.interface';
import { PessoaRequest, PessoaResponse } from './pessoa.interface';

export interface Cliente {
  codigo?: number;
  pessoa: PessoaRequest;
}

export interface ClienteResponse {
  codigo: number;
  pessoa: PessoaResponse;
}

export interface PageClienteResponse {
  totalElements: number;
  totalPages: number;
  pageable: PageableObject;
  numberOfElements: number;
  size: number;
  content: ClienteResponse[];
  number: number;
  sort: SortObject;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ClienteFilter {
  nome?: string;
}
