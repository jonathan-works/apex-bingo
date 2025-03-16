<template>
    <q-page padding>
        <div class="q-pa-md">
            <q-table
                title="Cartelas"
                :rows="cartelaStore.cartelasPaginadas"
                :columns="columns"
                row-key="codigo"
                :loading="cartelaStore.loading"
                v-model:pagination="cartelaStore.pagination"
                @request="onRequest"
                :grid="$q.screen.lt.md || isGridView"
            >
                <template v-slot:top-right>
                    <div class="row items-center">
                      <q-btn
                        flat
                        round
                        icon="cloud_upload"
                        @click="openDialogUpload"
                      >
                        <q-tooltip>Importar cartelas</q-tooltip>
                      </q-btn>
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

const $q = useQuasar();
const cartelaStore = useCartelaStore();

const isGridView = ref(false);
const showDialog = ref(false);
const showDialogUpload = ref(false);

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
  cartelaStore.pagination = props.pagination
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
</script>
