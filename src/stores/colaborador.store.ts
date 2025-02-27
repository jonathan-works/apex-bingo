import { defineStore } from 'pinia'
import { colaboradorService } from 'src/service/colaborador.service'
import { ref } from 'vue'
import { Colaborador } from 'src/model/colaborador.interface'
import { AxiosError } from 'axios'
import useNotify from 'src/composable/UseNotify'
import { ErrorApi } from 'src/model/error.interface'

const notify = useNotify()

export const useColaboradorStore = defineStore('colaborador', () => {
  const colaboradores = ref<Colaborador[]>([])
  const loading = ref(false)

  async function buscarColaboradores() {
    try {
      loading.value = true
      const { data } = await colaboradorService.listarColaboradores()
      colaboradores.value = data.content
    } finally {
      loading.value = false
    }
  }

  async function salvarColaborador(colaborador: Colaborador) {
    try {
      loading.value = true
      if (colaborador.codigo) {
        await colaboradorService.atualizarColaborador(Number(colaborador.codigo), colaborador)
      } else {
        await colaboradorService.criarColaborador(colaborador)
      }
      await buscarColaboradores()
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApi>
      notify.notifyErrorResponseAPI(err?.response?.data)
    } finally {
      loading.value = false
    }
  }

  async function excluirColaborador(id: string) {
    try {
      loading.value = true
      await colaboradorService.excluirColaborador(Number(id))
      await buscarColaboradores()
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApi>
      notify.notifyErrorResponseAPI(err?.response?.data)
    } finally {
      loading.value = false
    }
  }

  return {
    colaboradores,
    loading,
    buscarColaboradores,
    salvarColaborador,
    excluirColaborador
  }
})
