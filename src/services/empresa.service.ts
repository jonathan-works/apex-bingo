import useApi from 'src/composable/UseApi';
import { EmpresaFilter, EmpresaRequest, EmpresaResponse, PageEmpresaResponse } from 'src/model/empresa.interface';

export const empresaService = {
  async list(filter: EmpresaFilter | null = null, page = 0, size = 10, order = 'desc', coluna = 'codigo'): Promise<PageEmpresaResponse> {
    return await useApi('/api/v1/empresas').list({ filter, page, size, order, coluna });
  },

  async listAll(): Promise<EmpresaResponse[]> {
    return await useApi('/api/v1/empresas/todos').list();
  },

  async create(request: EmpresaRequest): Promise<EmpresaResponse> {
    return await useApi('/api/v1/empresas').post(request);
  },

  async update(id: number, request: EmpresaRequest): Promise<EmpresaResponse> {
    return await useApi('/api/v1/empresas').update(request, id);
  },

  async delete(id: number): Promise<void> {
    return await useApi('/api/v1/empresas').remove(id);
  },

  async findById(id: number): Promise<EmpresaResponse> {
    return await useApi(`/api/v1/empresas/${id}`).list();
  }
};
