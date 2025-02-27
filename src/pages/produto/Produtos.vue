<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        title="Produtos"
        :rows="produtoStore.produtos"
        :columns="columns"
        row-key="codigo"
        :loading="produtoStore.loading"
        :pagination="pagination"
        @request="onRequest"
        :grid="$q.screen.lt.md || isGridView"
      >
        <template v-slot:top-right>
          <!-- <q-input
            v-model="filter"
            placeholder="Buscar"
            dense
            debounce="300"
            class="q-mr-md"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input> -->

          <div class="row items-center">
            <ButtonToggleView
              v-if="!$q.screen.lt.md"
              v-model:isGrid="isGridView"
            />
            <q-btn color="primary" label="Novo Produto" @click="novoProduto()" class="q-ml-sm" />
          </div>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4" v-if="$q.screen.lt.md || isGridView">
            <q-card>
              <q-card-section>
                <div class="text-h6">{{ props.row.nome }}</div>
                <div class="text-subtitle2">Valor de Custo: {{ formatCurrency(props.row.valorCusto) }}</div>
                <div class="text-subtitle2">Valor de Venda: {{ formatCurrency(props.row.valorVenda) }}</div>
                <div class="text-subtitle2">Comissão: {{ props.row.comissao }}%</div>
                <div class="text-subtitle2">Ordem: {{ props.row.orderExibicao }}</div>
                <div class="text-subtitle2">Estoque: {{ props.row.quantidadeEstoque }}</div>
                <div class="text-subtitle2">Desconto: {{ props.row.descontoMaximoPorcentagem }}%</div>
                <div class="text-subtitle2">Unidade: {{ props.row.unidadeMedida }}</div>
              </q-card-section>
              <q-separator />
              <q-card-actions align="center">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="edit"
                  @click="editarProduto(props.row)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click="excluirProduto(props.row)"
                >
                  <q-tooltip>Excluir</q-tooltip>
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </template>

        <template v-slot:body-cell-valorCusto="props">
          <q-td :props="props">
            {{ formatCurrency(props.value) }}
          </q-td>
        </template>

        <template v-slot:body-cell-valorVenda="props">
          <q-td :props="props">
            {{ formatCurrency(props.value) }}
          </q-td>
        </template>

        <template v-slot:body-cell-comissao="props">
          <q-td :props="props">
            {{ props.value }}%
          </q-td>
        </template>

        <template v-slot:body-cell-descontoMaximoPorcentagem="props">
          <q-td :props="props">
            {{ props.value }}%
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-sm">
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="editarProduto(props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="excluirProduto(props.row)"
            >
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <ProdutoDialog
      v-model="showDialog"
      :produto="produtoSelecionado"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar, Dialog } from 'quasar';
import ButtonToggleView from 'src/components/button/ButtonToggleView.vue';
import { produtoService } from 'src/service/produto.service';
import { Produto } from 'src/model/produto.interface';
import ProdutoDialog from './ProdutoDialog.vue';
import { useProdutoStore } from 'src/stores/produto.store';

const $q = useQuasar();
const produtoStore = useProdutoStore();
const loading = ref(false);
const produtos = ref<Produto[]>([]);
const filter = ref('');
const showDialog = ref(false);
const produtoSelecionado = ref<Produto | undefined>();
const isGridView = ref(false);

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const columns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left' as const },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' as const },
  { name: 'valorCusto', label: 'Valor Custo', field: 'valorCusto', align: 'right' as const },
  { name: 'valorVenda', label: 'Valor Venda', field: 'valorVenda', align: 'right' as const },
  { name: 'comissao', label: 'Comissão', field: 'comissao', align: 'right' as const },
  { name: 'orderExibicao', label: 'Ordem', field: 'orderExibicao', align: 'right' as const },
  { name: 'quantidadeEstoque', label: 'Estoque', field: 'quantidadeEstoque', align: 'right' as const },
  { name: 'descontoMaximoPorcentagem', label: 'Desconto', field: 'descontoMaximoPorcentagem', align: 'right' as const },
  { name: 'unidadeMedida', label: 'Unidade', field: 'unidadeMedida', align: 'left' as const },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' as const }
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

async function carregarProdutos(page: number, rowsPerPage: number, filter = '') {
  loading.value = true;
  try {
    const { data } = await produtoService.listarProdutos(page - 1, rowsPerPage, filter);
    produtos.value = data.content;
    pagination.value.rowsNumber = data.totalElements;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar produtos'
    });
  } finally {
    loading.value = false;
  }
}

async function onRequest(props: any) {
  const { page, rowsPerPage } = props.pagination;
  await carregarProdutos(page, rowsPerPage, filter.value);
}

function novoProduto() {
  produtoSelecionado.value = undefined;
  showDialog.value = true;
}

function editarProduto(produto: Produto) {
  produtoSelecionado.value = { ...produto };
  showDialog.value = true;
}

function excluirProduto(produto: Produto) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Deseja realmente excluir o produto ${produto.nome}?`,
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'primary'
    },
    ok: {
      label: 'Excluir',
      color: 'negative'
    },
    persistent: true
  }).onOk(async () => {
    try {
      await produtoStore.excluirProduto(produto.codigo!);
      await produtoStore.buscarProdutos();
      $q.notify({
        type: 'positive',
        message: 'Produto excluído com sucesso'
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao excluir produto'
      });
      console.error('Erro ao excluir produto:', error);
    }
  });
}

onMounted(async () => {
  await produtoStore.buscarProdutos();
});

// Registrar o Dialog plugin
Dialog.create = Dialog.create || useQuasar().dialog;
</script>
