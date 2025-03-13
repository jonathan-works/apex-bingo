import { PageResponse } from "./page.interface";
import { PessoaRequest, PessoaResponse } from "./pessoa.interface";

export interface VendedorResponse {
  codigo?: number;
  pessoa: PessoaResponse;
  nomeUsuario?: string;
}

export interface VendedorRequest {
  codigo?: number;
  pessoa: PessoaRequest;
}

export interface VendedorFilter {
  nome?: string;
  documento?: string;
}

export interface PageVendedorResponse extends PageResponse<VendedorResponse[]> {}
