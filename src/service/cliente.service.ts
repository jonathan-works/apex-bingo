import { api } from 'src/boot/axios';
import { Cliente, ClienteResponse, PageClienteResponse } from 'src/model/cliente.interface';

export const clienteService = {
  async listarClientes(page = 0, size = 10, nome = '') {
    const params: any = {
      page,
      size,
      order: 'desc',
      coluna: 'codigo'
    };

    if (nome) {
      params.clienteFilter = { nome };
    }

    return await api.get<PageClienteResponse>('api/v1/clientes', { params });
  },

  async criarCliente(cliente: Cliente) {
    return await api.post('api/v1/clientes', cliente);
  },

  async atualizarCliente(id: number, cliente: Cliente) {
    return await api.put(`api/v1/clientes/${id}`, cliente);
  },

  async excluirCliente(id: number) {
    return await api.delete(`api/v1/clientes/${id}`);
  },

  async buscarCliente(id: number) {
    return await api.get(`api/v1/clientes/${id}`);
  }
};
