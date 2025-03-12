import { EventoRequest } from './evento.interface';
import { VendedorRequest } from './vendedor.interface';

export interface GestaoRifaRequest {
  codigo?: string;
  numeroBloco?: number;
  numeroInicial: number;
  numeroFinal: number;
  tipo: 'C' | 'R';
  evento: EventoRequest;
  vendedor: VendedorRequest;
}

export interface GestaoFilter {
  numero?: number;
  nome?: string;
  documento?: string;
  statusCartela?: 'D' | 'R' | 'P' | 'E' | 'C' | 'S' | 'G';
  tipo?: 'C' | 'R';
  dataInicio?: string;
  dataFinal?: string;
}