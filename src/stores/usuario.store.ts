import { ref } from 'vue'
import { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import useNotify from 'src/composable/UseNotify'
import { ErrorApi } from 'src/model/error.interface'
import { RoleResponse } from 'src/model/role.interface'
import { roleService } from 'src/services/role.service'
import { usuarioService } from 'src/services/usuario.service'
import { UsuarioRequest, UsuarioResponse } from 'src/model/usuario.interface'

const notify = useNotify()

export const useUsuarioStore = defineStore('usuario', () => {

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});
const usuario = ref<UsuarioResponse | null>(null);
const usuariosPaginados = ref<UsuarioResponse[]>([]);
const loading = ref(false);
const roles = ref<RoleResponse[]>([]);

async function getUsuariosPaginado(page: number = 1, rowsPerPage: number = 10, filter = null) {
    try {
    loading.value = true
    const data = await usuarioService.list(filter, page - 1 , rowsPerPage);
    usuariosPaginados.value = data.content
    pagination.value.rowsNumber = data.totalElements
    } catch (error: unknown) {
    const err = error as AxiosError<ErrorApi>
    notify.notifyErrorResponseAPI(err?.response?.data)
    } finally {
    loading.value = false
    }
}

async function carregarRoles() {
  try {
    loading.value = true;
    const data = await roleService.list();
    roles.value = data;
  } catch (error) {
    const err = error as AxiosError<ErrorApi>;
    notify.notifyErrorResponseAPI(err?.response?.data);
    throw error;
  } finally {
    loading.value = false;
  }
}

async function criarUsuario(usuario: UsuarioRequest) {
    try {
    loading.value = true;
    await usuarioService.create(usuario);
    await getUsuariosPaginado();
    notify.notifySuccess('Usuario criado com sucesso!');
    } catch (error) {
    const err = error as AxiosError<ErrorApi>;
    notify.notifyErrorResponseAPI(err?.response?.data);
    throw error;
    } finally {
    loading.value = false;
    }
}

async function atualizarUsuario(usuario: UsuarioRequest) {
    try {
    loading.value = true;
    if (!usuario.codigo) {
        throw new Error('Código do usuario é obrigatório para atualização');
    }
    await usuarioService.update(usuario.codigo, usuario);
    await getUsuariosPaginado();
    notify.notifySuccess('Evento atualizado com sucesso!');
    } catch (error) {
    const err = error as AxiosError<ErrorApi>;
    notify.notifyErrorResponseAPI(err?.response?.data);
    throw error;
    } finally {
    loading.value = false;
    }
}

async function excluirUsuario(codigo: number) {
    try {
    loading.value = true;
    if (!codigo) {
        throw new Error('Código do usuario é obrigatório para excluir');
    }
    await usuarioService.delete(codigo);
    await getUsuariosPaginado();
    notify.notifySuccess('Usuario excluído com sucesso!');
    } catch (error) {
    const err = error as AxiosError<ErrorApi>;
    notify.notifyErrorResponseAPI(err?.response?.data);
    throw error;
    } finally {
    loading.value = false;
    }
}

return {
  roles,
  usuario,
  loading,
  pagination,
  criarUsuario,
  carregarRoles,
  excluirUsuario,
  atualizarUsuario,
  usuariosPaginados,
  getUsuariosPaginado,
}
})
