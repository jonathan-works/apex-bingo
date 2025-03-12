import { EmpresaRequest, EmpresaResponse } from './empresa.interface';
import { PageResponse } from './page.interface';

export interface EventoRequest {
  codigo?: number;
  descricao: string;
  dataInicio: string;
  dataFinal: string;
  empresa?: EmpresaRequest;
}

export interface EventoResponse {
  codigo?: number;
  descricao: string;
  dataInicio: string;
  dataFinal: string;
  empresa: EmpresaResponse | undefined;
  nomeUsuario?: string;
}

export interface EventoFilter {
    descricao?: string;
    dataInicio?: string;
    dataFinal?: string;
  }

export interface PageEventoResponse extends PageResponse<EventoResponse[]> {}
  