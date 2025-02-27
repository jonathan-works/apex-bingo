import { PageableObject, SortObject } from './page.interface';
import { PessoaRequest, PessoaResponse } from './pessoa.interface';

export interface Colaborador {
  codigo?: number;
  pessoa: PessoaRequest;
}

export interface ColaboradorResponse {
  codigo: number;
  pessoa: PessoaResponse;
}

export interface PageColaboradorResponse {
  totalElements: number;
  totalPages: number;
  pageable: PageableObject;
  numberOfElements: number;
  size: number;
  content: ColaboradorResponse[];
  number: number;
  sort: SortObject;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ColaboradorFilter {
  nome?: string;
}
