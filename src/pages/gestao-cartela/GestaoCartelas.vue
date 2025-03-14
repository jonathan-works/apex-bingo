<template>
    <q-page padding>
        <div class="q-pa-md">
            <q-table
                title="Gestão de Cartelas"
                :rows="gestaoCartelaStore.gestaoCartelasPaginados"
                :columns="columns"
                row-key="codigo"
                :loading="gestaoCartelaStore.loading"
                v-model:pagination="gestaoCartelaStore.pagination"
                @request="onRequest"
                :grid="$q.screen.lt.md || isGridView"
            >
                <template v-slot:top-right>
                    <div class="row items-center">
                        <ButtonToggleView
                          v-if="!$q.screen.lt.md"
                          v-model:isGrid="isGridView"
                        />
                        <q-btn color="primary" label="Nova Cartela" @click="openDialog()" class="q-ml-sm" />
                    </div>
                </template>

                <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4" v-if="$q.screen.lt.md || isGridView">
                    <q-card>
                    <q-card-section>
                        <div class="text-h6">{{ props.row?.evento?.descricao }}</div>
                        <div class="text-subtitle2">Status: {{ StatusCartela[props.row?.status] }}</div>
                        <div class="text-subtitle2">Vendedor: {{ props.row?.vendedor?.pessoa.nome }}</div>
                        <div class="text-subtitle2">Descrição: {{ props.row.descricao }}</div>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="center">
                        <q-btn
                          flat
                          round
                          color="primary"
                          icon="edit"
                          @click="editar(props.row)"
                        >
                          <q-tooltip>Editar</q-tooltip>
                        </q-btn>
                        <q-btn
                          flat
                          round
                          color="negative"
                          icon="delete"
                          @click="confirmarExclusao(props.row)"
                        >
                          <q-tooltip>Excluir</q-tooltip>
                        </q-btn>
                    </q-card-actions>
                    </q-card>
                </div>
                </template>

                <template v-slot:body-cell-actions="props">
                  <q-td :props="props" class="q-gutter-sm">
                    <q-btn
                      flat
                      round
                      color="primary"
                      icon="preview"
                      @click="visualizar(props.row)"
                    >
                      <q-tooltip>Visualizar</q-tooltip>
                    </q-btn>
                      <!-- <q-btn
                      flat
                      round
                      color="primary"
                      icon="edit"
                      @click="editar(props.row)"
                      >
                      <q-tooltip>Editar</q-tooltip>
                      </q-btn> -->
                      <q-btn
                        flat
                        round
                        color="negative"
                        icon="delete"
                        @click="confirmarExclusao(props.row)"
                      >
                        <q-tooltip>Excluir</q-tooltip>
                      </q-btn>
                  </q-td>
                </template>
            </q-table>
        </div>
        <GestaoCartelasDialog
            v-model="showDialog"
            :gestao-cartela="gestaoCartelaStore.gestaoCartela"
        />
        <GestaoCartelasViewDialog
            v-model="showDialogView"
            :gestao-cartela="gestaoCartelaStore.gestaoCartela"
        />
    </q-page>
</template>

<script setup lang="ts">
import { QTableColumn, useQuasar } from 'quasar';
import { ref, onMounted } from 'vue';
import { StatusCartela } from 'src/model/status-cartela.enum';
import GestaoCartelasDialog from './GestaoCartelasDialog.vue';
import GestaoCartelasViewDialog from './GestaoCartelasViewDialog.vue';
import { useGestaoCartelaStore } from 'src/stores/gestao-cartela.store';
import ButtonToggleView from 'src/components/button/ButtonToggleView.vue';
import { GestaoCartelaResponse } from 'src/model/gestao-cartela.interfave';

const $q = useQuasar();
const gestaoCartelaStore = useGestaoCartelaStore();
const isGridView = ref(false);
const showDialog = ref(false);
const showDialogView = ref(false);
const filter = ref(null);

const columns: QTableColumn[] = [
    // { name: 'codigo', required: true, label: 'Código', align: 'left', field: 'codigo', sortable: true },
    { name: 'dataCadastro', required: true, label: 'Data de Cadastro', align: 'left', field: 'dataCadastro', sortable: true },
    { name: 'evento', label: 'Evento', field: (row: GestaoCartelaResponse) => row.evento?.descricao, sortable: true },
    { name: 'status', label: 'Status', align: 'center', field: (row: GestaoCartelaResponse) => StatusCartela[row.status as keyof typeof StatusCartela], sortable: true },
    { name: 'vendedor', label: 'Vendedor', align: 'center', field: (row: GestaoCartelaResponse) => row.vendedor?.pessoa.nome, sortable: true },
    { name: 'descricao', required: true, label: 'Descrição', align: 'left', field: 'descricao', sortable: true },
    { name: 'actions', label: 'Ações', field: 'actions', sortable: false }
];

onMounted(async () => {
  await gestaoCartelaStore.getGestaoCartelaPaginado();
});

async function onRequest(props: any) {
  gestaoCartelaStore.pagination = props.pagination;
  await gestaoCartelaStore.getGestaoCartelaPaginado();
}

function openDialog(gestaoCartela?: GestaoCartelaResponse) {
  gestaoCartelaStore.gestaoCartela = gestaoCartela ? { ...gestaoCartela } : null;
  showDialog.value = true;
}

function openDialogView(gestaoCartela?: GestaoCartelaResponse) {
  gestaoCartelaStore.gestaoCartela = gestaoCartela ? { ...gestaoCartela } : null;
  showDialogView.value = true;
}

function editar(gestaoCartela: GestaoCartelaResponse) {
  openDialog(gestaoCartela);
}

function visualizar(gestaoCartela: GestaoCartelaResponse) {
  openDialogView(gestaoCartela);
}

function confirmarExclusao(gestaoCartela: GestaoCartelaResponse) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Deseja realmente excluir a cartela do evento: ${gestaoCartela?.evento?.descricao}?`,
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
      await gestaoCartelaStore.excluirGestaoCartela(Number(gestaoCartela.codigo));
      await gestaoCartelaStore.getGestaoCartelaPaginado(
        gestaoCartelaStore.pagination.page, 
        gestaoCartelaStore.pagination.rowsPerPage, 
        filter.value
      );
    } catch (error) {
      // Erro já tratado no store
    }
  });
}
</script>
