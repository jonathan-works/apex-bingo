import { PageResponse } from './page.interface';
import { PessoaRequest, PessoaResponse } from './pessoa.interface';

export interface ClienteResponse {
  codigo: number;
  pessoa: PessoaResponse;
}

export interface ClienteRequest {
  codigo: number;
  pessoa: PessoaRequest;
}

export interface ClienteFilter {
  nome?: string;
  documento?: string;
}

export interface PageClienteResponse extends PageResponse<ClienteResponse[]> {}