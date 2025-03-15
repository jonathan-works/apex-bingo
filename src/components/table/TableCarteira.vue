<template>
    <div>
        <q-table
            flat 
            bordered
            title="Cartelas"
            :separator="vertical"
            :columns="columns"
            row-key="codigo"
            dense
            v-bind="$attrs"
        >
            <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                    <q-btn
                        flat
                        round
                        size="sm"
                        color="primary"
                        icon="menu"
                    >
                        <q-tooltip>Ações</q-tooltip>
                        <q-menu>
                            <q-list style="min-width: 100px">
                                <q-item clickable v-close-popup @click="receberCartela(props.row.cartelaRifa.codigo)">
                                    <q-item-section>Receber</q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup @click="devolver(props.row.cartelaRifa.codigo)">
                                    <q-item-section>Devolver</q-item-section>
                                </q-item>
                                <q-separator />
                                <q-item clickable v-close-popup @click="informarSorteada(props.row.cartelaRifa.codigo)">
                                    <q-item-section>Informar Sorteada</q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup @click="informarGanhadora(props.row.cartelaRifa.codigo)">
                                    <q-item-section>Informar Ganhadora</q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                </q-td>
            </template>
        </q-table>
       <ReceberCartelaDialog v-model="showDialogReceberCartela" :codigo="cartelaRifaCodigo" />
       <InformarSorteadaDialog v-model="showDialogInformarSorteada" :codigo="cartelaRifaCodigo" />
       <InformarGanhadoraDialog v-model="showDialogInformarGanhadora" :codigo="cartelaRifaCodigo" />
       <DevolverCartelaDialog v-model="showDialogDevolverCartela" :codigo="cartelaRifaCodigo" />
    </div>
</template>
<script setup lang="ts">
import { ref, useAttrs } from "vue";
import { QTableColumn } from "quasar";
import { Tipo } from "src/model/tipo.enum";
import { StatusCartela } from "src/model/status-cartela.enum";
import { MeioPagamento } from "src/model/meio-pagamento.enum";
import { ReceberCartelaRequest } from "src/model/cartela.interface";
import { useGestaoCartelaStore } from "src/stores/gestao-cartela.store";
import { GestaoCartelaItemResponse } from "src/model/gestao-cartela.interfave";

import ReceberCartelaDialog from "src/components/dialog/ReceberCartelaDialog.vue";
import InformarSorteadaDialog from "src/components/dialog/InformarSorteadaDialog.vue";
import InformarGanhadoraDialog from "src/components/dialog/InformarGanhadoraDialog.vue";
import DevolverCartelaDialog from "src/components/dialog/DevolverCartelaDialog.vue";

const cartelaRifaCodigo = ref(0);
const attrs = useAttrs();
const gestaoCartelaStore = useGestaoCartelaStore();

const showDialogReceberCartela = ref(false);
const showDialogInformarSorteada = ref(false);
const showDialogInformarGanhadora = ref(false);
const showDialogDevolverCartela = ref(false);

const columns: QTableColumn[] = [
    { name: 'numeroBloco', required: true, label: 'N. Bloco', align: 'left', field: 'numeroBloco', sortable: false },
    { name: 'cartelaRifa', required: true, label: 'Num.', align: 'left', field: (row: GestaoCartelaItemResponse) => row.cartelaRifa?.numero, sortable: false },
    { name: 'cartelaRifa', required: true, label: 'Valor', align: 'left', field: (row: GestaoCartelaItemResponse) => row.cartelaRifa?.valor, sortable: false },
    { name: 'cartelaRifa', required: true, label: 'Dt. Início', align: 'left', field: (row: GestaoCartelaItemResponse) => row.cartelaRifa?.evento.dataInicio, sortable: false },
    { name: 'cartelaRifa', required: true, label: 'Dt. Fim', align: 'left', field: (row: GestaoCartelaItemResponse) => row.cartelaRifa?.evento.dataFinal, sortable: false },
    { name: 'tipo', required: true, label: 'Tipo', align: 'left', field: (row: GestaoCartelaItemResponse) => Tipo[row.tipo as keyof typeof Tipo], sortable: false },
    { name: 'status', label: 'Status', align: 'center', field: (row: GestaoCartelaItemResponse) => StatusCartela[row.tipo as keyof typeof StatusCartela], sortable: false },
    { name: 'actions', label: 'Ações', field: 'actions', sortable: false }
];

const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 10
})

function receberCartela(codigo: number) {
    cartelaRifaCodigo.value = codigo;
    showDialogReceberCartela.value = true;
}

function informarSorteada(codigo: number) {
    cartelaRifaCodigo.value = codigo;
    showDialogInformarSorteada.value = true;
}

function informarGanhadora(codigo: number) {
    cartelaRifaCodigo.value = codigo;
    showDialogInformarGanhadora.value = true;
}

function devolver(codigo: number) {
    cartelaRifaCodigo.value = codigo;
    showDialogDevolverCartela.value = true;
}
</script>