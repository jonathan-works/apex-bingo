import { defineStore } from 'pinia'
import { condicaoPagamentoService } from 'src/service/condicao-pagamento.service'
import { ref } from 'vue'
import { CondicaoPagamento } from 'src/model/condicao-pagamento.interface'

export const useCondicaoPagamentoStore = defineStore('condicaoPagamento', () => {
  const condicoesPagamento = ref<CondicaoPagamento[]>([])
  const loading = ref(false)

  async function buscarCondicoesPagamento() {
    try {
      loading.value = true
      const { data } = await condicaoPagamentoService.listarCondicoesPagamento()
      condicoesPagamento.value = data.content
    } finally {
      loading.value = false
    }
  }

  async function salvarCondicaoPagamento(condicao: CondicaoPagamento) {
    try {
      loading.value = true
      if (condicao.codigo) {
        await condicaoPagamentoService.atualizarCondicaoPagamento(Number(condicao.codigo), condicao)
      } else {
        await condicaoPagamentoService.criarCondicaoPagamento(condicao)
      }
      await buscarCondicoesPagamento()
    } finally {
      loading.value = false
    }
  }

  async function excluirCondicaoPagamento(id: string) {
    try {
      loading.value = true
      await condicaoPagamentoService.excluirCondicaoPagamento(Number(id))
      await buscarCondicoesPagamento()
    } finally {
      loading.value = false
    }
  }

  return {
    condicoesPagamento,
    loading,
    buscarCondicoesPagamento,
    salvarCondicaoPagamento,
    excluirCondicaoPagamento
  }
})
