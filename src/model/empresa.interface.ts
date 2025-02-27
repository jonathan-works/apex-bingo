import { PageableObject, SortObject } from './page.interface';
import { PessoaRequest, PessoaResponse } from './pessoa.interface';

export interface Empresa {
  codigo?: number;
  pessoa: PessoaRequest;
}

export interface EmpresaResponse {
  codigo: number;
  pessoa: PessoaResponse;
}

export interface PageEmpresaResponse {
  totalElements: number;
  totalPages: number;
  pageable: PageableObject;
  numberOfElements: number;
  size: number;
  content: EmpresaResponse[];
  number: number;
  sort: SortObject;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface EmpresaFilter {
  nome?: string;
}
