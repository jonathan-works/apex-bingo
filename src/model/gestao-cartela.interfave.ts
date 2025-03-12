import { CartelaRifaResponse } from "./cartela-rifa.interface";
import { EventoResponse } from "./evento.interface";
import { PageResponse } from "./page.interface";
import { VendedorResponse } from "./vendedor.interface";


export interface GestaoCartelaResponse {
    codigo: string;
    vendedor: VendedorResponse;
    evento: EventoResponse;
    status: 'E' | 'P' | 'F';
    dataCadastro: Date;
    itens: GestaoCartelaItemResponse[];
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