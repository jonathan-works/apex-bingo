import { Pedido } from "./pedido.interface";

export interface Lancamento {
  codigo: number;
  dataHora: string;
  valor: number;
  tipo: "CREDITO" | "DEBITO";
  meioPagamento: "Dinheiro" | "CartaoCredito" | "CartaoDebito" | "Pix";
  pedido: Pedido;
  inclusao: any | null;
}
