import { api } from 'src/boot/axios';
import { Colaborador, ColaboradorResponse, PageColaboradorResponse } from 'src/model/colaborador.interface';

export const colaboradorService = {
  async listarColaboradores(page = 0, size = 10, nome = '') {
    const params: any = {
      page,
      size,
      order: 'desc',
      coluna: 'codigo'
    };

    if (nome) {
      params.colaboradorFilter = { nome };
    }

    return await api.get<PageColaboradorResponse>('api/v1/colaboradores', { params });
  },

  async criarColaborador(colaborador: Colaborador) {
    return await api.post('api/v1/colaboradores', colaborador);
  },

  async atualizarColaborador(id: number, colaborador: Colaborador) {
    return await api.put(`api/v1/colaboradores/${id}`, colaborador);
  },

  async excluirColaborador(id: number) {
    return await api.delete(`api/v1/colaboradores/${id}`);
  },

  async buscarColaborador(id: number) {
    return await api.get(`api/v1/colaboradores/${id}`);
  }
};
