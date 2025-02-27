import { api } from 'src/boot/axios';
import { PageProdutoResponse, Produto } from 'src/model/produto.interface';

export const produtoService = {
  async listarProdutos(page = 0, size = 10, nome = '') {
    const params: any = {
      page,
      size,
      order: 'desc',
      coluna: 'codigo'
    };

    if (nome) {
      params.produtoFilter = { nome };
    }

    return await api.get<PageProdutoResponse>('api/v1/produtos', { params });
  },

  async criarProduto(produto: Produto) {
    return await api.post('api/v1/produtos', produto);
  },

  async atualizarProduto(id: number, produto: Produto) {
    return await api.put(`api/v1/produtos/${id}`, produto);
  },

  async excluirProduto(id: number) {
    return await api.delete(`api/v1/produtos/${id}`);
  },

  async buscarProduto(id: number) {
    return await api.get(`api/v1/produtos/${id}`);
  }
};
