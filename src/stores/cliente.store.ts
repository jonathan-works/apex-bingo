import { defineStore } from 'pinia'
import { clienteService } from 'src/service/cliente.service'
import { ref } from 'vue'
import { Cliente } from 'src/model/cliente.interface'
import { AxiosError } from 'axios'
import useNotify from 'src/composable/UseNotify'
import { ErrorApi } from 'src/model/error.interface'

const notify = useNotify()

export const useClienteStore = defineStore('cliente', () => {
  const clientes = ref<Cliente[]>([])
  const loading = ref(false)

  async function buscarClientes() {
    try {
      loading.value = true
      const { data } = await clienteService.listarClientes()
      clientes.value = data.content
    } finally {
      loading.value = false
    }
  }

  async function salvarCliente(cliente: Cliente) {
    try {
      loading.value = true
      if (cliente.codigo) {
        await clienteService.atualizarCliente(Number(cliente.codigo), cliente)
      } else {
        await clienteService.criarCliente(cliente)
      }
      await buscarClientes()
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApi>
      notify.notifyErrorResponseAPI(err?.response?.data)
    } finally {
      loading.value = false
    }
  }

  async function excluirCliente(id: string) {
    try {
      loading.value = true
      await clienteService.excluirCliente(Number(id))
      await buscarClientes()
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApi>
      notify.notifyErrorResponseAPI(err?.response?.data)
    } finally {
      loading.value = false
    }
  }

  return {
    clientes,
    loading,
    buscarClientes,
    salvarCliente,
    excluirCliente
  }
})
