<template>
    <q-page padding>
        <div class="q-pa-md">
            <q-table
                title="Gestão de Rifas"
                :rows="gestaoRifaStore.gestaoRifasPaginados"
                :columns="columns"
                row-key="codigo"
                :loading="gestaoRifaStore.loading"
                :pagination="gestaoRifaStore.pagination"
                @request="onRequest"
                :grid="$q.screen.lt.md || isGridView"
            >
                <template v-slot:top-right>
                    <div class="row items-center">
                        <ButtonToggleView
                        v-if="!$q.screen.lt.md"
                        v-model:isGrid="isGridView"
                        />
                        <q-btn color="primary" label="Nova Rifa" @click="openDialog()" class="q-ml-sm" />
                    </div>
                </template>

                <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4" v-if="$q.screen.lt.md || isGridView">
                    <q-card>
                    <q-card-section>
                        <div class="text-h6">{{ props.row.codigo }}</div>
                        <div class="text-subtitle2">{{ props.row.descricao }}</div>
                        <div class="text-subtitle2">{{ props.row?.evento?.descricao }}</div>
                        <div class="text-subtitle2">{{ props.row?.empresa?.pessoa?.nome }}</div>
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
        <GestaoRifasDialog
            v-model="showDialog"
            :gestao-rifa="gestaoRifaStore.gestaoRifa"
        />
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import GestaoRifasDialog from 'src/pages/gestao-rifa/GestaoRifasDialog.vue';
import { useGestaoRifaStore } from 'src/stores/gestao-rifa.store';
import { GestaoRifaResponse } from 'src/model/cartela-rifa.interface';

const $q = useQuasar();
const gestaoRifaStore = useGestaoRifaStore();

const isGridView = ref(false);
const showDialog = ref(false);
const filter = ref(null);

interface Column {
  name: string;
  required?: boolean;
  label: string;
  align?: 'left' | 'right' | 'center';
  field: string | ((row: GestaoRifaResponse) => any);
  sortable?: boolean;
}

const columns: Column[] = [
    { name: 'codigo', required: true, label: 'Código', align: 'left', field: 'codigo', sortable: true },
    { name: 'descricao', required: true, label: 'Descrição', align: 'left', field: 'descricao', sortable: true },
    { name: 'evento', label: 'Evento', field: (row: GestaoRifaResponse) => row.evento?.descricao, sortable: true },
    { name: 'empresa', label: 'Empresa', field: (row: GestaoRifaResponse) => row.empresa?.pessoa?.nome, sortable: true },
    { name: 'actions', label: 'Ações', field: 'actions', sortable: false }
];

onMounted(async () => {
  await gestaoRifaStore.getGestaoCartelaPaginado();
});

async function onRequest(props: any) {
  const { page, rowsPerPage } = props.pagination;
  await gestaoRifaStore.getGestaoCartelaPaginado(page, rowsPerPage, filter.value);
}

function openDialog(gestaoRifa?: GestaoRifaResponse) {
  gestaoRifaStore.gestaoRifa = gestaoRifa ? { ...gestaoRifa } : null;
  showDialog.value = true;
}

function editar(gestaoRifa: GestaoRifaResponse) {
  openDialog(gestaoRifa);
}

function confirmarExclusao(gestaoRifa: GestaoRifaResponse) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Deseja realmente excluir a rifa ${gestaoRifa?.descricao}?`,
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
      await gestaoRifaStore.excluirGestaoCartela(Number(gestaoRifa.codigo));
      await gestaoRifaStore.getGestaoCartelaPaginado(
        gestaoRifaStore.pagination.page, 
        gestaoRifaStore.pagination.rowsPerPage, 
        filter.value
      );
    } catch (error) {
      // Erro já tratado no store
    }
  });
}
</script>
