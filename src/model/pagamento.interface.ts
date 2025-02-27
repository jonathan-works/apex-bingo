import { CondicaoPagamento } from "./condicao-pagamento.interface";

export interface Pagamento {
  codigo: number;
  meioPagamento: string;
  statusPagamento: string;
  valor: number;
  integra: number;
  cartao: string;
  orderId: string;
  quantidadeParcela: number;
  codigoAutorizacao: string;
  idTemPag: string;
  serialDevice: string;
  codigoReferencia: string;
  pedido: {
    codigo: string;
  };
  condicaoPagamento: CondicaoPagamento;
}
