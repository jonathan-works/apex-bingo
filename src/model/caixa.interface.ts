import { CartelaResponse } from "./cartela.interface";
import { EventoRequest, EventoResponse } from "./evento.interface";
import { MeioPagamento } from "./meio-pagamento.enum";
import { TipoPagamento } from "./tipo-pagamento.enum";

export interface CaixaFilter {
    dataInicio: string;
    dataFinal: string;
}

export interface DadosCaixaResponse{
    lancamentos: MovimentacaoCaixaResponse[];
    dinheiro: number;
    cartaoCredito: number;
    cartaoDebito: number;
    pix: number;
    totalCredito: number;
    totalDebito: number;
    saldo: number;
}

export interface MovimentacaoCaixaResponse{
    codigo: number;
    dataHora: string;
    valor: number;
    tipo: TipoPagamento;
    meioPagamento: MeioPagamento;
    evento: EventoResponse;
    cartelaRifa: CartelaResponse
    inclusao: string;
}

export interface LancamentoCaixaRequest{
    valor: number;
    tipo: TipoPagamento;
    meioPagamento: MeioPagamento;
    evento: EventoRequest;
}