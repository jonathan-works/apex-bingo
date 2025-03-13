import { ref } from 'vue'
import { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import useNotify from 'src/composable/UseNotify'
import { ErrorApi } from 'src/model/error.interface'
import { EmpresaResponse } from 'src/model/empresa.interface'
import { ClienteResponse } from 'src/model/cliente.interface'
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

  async function getClientesPaginado(page: number = 1, rowsPerPage: number = 10, filter = null) {
    try {
      loading.value = true
      const data = await clienteService.list(filter, page - 1 , rowsPerPage);
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



// import { defineStore } from 'pinia'
// import { ClienteRequest, ClienteResponse, PageClienteResponse } from 'src/interfaces/cliente.interface'
// import { createCliente, deleteCliente, findAllClientes, findClienteById, updateCliente } from 'src/services/cliente.service'


// export const useClienteStore = defineStore('cliente', {
//   state: (): ClienteState => ({
//     clientes: [],
//     cliente: null,
//     loading: false,
//     totalPages: 0,
//     totalElements: 0
//   }),

//   actions: {
//     async fetchClientes (page: number, size: number, order: string, coluna: string, filter: any) {
//       try {
//         this.loading = true
//         const response: PageClienteResponse = await findAllClientes(page, size, order, coluna, filter)
//         this.clientes = response.content
//         this.totalPages = response.totalPages
//         this.totalElements = response.totalElements
//       } finally {
//         this.loading = false
//       }
//     },

//     async fetchClienteById (id: number) {
//       try {
//         this.loading = true
//         this.cliente = await findClienteById(id)
//       } finally {
//         this.loading = false
//       }
//     },

//     async saveCliente (cliente: ClienteRequest) {
//       try {
//         this.loading = true
//         if (cliente.codigo) {
//           await updateCliente(cliente.codigo, cliente)
//         } else {
//           await createCliente(cliente)
//         }
//       } finally {
//         this.loading = false
//       }
//     },

//     async removeCliente (id: number) {
//       try {
//         this.loading = true
//         await deleteCliente(id)
//         this.clientes = this.clientes.filter(c => c.codigo !== id)
//       } finally {
//         this.loading = false
//       }
//     }
//   }
// })
