<template>
    <q-page padding>
        <div class="q-pa-md">
            <q-table
                :rows="eventoStore.eventosPaginados"
                :columns="columns"
                row-key="codigo"
                :loading="eventoStore.loading"
                v-model:pagination="eventoStore.pagination"
                @request="onRequest"
                :grid="$q.screen.lt.md || isGridView"
            >
              <template v-slot:top>
                <div class="row q-gutter-y-md full-width">
                  <div class="col-12 row">
                    <div class="col-md-4 col-12">
                      <div class="col-2 q-table__title">Eventos</div>
                    </div>
                    <div class="col-md col-12 row justify-end q-col-gutter-x-md">
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
                        <q-btn color="primary" label="Novo Evento" @click="openDialog()" />
                      </div>
                    </div>
                  </div>
                  <div class="col-12" v-if="filterShow">
                    <div class="row q-col-gutter-md">
                      <div class="col-md-2 col-12">
                        <q-input
                          v-model="filter.nome"
                          label="Nome"
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
                          v-model="filter.dataInicio"
                          label="Data Início"
                          outlined
                          dense
                          clearable
                          @update:model-value="onRequest"
                          @keyup.enter="onRequest"
                          @clear="onRequest"
                          type="date"
                        />
                      </div>
                      <div class="col-md-2 col-12">
                        <q-input
                          v-model="filter.dataFinal"
                          label="Data Final"
                          outlined
                          dense
                          clearable
                          @update:model-value="onRequest"
                          @keyup.enter="onRequest"
                          @clear="onRequest"
                          type="date"
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
                        <div class="text-h6">{{ props.row.descricao }}</div>
                        <div class="text-subtitle2">Data Início: {{ props.row.dataInicio }}</div>
                        <div class="text-subtitle2">Data Final: {{ props.row.dataFinal }}</div>
                        <div class="text-subtitle2">Empresa: {{ props.row?.empresa?.pessoa?.nome }}</div>
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
                </q-td>
              </template>
            </q-table>
        </div>
        <EventoDialog
            v-model="showDialog"
            :evento="eventoStore.evento as EventoResponse"
        />
    </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useEventoStore } from 'src/stores/evento.store';
import EventoDialog from 'src/components/dialog/EventoDialog.vue';
import { EventoResponse } from 'src/model/response/evento.response';
import ButtonToggleView from 'src/components/button/ButtonToggleView.vue';
import { EventoFilter } from 'src/model/evento.interface';

const $q = useQuasar();
const eventoStore = useEventoStore();
eventoStore.getEventosPaginado();

const isGridView = ref(false);
const showDialog = ref(false);
const filter = ref<EventoFilter>({});
const filterShow = ref(false);


const columns = [
    { name: 'codigo', required: true, label: 'Código', align: 'left', field: 'codigo', sortable: true },
    { name: 'descricao', required: true, label: 'Descrição', align: 'left', field: 'descricao', sortable: true },
    { name: 'dataInicio', label: 'Data Início', field: 'dataInicio', sortable: true },
    { name: 'dataFinal', label: 'Data Final', field: 'dataFinal', sortable: true },
    { name: 'actions', label: 'Acções', align: 'center', field: 'actions', sortable: false }
];

async function onRequest(props: any) {
  if(props?.pagination){
    eventoStore.pagination = props.pagination
  }
  if(Object.keys(filter.value).length > 0){
    let resust = {...filter.value} as EventoFilter;
    if(resust.dataInicio){
      resust.dataInicio = resust.dataInicio.split('-').reverse().join('/');
    }
    if(resust.dataFinal){
      resust.dataFinal = resust.dataFinal.split('-').reverse().join('/');
    }
    eventoStore.filter = resust;
  }
  await eventoStore.getEventosPaginado();
}

function openDialog(evento?: EventoResponse) {
  eventoStore.evento = evento ? { ...evento } : null;
  showDialog.value = true;
}

function editar(evento: EventoResponse) {
  openDialog(evento);
}

function confirmarExclusao(evento: EventoResponse) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Deseja realmente excluir o evento ${evento?.descricao}?`,
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
      await eventoStore.excluirEvento(evento.codigo);
      await eventoStore.getEventosPaginado(eventoStore.pagination.page, eventoStore.pagination.rowsPerPage);
    } catch (error) {
    }
  });
}
function toggleFilter(){
  filterShow.value = !filterShow.value;
}
</script>
    