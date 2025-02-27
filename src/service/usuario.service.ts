import { api } from 'src/boot/axios';
import { PageUsuarioResponse, Usuario } from 'src/model/usuario.interface';

export const usuarioService = {
  async listarUsuarios(page = 0, size = 10, nome = '') {

    const params: any = {
      page,
      size,
      order: 'desc',
      coluna: 'codigo'
    }

    if (nome) {
      params.clienteFilter = { nome };
    }

    return await api.get<PageUsuarioResponse>('api/v1/usuarios', { params });
  },

  async criarUsuario(usuario: Usuario) {
    return await api.post('api/v1/usuarios', usuario);
  },

  async atualizarUsuario(id: number, usuario: Usuario) {
    return await api.put(`api/v1/usuarios/${id}`, usuario);
  },

  async excluirUsuario(id: number) {
    return await api.delete(`api/v1/usuarios/${id}`);
  },

  async buscarUsuario(id: number) {
    return await api.get(`api/v1/usuarios/${id}`);
  }
};
