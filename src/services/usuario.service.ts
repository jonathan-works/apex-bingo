import useApi from 'src/composable/UseApi';
import { UsuarioFilter, UsuarioRequest, UsuarioResponse } from 'src/model/usuario.interface';

export const usuarioService = {
  async list(filter: UsuarioFilter| null = null, page = 0, size = 10, order = 'desc', coluna = 'codigo'): Promise<PageEventoResponse> {
    return await useApi('/api/v1/usuarios').list({ filter, page, size, order, coluna });
  },

  async create(request: UsuarioRequest): Promise<UsuarioResponse> {
    return await useApi('/api/v1/usuarios').post(request);
  },

  async update(id: number, request: UsuarioRequest): Promise<UsuarioResponse> {
    return await useApi('/api/v1/usuarios').update(request, id);
  },

  async delete(id: number): Promise<void> {
    return await useApi('/api/v1/usuarios').remove(id);
  },

  async findById(id: number): Promise<UsuarioResponse> {
    return await useApi(`/api/v1/usuarios/${id}`).list();
  }
};
