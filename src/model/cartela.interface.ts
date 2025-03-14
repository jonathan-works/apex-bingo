import { EventoRequest, EventoResponse } from './evento.interface';
import { PageResponse } from './page.interface';

export interface CartelaRequest {
  codigo?: number | undefined;
  numeroInicial: number | undefined;
  numeroFinal: number | undefined;
  valor: number | undefined;
  tipo: 'C' | 'R';
  evento: EventoRequest | undefined;
}


export interface CartelaResponse{
  codigo: string;
  numero: number
  valor: number;
  tipo: 'C' | 'R';
  evento: EventoResponse;
  status: 'D' | 'R' | 'P' | 'E' | 'C' | 'S' | 'G';
  nomeUsuario: string
}

export interface ReceberCartelaRequest{
  meioPagamento: 'Dinheiro' | 'CHEQUE' | 'CARTAOCREDITO' | 'CARTAODEBITO' | 'CREDITOLOJA' | 'VALEALIMENTACAO' | 'VALEREFEICAO' | 'VALEPRESENTE' | 'VALECOMBUSTIVEL' | 'BOLETOBANCARIO' | 'DEPOSITOBANCARIO' | 'PIX' | 'TRANSERENCIABANCARIA' | 'SEMPAGAMENTO';
  dataPagamento: Date;
}

export interface DevolverCartelaRequest{
  meioPagamento: string
}

export interface CartelaFilter{
  numero?: number
  statusCartela?: string,
  tipo?: string
}

export interface PageCartelaResponse extends PageResponse<CartelaResponse[]> {}