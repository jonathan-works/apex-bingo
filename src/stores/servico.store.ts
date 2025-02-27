import { defineStore } from 'pinia'
import { servicoService } from 'src/service/servico.service'
import { ref } from 'vue'
import { Servico } from 'src/model/servico.interface'
import useNotify from 'src/composable/UseNotify';
import { AxiosError } from 'axios';
import { ErrorApi } from 'src/model/error.interface';

const notify = useNotify();

export const useServicoStore = defineStore('servico', () => {
  const servicos = ref<Servico[]>([])
  const loading = ref(false)

  async function buscarServicos() {
    try {
      loading.value = true
      const { data } = await servicoService.listarServicos()
      servicos.value = data.content
    } finally {
      loading.value = false
    }
  }

  async function salvarServico(servico: Servico) {
    try {
      loading.value = true
      if (servico.codigo) {
        await servicoService.atualizarServico(Number(servico.codigo), servico)
      } else {
        await servicoService.criarServico(servico)
      }
      await buscarServicos()
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApi>
      notify.notifyErrorResponseAPI(err?.response?.data)
    } finally {
      loading.value = false
    }
  }

  async function excluirServico(id: string) {
    try {
      loading.value = true
      await servicoService.excluirServico(Number(id))
      await buscarServicos()
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApi>
      notify.notifyErrorResponseAPI(err?.response?.data)
    } finally {
      loading.value = false
    }
  }

  return {
    servicos,
    loading,
    buscarServicos,
    salvarServico,
    excluirServico
  }
})
