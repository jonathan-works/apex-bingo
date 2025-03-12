import { PageResponse } from "./page.interface";
import { PessoaRequest, PessoaResponse } from "./pessoa.interface";

export interface EmpresaResponse {
  codigo: number;
  pessoa: PessoaResponse;
}

export interface EmpresaRequest {
  codigo?: number;
  codigoOrganizacao: string;
  pessoa: PessoaRequest;
}

export interface EmpresaFilter {
  nome?: string;
}

export interface PageEmpresaResponse extends PageResponse<EmpresaResponse[]> {}