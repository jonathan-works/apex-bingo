import useApi from 'src/composable/UseApi';
import { PageVendedorResponse, VendedorFilter, VendedorRequest, VendedorResponse } from 'src/model/vendedor.interface';

export const vendedorService = {
  async list(filter: VendedorFilter| null = null, page = 0, size = 10, order = 'desc', coluna = 'codigo'): Promise<PageVendedorResponse> {
    let request = { page, size, order, coluna };
    
    if(filter !== null) {
      request = { ...request, ...filter };
    }
    return await useApi('/api/v1/vendedores').list(request);
  },

  async listAll(): Promise<VendedorResponse[]> {
    return await useApi('/api/v1/vendedores/todos').list();
  },

  async create(request: VendedorRequest): Promise<VendedorResponse> {
    return await useApi('/api/v1/vendedores').post(request);
  },

  async update(id: number, request: VendedorRequest): Promise<VendedorResponse> {
    return await useApi('/api/v1/vendedores').update(request, id);
  },

  async delete(id: string): Promise<void> {
    return await useApi('/api/v1/vendedores').remove(id);
  },

  async findById(id: number): Promise<VendedorResponse> {
    return await useApi(`/api/v1/vendedores/${id}`).list();
  }
};
