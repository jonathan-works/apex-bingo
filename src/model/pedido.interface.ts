import { Cliente } from "./cliente.interface";
import { Pagamento } from "./pagamento.interface";
import { PageableObject, SortObject } from "./page.interface";
import { Produto } from "./produto.interface";
import { Servico } from "./servico.interface";

export interface Pedido {
  codigo?: string;
  numeroPedido: number;
  cliente: Cliente;
  status: "CONCLUIDO" | "ABERTO" | "FECHADO" | "CANCELADO";
  itens: ItemPedido[];
  totalDesconto: number;
  total: number;
  nomeCliente: string;
  pagamentos: Pagamento[];
}

export interface ItemPedido {
  codigo?: number;
  produto?: Produto;
  servico?: Servico;
  quantidade: number;
  valorUnitario: number;
  desconto?: number;
  pedido?: {
    codigo: string;
  }
}

export interface PagePedidoResponse {
  totalElements: number;
  totalPages: number;
  pageable: PageableObject;
  numberOfElements: number;
  size: number;
  content: Pedido[];
  number: number;
  sort: SortObject;
  first: boolean;
  last: boolean;
  empty: boolean;
}
