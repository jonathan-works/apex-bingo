import { defineStore } from 'pinia'
import { produtoService } from 'src/service/produto.service'
import { ref } from 'vue'
import { Produto } from 'src/model/produto.interface'
import { AxiosError } from 'axios'
import useNotify from 'src/composable/UseNotify'
import { ErrorApi } from 'src/model/error.interface'

const notify = useNotify()

export const useProdutoStore = defineStore('produto', () => {
  const produtos = ref<Produto[]>([])
  const loading = ref(false)

  async function buscarProdutos(page = 0, size = 10, filter = '') {
    try {
      loading.value = true
      const { data } = await produtoService.listarProdutos(page, size, filter)
      produtos.value = data.content
    } finally {
      loading.value = false
    }
  }

  async function salvarProduto(produto: Produto) {
    try {
      loading.value = true
      if (produto.codigo) {
        await produtoService.atualizarProduto(Number(produto.codigo), produto)
      } else {
        await produtoService.criarProduto(produto)
      }
      await buscarProdutos()
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApi>
      notify.notifyErrorResponseAPI(err?.response?.data)
    } finally {
      loading.value = false
    }
  }

  async function excluirProduto(id: string) {
    try {
      loading.value = true
      await produtoService.excluirProduto(Number(id))
      await buscarProdutos()
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApi>
      notify.notifyErrorResponseAPI(err?.response?.data)
    } finally {
      loading.value = false
    }
  }

  return {
    produtos,
    loading,
    buscarProdutos,
    salvarProduto,
    excluirProduto
  }
})
