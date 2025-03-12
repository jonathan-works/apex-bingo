import { CartelaRifaResponse } from "./cartela-rifa.interface";
import { EventoRequest, EventoResponse } from "./evento.interface";
import { PageResponse } from "./page.interface";
import { VendedorRequest } from "./vendedor.interface";
import { EmpresaResponse } from "./empresa.interface";


export interface GestaoCartelaRequest {
    codigo: string;
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
    vendedor: any | null;
    nomeUsuario: string;
}

export interface GestaoCartelaItemResponse{
    codigo: string;
    numeroBloco: string;
    cartelaRifa: CartelaRifaResponse;
    tipo: 'C' | 'R'
}

export interface GestaoCartelaFilter{
    numero: number;
    nome: string;
    documento: string;
    statusCarteira: 'D' | 'R' | 'P' | 'E' | 'C' | 'S' | 'G';
    tipo: 'C' | 'D';
    dataInicio: Date;
    dataFinal: Date;
}

export interface PageGestaoCartelaResponse extends PageResponse<GestaoCartelaResponse[]>{}