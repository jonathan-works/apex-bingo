import { PessoaRequest, PessoaResponse } from "./pessoa.interface";

export interface VendedorResponse {
  codigo?: number;
  pessoa: PessoaResponse;
  nomeUsuario: string;
}

export interface VendedorRequest {
  codigo?: number;
  pessoa: PessoaRequest;
}
