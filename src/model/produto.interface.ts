import { UnidadeMedida } from './unidade-medida.enum';

export interface Produto {
  codigo?: number;
  id?: number;
  nome: string;
  descricao: string;
  valorCusto: number;
  valorVenda: number;
  comissao: number;
  orderExibicao: number;
  quantidadeEstoque: number;
  descontoMaximoPorcentagem: number;
  unidadeMedida: UnidadeMedida;
  quantidade: number;
}

export interface PageProdutoResponse {
  totalElements: number;
  totalPages: number;
  pageable: PageableObject;
  numberOfElements: number;
  size: number;
  content: Produto[];
  number: number;
  sort: SortObject;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface PageableObject {
  unpaged: boolean;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: SortObject;
}

export interface SortObject {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}
