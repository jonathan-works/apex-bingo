import { ref } from 'vue'
import { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import useNotify from 'src/composable/UseNotify'
import { ErrorApi } from 'src/model/error.interface'
import { vendedorService } from 'src/services/vendedor.service'
import { VendedorRequest, VendedorResponse } from 'src/model/vendedor.interface'

const notify = useNotify()

export const useVendedorStore = defineStore('vendedor', () => {
  const pagination = ref({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
  });
  const vendedor = ref<VendedorResponse | null>(null);
  const vendedorPaginados = ref<VendedorResponse[]>([]);
  const loading = ref(false);

  async function getVendedoresPaginado(page: number = 1, rowsPerPage: number = 10, filter = null) {
    try {
      loading.value = true
      const data = await vendedorService.list(filter, page - 1 , rowsPerPage);
      vendedorPaginados.value = data.content
      pagination.value.rowsNumber = data.totalElements
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorApi>
      notify.notifyErrorResponseAPI(err?.response?.data)
    } finally {
      loading.value = false
    }
  }
  async function criarVendedor(vendedor: VendedorRequest) {
    try {
      loading.value = true;
      await vendedorService.create(vendedor);
      await getVendedoresPaginado();
      notify.notifySuccess('Cliente criado com sucesso!');
    } catch (error) {
      const err = error as AxiosError<ErrorApi>;
      notify.notifyErrorResponseAPI(err?.response?.data);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function atualizarVendedor(vendedor: VendedorRequest) {
    try {
      loading.value = true;
      if (!vendedor.codigo) {
        throw new Error('Código do cliente é obrigatório para atualização');
      }
      await vendedorService.update(vendedor.codigo, vendedor);
      await getVendedoresPaginado();
      notify.notifySuccess('Cliente atualizado com sucesso!');
    } catch (error) {
      const err = error as AxiosError<ErrorApi>;
      notify.notifyErrorResponseAPI(err?.response?.data);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function excluirVendedor(codigo: string) {
    try {
      loading.value = true;
      if (!codigo) {
        throw new Error('Código do cliente é obrigatório para excluir');
      }
      await vendedorService.delete(codigo);
      await getVendedoresPaginado();
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
    loading,
    vendedor,
    pagination,
    criarVendedor,
    excluirVendedor,
    vendedorPaginados,
    atualizarVendedor,
    getVendedoresPaginado,
  }
})