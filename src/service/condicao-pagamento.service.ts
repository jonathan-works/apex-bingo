import { api } from 'src/boot/axios';
import { CondicaoPagamento, CondicaoPagamentoResponse } from 'src/model/condicao-pagamento.interface';

export const condicaoPagamentoService = {
  async listarCondicoesPagamento() {
    return await api.get<CondicaoPagamentoResponse[]>('api/v1/condicao-pagamentos');
  },

  async criarCondicaoPagamento(condicaoPagamento: CondicaoPagamento) {
    return await api.post('api/v1/condicao-pagamentos', condicaoPagamento);
  },

  async atualizarCondicaoPagamento(id: number, condicaoPagamento: CondicaoPagamento) {
    return await api.put(`api/v1/condicao-pagamentos/${id}`, condicaoPagamento);
  },

  async excluirCondicaoPagamento(id: number) {
    return await api.delete(`api/v1/condicao-pagamentos/${id}`);
  },

  async buscarCondicaoPagamento(id: number) {
    return await api.get(`api/v1/condicao-pagamentos/${id}`);
  }
};
