import { defineStore } from 'pinia';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Pagamento } from 'src/model/pagamento.interface';
import { pedidoService } from 'src/service/pedido.service';
import { produtoService} from 'src/service/produto.service';
import { servicoService } from 'src/service/servico.service';
import { clienteService } from 'src/service/cliente.service';
import { ItemPedido, Pedido } from 'src/model/pedido.interface';
import { pagamentoService } from 'src/service/pagamento.service';
import { PageProdutoResponse, Produto } from 'src/model/produto.interface';
import { PageServicoResponse, Servico } from 'src/model/servico.interface';
import { Cliente, PageClienteResponse } from 'src/model/cliente.interface';
import { CondicaoPagamento } from 'src/model/condicao-pagamento.interface';
import { condicaoPagamentoService } from 'src/service/condicao-pagamento.service';
import { ErrorApi } from 'src/model/error.interface';
import useNotify from 'src/composable/UseNotify';
import { MeioPagamento } from 'src/model/meio-pagamento.enum';
import { Loading } from 'quasar';
import { Router } from 'vue-router';

const notify = useNotify();

export const usePedidoComandaStore = defineStore('pedido-comanda', {
  state: () => ({
    paginationServicos: {
      page: 1 as number,
      rowsPerPage: 20 as number,
      rowsNumber: 0 as number
    },
    paginationProdutos: {
      page: 1 as number,
      rowsPerPage: 20 as number,
      rowsNumber: 0 as number
    },
    paginationClientes: {
      page: 1 as number,
      rowsPerPage: 1000 as number,
      rowsNumber: 0 as number
    },
    drawerComandaDigitalIsOpen: false as boolean,
    dialogSelecaoClienteIsOpen: false as boolean,
    dialogPagamentoIsOpen: false as boolean,
    clienteSelecionado: null as Cliente | string | null,
    condicaoPagamentoSelecionada: null as CondicaoPagamento | null,
    meioPagamentoSelecionado: null as MeioPagamento | null,
    valorPago: 0 as Number,
    filter: '' as string,
    pedido: null as Pedido | null,
    pagamento: null as Pagamento | null,
    servicos: null as Servico[] | null,
    produtos: null as Produto[] | null,
    clientes: null as Cliente[] | null,
    clientesFiltrados: null as Cliente[] | null,
    condicoesPagamento: null as CondicaoPagamento[] | null,

    // totalPago: 0 as number,
    //valorTroco: 0 as number,
    pedidoTodoPago: false as boolean
  }),

  getters:{
    vazio: (state) => (state.pedido?.itens.length || 0) < 1,
    quantidade: (state) => state.pedido?.itens.length || 0,
    valorTotalAPagar: (state) => (state.pedido?.total || 0) - (state.pedido?.pagamentos?.reduce((total, pagamento) => total + pagamento.valor, 0)),
    valorTroco: (state) => ((usePedidoComandaStore().totalPago - (state.pedido?.total || 0)) > 0 ? usePedidoComandaStore().totalPago - (state.pedido?.total || 0) : 0),
    totalPago: (state) => state.pedido?.pagamentos?.reduce((total, pagamento) => total + pagamento?.valor, 0) || 0,
    dividaQuitada: (state)  => usePedidoComandaStore().valorTroco <= 0 && usePedidoComandaStore().valorTotalAPagar <= 0 && !usePedidoComandaStore().vazio,
    dividaParcialmenteQuitada: (state)  => ((state.pedido?.pagamentos?.length || 0) > 0) && usePedidoComandaStore().valorTotalAPagar !== 0 && !usePedidoComandaStore().vazio
  },
  actions: {
    carregarPedido(codigoPedido: string) {
      Loading.show();
      return pedidoService.buscarPedido(codigoPedido)
        .then(( { data }: AxiosRequestConfig<Pedido>) => {
          this.pedido = data as Pedido;
          this.clienteSelecionado = this.pedido.cliente;
          Loading.hide();
        })
        .catch((error: AxiosError) => {
          Loading.hide();
          throw error;
        })
    },
    carregarServicos() {
      return servicoService.listarServicos(this.paginationServicos.page - 1, this.paginationServicos.rowsPerPage, this.filter)
        .then(( { data }: AxiosRequestConfig<PageServicoResponse>) => {
          this.servicos = data?.content as Servico[];
          this.paginationServicos.rowsNumber = data?.totalElements as number;
        })
    },
    carregarProdutos() {
      return produtoService.listarProdutos(this.paginationProdutos.page - 1, this.paginationProdutos.rowsPerPage, this.filter)
        .then(( { data }: AxiosRequestConfig<PageProdutoResponse>) => {
          this.produtos = data?.content as Produto[];
          this.paginationProdutos.rowsNumber = data?.totalElements as number;
        })
    },
    carregarClientes() {
      return clienteService.listarClientes(this.paginationClientes.page - 1, this.paginationClientes.rowsPerPage, this.filter)
        .then(( { data }: AxiosRequestConfig<PageClienteResponse>) => {
          this.clientes = data?.content as Cliente[];
          this.paginationClientes.rowsNumber = data?.totalElements as number;
        })
    },
    carregarCondicoesPagamento() {
      return condicaoPagamentoService.listarCondicoesPagamento()
        .then(( { data }: AxiosRequestConfig<CondicaoPagamento[]>) => {
          this.condicoesPagamento = data as CondicaoPagamento[];
        })
    },
    addCliente(){
      if(this.clienteSelecionado === null){
        return
      }
      if(!this.pedido?.codigo){
        return
      }

      if(typeof this.clienteSelecionado === 'string'){
        return pedidoService.adicionarClientePorNome(this.pedido.codigo, this.clienteSelecionado)
          .then(({data}) => {
            this.pedido = data as Pedido;
          })
      }else if(typeof this.clienteSelecionado === 'object'){
        return pedidoService.adicionarClientePorId(this.pedido.codigo, this.clienteSelecionado.pessoa.codigo as number)
          .then(({data}) => {
            this.pedido = data as Pedido;
          })
      }
    },
    toogleCarrinho(pedidoTodoPago: boolean | null = null){
      if(typeof pedidoTodoPago === "boolean" &&pedidoTodoPago !== null){
        this.drawerComandaDigitalIsOpen = pedidoTodoPago;
        return;
      }

      this.drawerComandaDigitalIsOpen = !this.drawerComandaDigitalIsOpen;
    },
    adicionarCarrinho(itemPedido: ItemPedido, router: Router | null = null){
      if(this.pedido?.status === 'CONCLUIDO' || this.pedido?.status === 'CANCELADO'){
        return;
      }
      if(!itemPedido){
        return;
      }
      if(!this.pedido?.codigo){
        return this.iniciarPedido(itemPedido)?.then(() => {
          if(router){
            router.push({name: "pedidos", query: { p: this.pedido?.codigo }});
          }
          notify.notifySuccess("Pedido iniciado com sucesso! Item adicionado ao carrinho!");
        }).catch(({response} : AxiosError<ErrorApi>) => {
          notify.notifyErrorResponseAPI(response?.data);
          throw response;
        });
      }

      return pedidoService.adicionarItemPedido(this.pedido.codigo, itemPedido)
      .then(({data}) => {
        this.pedido = data as Pedido ;
        notify.notifySuccess("Item adicionado ao carrinho!");
      })
      .catch(({response} : AxiosError<ErrorApi>) => {
        notify.notifyErrorResponseAPI(response?.data)
        throw response;
      })
    },
    removerCarrinho(itemPedido: ItemPedido){
      if(!itemPedido){
        return;
      }
      const carrinho = this.pedido as Pedido

      if(carrinho?.itens){
        carrinho?.itens.filter(x => x.codigo !== itemPedido.codigo);
      };

      this.pedido = carrinho;
    },
    openDialogSelecaoCliente(){
      this.dialogSelecaoClienteIsOpen = true;
    },
    openDialogPagamento(){
      this.dialogPagamentoIsOpen = true;
    },
    iniciarPedido(itemPedido: ItemPedido){
      if(!itemPedido){
        return
      }
      return pedidoService.criarPedido(itemPedido)
      .then(({data}) => {
        this.pedido = data as Pedido;
        if(this.drawerComandaDigitalIsOpen === false){
          this.toogleCarrinho(true);
        }
      })
    },
    async registrarPagamento(){
      const pagamento = {
        valor: this.valorPago,
        statusPagamento: "PROCESSANDO",
        meioPagamento: this.condicaoPagamentoSelecionada?.meioPagamento,
        pedido: { codigo: this.pedido?.codigo },
        condicaoPagamento: this.condicaoPagamentoSelecionada,
      } as Pagamento

      return await pagamentoService.registrarPagamento(pagamento).then(async ({data}) => {
        this.carregarPedido(this.pedido.codigo as string);
        await notify.notifySuccess("Pagamento Registrado com sucesso!")
        this.pagamento = data as Pagamento;
        //this.totalPago = this.totalPago + +this.valorPago;
        if(!this.dividaQuitada){
          this.valorPago = this.valorTotalAPagar;
          // setTimeout(() => {
          //   notify.notifyWarning("Ainda há valores a serem pagos!")
          // }, 1000);
        }else{
          this.pedidoTodoPago = true;
        }
        Loading.hide();
      }).catch((error) => {
        const err = error as AxiosError<ErrorApi>
        notify.notifyErrorResponseAPI(err?.response?.data)
      })

    },
    concluirPedido(){
      if(!this.pedido?.codigo){
        return;
      }
      return pedidoService.concluirPedido(this.pedido.codigo)
      .then(({ data }) => {
        notify.notifySuccess("Pedido concluido com sucesso!");
        this.dialogPagamentoIsOpen = false;
        this.toogleCarrinho();
        this.pedido = null;
        this.condicaoPagamentoSelecionada = null;
        this.meioPagamentoSelecionado = null;
        this.valorPago = 0
       // this.totalPago = 0;
        this.clienteSelecionado = null;
        this.condicaoPagamentoSelecionada = null;
        this.pedidoTodoPago = false;
      })
    },
    fecharPedido(){
      if(!this.pedido?.codigo){
        return;
      }
      return pedidoService.fecharPedido(this.pedido.codigo).then(({data}: AxiosResponse<Pedido, any>) => {
        this.pedido = data as Pedido;
      })
    },
    cancelarPedido(){
      if(!this.pedido?.codigo){
        return;
      }
      return pedidoService.cancelarPedido(this.pedido.codigo)
      .then(() => {
        this.toogleCarrinho();
        this.pedido = null;
        this.clienteSelecionado = null;
        this.condicaoPagamentoSelecionada = null;
      })
    },
    editarQuantidade(codigoProduto: number, quantidade: number){
      Loading.show();
      return pedidoService.editarQuantidade(this.pedido?.codigo as number, codigoProduto, quantidade)
      .then(({data}) => {
        this.pedido = data as Pedido;
        Loading.hide();
      })
      .catch((error: AxiosError) => {
        Loading.hide();
        throw error;
      })
    }
  },
});
