import { api } from 'src/boot/axios';
import { Empresa, EmpresaResponse, PageEmpresaResponse } from 'src/model/empresa.interface';

export const empresaService = {
  async listarEmpresas(page = 0, size = 10, nome = '') {
    const params: any = {
      page,
      size,
      order: 'desc',
      coluna: 'codigo'
    };

    if (nome) {
      params.empresaFilter = { nome };
    }

    return await api.get<PageEmpresaResponse>('api/v1/empresas', { params });
  },

  async criarEmpresa(empresa: Empresa) {
    return await api.post('api/v1/empresas', empresa);
  },

  async atualizarEmpresa(id: number, empresa: Empresa) {
    return await api.put(`api/v1/empresas/${id}`, empresa);
  },

  async excluirEmpresa(id: number) {
    return await api.delete(`api/v1/empresas/${id}`);
  },

  async buscarEmpresa(id: number) {
    return await api.get(`api/v1/empresas/${id}`);
  }
};
