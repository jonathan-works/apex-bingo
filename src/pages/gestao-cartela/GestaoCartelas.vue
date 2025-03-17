<template>
    <q-page padding>
        <div class="q-pa-md">
            <q-table
                :rows="gestaoCartelaStore.gestaoCartelasPaginados"
                :columns="columns"
                row-key="codigo"
                :loading="gestaoCartelaStore.loading"
                v-model:pagination="gestaoCartelaStore.pagination"
                @request="onRequest"
                :grid="$q.screen.lt.md || isGridView"
            >
                <template v-slot:top="props">
                    <div class="row q-gutter-y-md full-width">
                      <div class="col-12 row">
                        <div class="col-2 q-table__title">Gestão de Cartelas</div>

                        <q-space />

                        <q-btn
                          flat
                          round
                          icon="filter_alt"
                          @click="toggleFilter"
                        >
                          <q-tooltip>Mais filtros</q-tooltip>
                        </q-btn>

                        <ButtonToggleView
                          v-if="!$q.screen.lt.md"
                          v-model:isGrid="isGridView"
                        />
                        <q-btn color="primary" label="Nova Gestao de Cartela" @click="openDialog()" class="q-ml-sm" />
                      </div>
                      <div class="col-12" v-if="filterShow">
                        <div class="row q-col-gutter-md">
                          <div class="col-md-1 col-12">
                            <q-input
                              v-model="filter.numero"
                              label="Número"
                              type="number"
                              outlined
                              dense
                              clearable
                              @blur="onRequest"
                              @keyup.enter="onRequest"
                              @clear="onRequest"
                            />
                          </div>
                          <div class="col-md-2 col-12">
                            <q-input
                              v-model="filter.nome"
                              label="Evento"
                              outlined
                              dense
                              clearable
                              @blur="onRequest"
                              @keyup.enter="onRequest"
                              @clear="onRequest"
                            />
                          </div>
                          <div class="col-md-2 col-12">
                            <q-input
                              v-model="filter.documento"
                              label="Documento"
                              outlined
                              dense
                              clearable
                              @blur="onRequest"
                              @keyup.enter="onRequest"
                              @clear="onRequest"
                            />
                          </div>
                          <div class="col-md-1 col-12">
                              <q-select
                                dense
                                outlined
                                emit-value
                                map-options
                                v-model="filter.tipo"
                                :options="tipo"
                                label="Tipo"
                                clearable
                                @update:model-value="onRequest"
                                @keyup.enter="onRequest"
                                @clear="onRequest"
                            />
                          </div>
                          <div class="col-md-2 col-12">
                              <q-select
                                dense
                                outlined
                                emit-value
                                map-options
                                v-model="filter.statusCartela"
                                :options="status"
                                label="Status"
                                clearable
                                @update:model-value="onRequest"
                                @keyup.enter="onRequest"
                                @clear="onRequest"
                            />
                          </div>
                          <div class="col-md-4 col-12">
                              <SelectEvento
                                label="Evento"
                                emit-value
                                map-options
                                option-value="codigo"
                                v-model:items-filtrados="gestaoCartelaStore.eventosFiltrados"
                                v-model:items="gestaoCartelaStore.eventos"
                                v-model="filter.codigoEvento" 
                                clearable 
                                @update:model-value="onRequest"
                                @keyup.enter="onRequest"
                                @clear="onRequest"
                              />
                          </div>
                        </div>
                      </div>
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
        <GestaoCartelasCreatEditDialog
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
import { Tipo } from 'src/model/tipo.enum';
import { QTableColumn, useQuasar } from 'quasar';
import { ref, onMounted } from 'vue';
import { StatusCartela } from 'src/model/status-cartela.enum';
import GestaoCartelasCreatEditDialog from './GestaoCartelasCreatEditDialog.vue';
import GestaoCartelasViewDialog from './GestaoCartelasViewDialog.vue';
import { useGestaoCartelaStore } from 'src/stores/gestao-cartela.store';
import ButtonToggleView from 'src/components/button/ButtonToggleView.vue';
import SelectEvento from 'src/components/select/SelectEvento.vue';
import { GestaoCartelaFilter, GestaoCartelaResponse } from 'src/model/gestao-cartela.interfave';

const $q = useQuasar();
const gestaoCartelaStore = useGestaoCartelaStore();
const isGridView = ref(false);
const showDialog = ref(false);
const showDialogView = ref(false);
const filter = ref<GestaoCartelaFilter>({});
const filterShow = ref(false);
const tipo = Object.keys(Tipo).map((key) => ({ label: Tipo[key as keyof typeof Tipo], value: key as string }));
const status = Object.keys(StatusCartela).map((key) => ({ label: StatusCartela[key as keyof typeof StatusCartela], value: key as string }));

const columns: QTableColumn[] = [
    { name: 'dataCadastro', required: true, label: 'Data de Cadastro', align: 'left', field: 'dataCadastro', sortable: true },
    { name: 'evento', label: 'Evento', field: (row: GestaoCartelaResponse) => row.evento?.descricao, sortable: true },
    { name: 'status', label: 'Status', align: 'center', field: (row: GestaoCartelaResponse) => StatusCartela[row.status as keyof typeof StatusCartela], sortable: true },
    { name: 'vendedor', label: 'Vendedor', align: 'center', field: (row: GestaoCartelaResponse) => row.vendedor?.pessoa.nome, sortable: true },
    { name: 'descricao', required: true, label: 'Descrição', align: 'left', field: 'descricao', sortable: true },
    { name: 'actions', label: 'Ações', field: 'actions', sortable: false }
];

onMounted(() => {
  gestaoCartelaStore.getGestaoCartelaPaginado();
  gestaoCartelaStore.carregarEventos();
});

async function onRequest(props: any) {
  if(props?.pagination){
    gestaoCartelaStore.pagination = props.pagination;
  }
  if(Object.keys(filter.value).length > 0){
    gestaoCartelaStore.filter = filter.value as GestaoCartelaFilter;
  }
  await gestaoCartelaStore.getGestaoCartelaPaginado(
    gestaoCartelaStore.pagination.page, 
    gestaoCartelaStore.pagination.rowsPerPage
  );
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
        gestaoCartelaStore.pagination.rowsPerPage
      );
    } catch (error) {
      // Erro já tratado no store
    }
  });
}
function toggleFilter(){
  filterShow.value = !filterShow.value;
}
</script>
