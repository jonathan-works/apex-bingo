import { api } from 'src/boot/axios';
import { PageServicoResponse, Servico } from 'src/model/servico.interface';

export const servicoService = {
  async listarServicos(page = 0, size = 10, nome = '') {
    const params: any = {
      page,
      size,
      order: 'desc',
      coluna: 'codigo'
    };

    if (nome) {
      params.servicoFilter = { nome };
    }

    return await api.get<PageServicoResponse>('api/v1/servicos', { params });
  },

  async criarServico(servico: Servico) {
    return await api.post('api/v1/servicos', servico);
  },

  async atualizarServico(id: number, servico: Servico) {
    return await api.put(`api/v1/servicos/${id}`, servico);
  },

  async excluirServico(id: number) {
    return await api.delete(`api/v1/servicos/${id}`);
  },

  async buscarServico(id: number) {
    return await api.get<Servico>(`api/v1/servicos/${id}`);
  }
};
