import { EventoRequest, EventoResponse } from "./evento.interface";
import { VendedorRequest } from "./vendedor.interface";
import { EmpresaResponse } from "./empresa.interface";
import { CartelaResponse } from "./cartela.interface";
import { PageResponse } from "./page.interface";


export interface GestaoCartelaRequest {
    codigo?: string;
    numeroBloco: number | undefined;
    numeroInicial: number | undefined;
    numeroFinal: number | undefined;
    tipo: 'C' | 'R';
    evento: EventoRequest | undefined
    vendedor: VendedorRequest | undefined
}

export interface GestaoCartelaResponse {
    codigo: string;
    descricao: string;
    empresa: EmpresaResponse | null;
    evento: EventoResponse | null;
    status: string;
    dataCadastro: Date;
    itens: any[];
    vendedor: VendedorRequest | null;
    nomeUsuario: string;
}

export interface GestaoCartelaItemResponse{
    codigo: string;
    numeroBloco: string;
    cartelaRifa: CartelaResponse | null;
    tipo: 'C' | 'R'
}

export interface GestaoCartelaFilter{
    numero?: number;
    nome?: string;
    documento?: string;
    statusCartela?: 'D' | 'R' | 'P' | 'E' | 'C' | 'S' | 'G';
    tipo?: 'C' | 'D';
    dataInicio?: Date;
    dataFinal?: Date;
}

export interface PageGestaoCartelaResponse extends PageResponse<GestaoCartelaResponse[]>{}