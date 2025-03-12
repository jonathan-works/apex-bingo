import useApi from 'src/composable/UseApi';
import { ClienteFilter, ClienteRequest, ClienteResponse, PageClienteResponse } from 'src/model/cliente.interface';

export const clienteService = {
  async list(filter: ClienteFilter| null = null, page = 0, size = 10, order = 'desc', coluna = 'codigo'): Promise<PageClienteResponse> {
    return await useApi('/api/v1/clientes').list({ filter, page, size, order, coluna });
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
