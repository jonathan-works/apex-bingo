import { PageResponse } from "./page.interface";

export enum TipoPessoa {
  FISICA = 'FISICA',
  JURIDICA = 'JURIDICA'
}

export interface PessoaRequest {
  codigo?: number;
  nome: string;
  tipoPessoa: TipoPessoa;
  documento: string;
  dataNascimento?: string;
  email: string;
  telefone: string;
  password: string;
}

export interface PessoaResponse {
  codigo?: number;
  nome: string;
  tipoPessoa: TipoPessoa;
  documento: string;
  dataNascimento?: string;
  email: string;
  telefone: string;
}

export interface PagePessoaResponse extends PageResponse<PessoaResponse> {}