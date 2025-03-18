import { ref } from 'vue'
import { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import useNotify from 'src/composable/UseNotify'
import { ErrorApi } from 'src/model/error.interface'
import { EmpresaResponse } from 'src/model/empresa.interface'
import { ClienteFilter, ClienteResponse } from 'src/model/cliente.interface'
import { clienteService } from 'src/services/cliente.service'

const notify = useNotify()

export const useClienteStore = defineStore('cliente', () => {
  const pagination = ref({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
  });
  const cliente = ref<ClienteResponse | null>(null);
  const clientesPaginados = ref<ClienteResponse[]>([]);
  const empresas = ref<EmpresaResponse[]>([]);
  const empresasFiltradas = ref<EmpresaResponse[]>([]);
  const loading = ref(false);
  const filter = ref<ClienteFilter|null>(null);

  async function getClientesPaginado(page: number = 1, rowsPerPage: number = 10) {
    try {
      loading.value = true
      const data = await clienteService.list(filter.value, page - 1 , rowsPerPage);
      clientesPaginados.value = data.content
      pagination.value.rowsNumber = data.totalElements
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApi>
      notify.notifyErrorResponseAPI(err?.response?.data)
    } finally {
      loading.value = false
    }
  }
  async function criarCliente(cliente: ClienteResponse) {
    try {
      loading.value = true;
      await clienteService.create(cliente);
      await getClientesPaginado();
      notify.notifySuccess('Cliente criado com sucesso!');
    } catch (error) {
      const err = error as AxiosError<ErrorApi>;
      notify.notifyErrorResponseAPI(err?.response?.data);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function atualizarCliente(cliente: ClienteResponse) {
    try {
      loading.value = true;
      if (!cliente.codigo) {
        throw new Error('Código do cliente é obrigatório para atualização');
      }
      await clienteService.update(cliente.codigo, cliente);
      await getClientes();
      notify.notifySuccess('Cliente atualizado com sucesso!');
    } catch (error) {
      const err = error as AxiosError<ErrorApi>;
      notify.notifyErrorResponseAPI(err?.response?.data);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function excluirCliente(codigo: number) {
    try {
      loading.value = true;
      if (!codigo) {
        throw new Error('Código do cliente é obrigatório para excluir');
      }
      await clienteService.delete(codigo);
      await getClientesPaginado();
      notify.notifySuccess('Cliente excluído com sucesso!');
    } catch (error) {
      const err = error as AxiosError<ErrorApi>;
      notify.notifyErrorResponseAPI(err?.response?.data);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    filter,
    cliente,
    loading,
    empresas,
    pagination,
    criarCliente,
    excluirCliente,
    atualizarCliente,
    clientesPaginados,
    empresasFiltradas,
    getClientesPaginado,
  }
})