import { MeioPagamento } from './meio-pagamento.enum';
import { TipoPagamento } from './tipo-pagamento.enum';

export interface CondicaoPagamento {
  codigo?: number;
  descricao: string;
  parcela: number;
  intervalo: number;
  juros: number;
  tipo: TipoPagamento;
  meioPagamento: MeioPagamento;
}

export interface CondicaoPagamentoResponse {
  codigo: number;
  descricao: string;
  parcela: number;
  intervalo: number;
  juros: number;
  tipo: TipoPagamento;
  meioPagamento: MeioPagamento;
}
