import { api } from 'src/boot/axios';
import { ItemPedido, PagePedidoResponse, Pedido } from 'src/model/pedido.interface';
import { TransacaoFinanceira } from 'src/model/transacaoFinanceira.interface';

export const pedidoService = {

  async listarPedidos(page = 0, size = 10, status: "ABERTO" | "FECHADO" | "CANCELADO" | "CONCLUIDO", nome = '') {
    const params: any = {
      page,
      size,
      order: 'desc',
      coluna: 'codigo',
      status
    };

    if (nome) {
      params.clienteFilter = { nome };
    }

    return await api.get<PagePedidoResponse>('api/v1/pedidos', { params });
  },
  async listarPedidosNoCaixa(dataInicio: String, dataFinal: String) {
    const params = {
      dataInicio,
      dataFinal
    }
    return await api.get<TransacaoFinanceira>('api/v1/caixas', { params });
  },
  // async criarPedido(codigoCliente: number) {
  //   return await api.post('api/v1/pedidos', {codigo: codigoCliente});
  // },
  // async criarPedido(codigoCliente: number) {
  //   /api/v1/pedidos/{pedidoId}/nome-cliente
  //   return await api.post(`/api/v1/pedidos/${pedidoId}/nome-cliente`, {codigo: codigoCliente});
  // },

  async criarPedido(itemPedido: ItemPedido) {
    return await api.post('/api/v1/pedidos/itens', itemPedido);
  },
  async adicionarClientePorNome(codigoPedido: string, nomeCliete: String) {
    return await api.put(`api/v1/pedidos/${codigoPedido}/nome-cliente`, {codigo: codigoPedido, nome: nomeCliete});
  },
  async adicionarClientePorId(codigoPedido: string, codigoCliente: number) {
    return await api.put(`api/v1/pedidos/${codigoPedido}/cliente`, {codigo: codigoPedido, cliente: codigoCliente});
  },
  async adicionarItemPedido(codigoPedido: string, itemPedido: ItemPedido) {
    return await api.post(`api/v1/pedidos/${codigoPedido}/itens`, itemPedido);
  },
  async concluirPedido(codigoPedido: string) {
    return await api.post(`/api/v1/pedidos/${codigoPedido}/concluir`);
  },
  async fecharPedido(codigoPedido: string) {
    return await api.post(`/api/v1/pedidos/${codigoPedido}/fechar`);
  },
  async cancelarPedido(codigoPedido: string) {
    return await api.delete(`/api/v1/pedidos/${codigoPedido}/cancelar`);
  },
  async buscarPedido(codigoPedido: string) {
    return await api.get(`api/v1/pedidos/${codigoPedido}`);
  },
  async editarQuantidade(codigoPedido: number|string, codigoProduto: number, quantidade: number) {
    return await api.put(`api/v1/pedidos/${codigoPedido}/itens/${codigoProduto}/quantidade`, {novaQuantidade: quantidade})
  }
};
