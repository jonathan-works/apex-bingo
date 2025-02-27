import { defineStore } from 'pinia';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { pedidoService } from 'src/service/pedido.service';
import { PagePedidoResponse, Pedido } from 'src/model/pedido.interface';
import { Loading, useQuasar } from 'quasar';
import { Lancamento } from 'src/model/lancamento.interface';
import { TransacaoFinanceira } from 'src/model/transacaoFinanceira.interface';

export const usePedidoStore = defineStore('pedido', {
  state: () => ({
    paginationPedidosAbertos: {
      page: 1 as number,
      rowsPerPage: 12 as number,
      rowsNumber: 0 as number
    },
    paginationPedidosCancelados: {
      page: 1 as number,
      rowsPerPage: 12 as number,
      rowsNumber: 0 as number
    },
    paginationPedidosFechados: {
      page: 1 as number,
      rowsPerPage: 12 as number,
      rowsNumber: 0 as number
    },
    paginationPedidosConcluidos: {
      page: 1 as number,
      rowsPerPage: 12 as number,
      rowsNumber: 0 as number
    },
    filter: '' as string,
    pedido: null as Pedido | null,
    pedidos: null as Pedido[] | null,
    pedidosAbertos: null as Pedido[] | null,
    pedidosCancelados: null as Pedido[] | null,
    pedidosFechados: null as Pedido[] | null,
    pedidosConcluidos: null as Pedido[] | null,
    transacoesFinanceirasCaixa: null as TransacaoFinanceira | null,
    caridaDataIncio: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0] as string,
    caridaDataFim: new Date().toISOString().split('T')[0] as string
  }),
  actions: {
    carregarPedidosAbertos() {
      Loading.show()
      return pedidoService.listarPedidos(this.paginationPedidosAbertos.page - 1, this.paginationPedidosAbertos.rowsPerPage, "ABERTO", this.filter)
        .then(( { data }: AxiosRequestConfig<PagePedidoResponse>) => {
          this.pedidosAbertos = data?.content as Pedido[];
          this.paginationPedidosAbertos.rowsNumber = data?.totalElements as number;
          Loading.hide()
        })
        .catch((error: AxiosError) => {
          Loading.hide();
          throw error;
        })
    },
    carregarPedidosCancelados() {
      Loading.show()
      return pedidoService.listarPedidos(this.paginationPedidosCancelados.page - 1, this.paginationPedidosCancelados.rowsPerPage, "CANCELADO", this.filter)
        .then(( { data }: AxiosRequestConfig<PagePedidoResponse>) => {
          this.pedidosCancelados = data?.content as Pedido[];
          this.paginationPedidosCancelados.rowsNumber = data?.totalElements as number;
          Loading.hide()
        })
        .catch((error: AxiosError) => {
          Loading.hide();
          throw error;
        })
    },
    carregarPedidosFechados() {
      Loading.show()
      return pedidoService.listarPedidos(this.paginationPedidosFechados.page - 1, this.paginationPedidosFechados.rowsPerPage, "FECHADO", this.filter)
        .then(( { data }: AxiosRequestConfig<PagePedidoResponse>) => {
          this.pedidosFechados = data?.content as Pedido[];
          this.paginationPedidosFechados.rowsNumber = data?.totalElements as number;
          Loading.hide()
        })
        .catch((error: AxiosError) => {
          Loading.hide();
          throw error;
        })
    },
    carregarPedidosConcluidos() {
      Loading.show()
      return pedidoService.listarPedidos(this.paginationPedidosConcluidos.page - 1, this.paginationPedidosConcluidos.rowsPerPage, "CONCLUIDO", this.filter)
        .then(( { data }: AxiosRequestConfig<PagePedidoResponse>) => {
          this.pedidosConcluidos = data?.content as Pedido[];
          this.paginationPedidosConcluidos.rowsNumber = data?.totalElements as number;
          Loading.hide()
        })
        .catch((error: AxiosError) => {
          Loading.hide();
          throw error;
        })
    },
    carregarLancamentosNoCaixa() {
      Loading.show()
      return pedidoService.listarPedidosNoCaixa(this.caridaDataIncio, this.caridaDataFim)
      .then(( { data }: AxiosRequestConfig<TransacaoFinanceira>) => {

          const transacaoFinanceira: TransacaoFinanceira = {
            ...data as TransacaoFinanceira
          }
          transacaoFinanceira.lancamentos = transacaoFinanceira?.lancamentos?.filter((lancamento) => lancamento.pedido?.status === "FECHADO")
          this.transacoesFinanceirasCaixa = transacaoFinanceira;
          Loading.hide()
        })
        .catch((error) => {
          Loading.hide()
          throw error;
        })
    },
    cancelarPedido(id: string) {
      Loading.show()
      return pedidoService.cancelarPedido(id).then(() =>{
        Loading.hide()
      })
      .catch((error: AxiosError) => {
        Loading.hide();
        throw error;
      })

    }
  },
});
