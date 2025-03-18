import useApi from 'src/composable/UseApi';
import { ClienteFilter, ClienteRequest, ClienteResponse, PageClienteResponse } from 'src/model/cliente.interface';

export const clienteService = {
  async list(filter: ClienteFilter| null = null, page = 0, size = 10, order = 'desc', coluna = 'codigo'): Promise<PageClienteResponse> {
    let request = { page, size, order, coluna };
    
    if(filter !== null) {
      request = { ...request, ...filter };
    }
    return await useApi('/api/v1/clientes').list(request);
  },

  async create(request: ClienteRequest): Promise<ClienteResponse> {
    return await useApi('/api/v1/clientes').post(request);
  },

  async update(id: number, request: ClienteRequest): Promise<ClienteResponse> {
    return await useApi('/api/v1/clientes').update(request, id);
  },

  async delete(id: number): Promise<void> {
    return await useApi('/api/v1/clientes').remove(id);
  },

  async findById(id: number): Promise<ClienteResponse> {
    return await useApi(`/api/v1/clientes/${id}`).list();
  }
};
