import { defineStore } from 'pinia'
import { empresaService } from 'src/service/empresa.service'
import { ref } from 'vue'
import { Empresa } from 'src/model/empresa.interface'
import { AxiosError } from 'axios'
import useNotify from 'src/composable/UseNotify'
import { ErrorApi } from 'src/model/error.interface'

const notify = useNotify()

export const useEmpresaStore = defineStore('empresa', () => {
  const empresas = ref<Empresa[]>([])
  const loading = ref(false)

  async function buscarEmpresas() {
    try {
      loading.value = true
      const { data } = await empresaService.listarEmpresas()
      empresas.value = data.content
    } finally {
      loading.value = false
    }
  }

  async function salvarEmpresa(empresa: Empresa) {
    try {
      loading.value = true
      if (empresa.codigo) {
        await empresaService.atualizarEmpresa(Number(empresa.codigo), empresa)
      } else {
        await empresaService.criarEmpresa(empresa)
      }
      await buscarEmpresas()
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApi>
      notify.notifyErrorResponseAPI(err?.response?.data)
    } finally {
      loading.value = false
    }
  }

  async function excluirEmpresa(id: string) {
    try {
      loading.value = true
      await empresaService.excluirEmpresa(Number(id))
      await buscarEmpresas()
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApi>
      notify.notifyErrorResponseAPI(err?.response?.data)
    } finally {
      loading.value = false
    }
  }

  return {
    empresas,
    loading,
    buscarEmpresas,
    salvarEmpresa,
    excluirEmpresa
  }
})
