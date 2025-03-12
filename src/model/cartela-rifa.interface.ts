import { EventoRequest, EventoResponse } from './evento.interface';

export interface CartelaRifaRequest {
  codigo?: number;
  numeroInicial: number;
  numeroFinal: number;
  valor: number;
  tipo: 'C' | 'R';
  evento: EventoRequest;
}
export interface CartelaRifaResponse{
  codigo: string;
  numero: number;
  valor: number;
  tipo: 'C' | 'R';
  evento: EventoResponse;
  status: 'D' | 'R' | 'P' | 'E' | 'C' | 'S' | 'G';
  nomeUsuario: string
}
