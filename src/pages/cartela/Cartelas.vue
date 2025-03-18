<template>
    <q-page padding>
        <div class="q-pa-md">
            <q-table
                :rows="cartelaStore.cartelasPaginadas"
                :columns="columns"
                row-key="codigo"
                :loading="cartelaStore.loading"
                v-model:pagination="cartelaStore.pagination"
                @request="onRequest"
                :grid="$q.screen.lt.md || isGridView"
            >
              <template v-slot:top>
                <div class="row q-gutter-y-md full-width">
                  <div class="col-12 row">
                    <div class="col-md-4 col-12">
                      <div class="col-2 q-table__title">Cartelas</div>
                    </div>
                    <div class="col-md col-12 row justify-end q-col-gutter-x-md">
                      <div class="col-md-auto col-12">
                        <q-btn
                          flat
                          round
                          dense
                          icon="cloud_upload"
                          @click="openDialogUpload"
                        >
                          <q-tooltip>Importar cartelas</q-tooltip>
                        </q-btn>
                      </div>
                      <div class="col-md-auto col-12">
                        <q-btn
                          flat
                          round
                          dense
                          icon="filter_alt"
                          @click="toggleFilter"
                        >
                          <q-tooltip>Mais filtros</q-tooltip>
                        </q-btn>
                      </div>

                      <div class="col-md-auto col-12">
                        <ButtonToggleView
                          v-if="!$q.screen.lt.md"
                          v-model:isGrid="isGridView"
                        />
                      </div>

                      <div class="col-md-auto col-12">
                        <q-btn color="primary" label="Nova Cartela" @click="openDialog()" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12" v-if="filterShow">
                    <div class="row q-col-gutter-md">
                      <div class="col-md-2 col-12">
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
                            v-model:items-filtrados="cartelaStore.eventosFiltrados"
                            v-model:items="cartelaStore.eventos"
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
                      <div class="text-subtitle2">Numero: {{ props.row?.numero }}</div>
                      <div class="text-subtitle2">Valor: {{ formatarParaReal(props.row.valor) }}</div>
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
        <CartelaDialog
            v-model="showDialog"
            :cartela="cartelaStore.cartela"
        />
        <CartelaUploadDialog
          v-model="showDialogUpload"
        />
    </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, onMounted } from 'vue';
import { formatarParaReal } from 'src/utils/format';
import { useCartelaStore } from 'src/stores/cartela.store';
import { CartelaResponse } from 'src/model/cartela.interface';
import { StatusCartela } from 'src/model/status-cartela.enum';
import CartelaDialog from 'src/pages/cartela/CartelaDialog.vue';
import CartelaUploadDialog from 'src/pages/cartela/CartelaUploadDialog.vue';
import ButtonToggleView from 'src/components/button/ButtonToggleView.vue';
import { Tipo } from 'src/model/tipo.enum';
import { GestaoFilter } from 'src/model/gestao-rifa.interface';

const $q = useQuasar();
const cartelaStore = useCartelaStore();

const isGridView = ref(false);
const showDialog = ref(false);
const showDialogUpload = ref(false);
const filter = ref<CartelaDialog>({});
const filterShow = ref(false);
const tipo = Object.keys(Tipo).map((key) => ({ label: Tipo[key as keyof typeof Tipo], value: key as string }));
const status = Object.keys(StatusCartela).map((key) => ({ label: StatusCartela[key as keyof typeof StatusCartela], value: key as string }));

interface Column {
  name: string;
  required?: boolean;
  label: string;
  align?: 'left' | 'right' | 'center';
  field: string | ((row: CartelaResponse) => any);
  sortable?: boolean;
}

const columns: Column[] = [
    { name: 'codigo', required: true, label: 'Código', align: 'left', field: 'codigo', sortable: true },
    { name: 'numero', required: true, label: 'Número', align: 'center', field: 'numero', sortable: true },
    { name: 'evento', label: 'Evento', align: 'center', field: (row: CartelaResponse) => row.evento?.descricao, sortable: true },
    { name: 'status', label: 'Status', align: 'center', field: (row: CartelaResponse) => StatusCartela[row.status], sortable: true },
    { name: 'valor', required: true, label: 'Valor', align: 'right', field: (row: CartelaResponse) => formatarParaReal(row.valor), sortable: true },
    { name: 'actions', label: 'Ações', align: 'center', field: 'actions', sortable: false }
];

onMounted(async () => {
  await cartelaStore.getCartelaPaginado();
});

async function onRequest(props: any) {

  if(props?.pagination){
    cartelaStore.pagination = props.pagination
  }
  if(Object.keys(filter.value).length > 0){
    cartelaStore.filter = filter.value as GestaoFilter;
  }
  await cartelaStore.getCartelaPaginado();
}

function openDialog(cartela?: CartelaResponse) {
  cartelaStore.cartela = cartela ? { ...cartela } : null;
  showDialog.value = true;
}
function openDialogUpload() {
  showDialogUpload.value = true;
}

function editar(cartela: CartelaResponse) {
  openDialog(cartela);
}

function confirmarExclusao(cartela: CartelaResponse) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Deseja realmente excluir a rifa ${cartela.codigo}?`,
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
      await cartelaStore.excluirCartela(Number(cartela.codigo));
      await cartelaStore.getCartelaPaginado();
    } catch (error) {
      // Erro já tratado no store
    }
  });
}
function toggleFilter(){
  filterShow.value = !filterShow.value;
}
</script>
