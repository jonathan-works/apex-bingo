import { EventoRequest, EventoResponse } from './evento.interface';
import { PageResponse } from './page.interface';

export interface GestaoRifaRequest {
  codigo?: number;
  numeroInicial: number;
  numeroFinal: number;
  valor: number;
  tipo: 'C' | 'R';
  evento: EventoRequest;
}

export interface GestaoRifaResponse{
  codigo: string;
  numero: number
  valor: number;
  tipo: 'C' | 'R';
  evento: EventoResponse;
  status: 'D' | 'R' | 'P' | 'E' | 'C' | 'S' | 'G';
  nomeUsuario: string
}

export interface CartelaFilter{
  numero: number
  statusCartela: string,
  tipo: string
}

export interface PageGestaoRifaResponse extends PageResponse<GestaoRifaResponse[]> {}