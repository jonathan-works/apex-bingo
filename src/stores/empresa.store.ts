import { ref } from 'vue'
import { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import useNotify from 'src/composable/UseNotify'
import { ErrorApi } from 'src/model/error.interface'
import { empresaService } from 'src/services/empresa.service'
import { EmpresaResponse } from 'src/model/empresa.interface'

const notify = useNotify()

export const useEmpresaStore = defineStore('empresa', () => {
  const empresas = ref<EmpresaResponse[]>([])
  const loading = ref(false)

  async function buscarEmpresas() {
    try {
      loading.value = true
      const data = await empresaService.list()
      empresas.value = data.content
    } finally {
      loading.value = false
    }
  }

  async function salvarEmpresa(empresa: EmpresaResponse) {
    try {
      loading.value = true
      if (empresa.codigo) {
        await empresaService.update(empresa.codigo, empresa)
      } else {
        await empresaService.create(empresa)
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
      await empresaService.delete(Number(id))
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
