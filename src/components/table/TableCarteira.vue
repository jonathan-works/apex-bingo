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
            hide-pagination
            v-bind="$attrs"
            v-model:pagination="pagination"
        >
            <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                    <q-btn
                        flat
                        round
                        size="sm"
                        color="primary"
                        icon="menu"
                        @click="visualizar(props.row)"
                    >
                        <q-tooltip>Ações</q-tooltip>
                        <q-menu>
                            <q-list style="min-width: 100px">
                                <q-item clickable v-close-popup>
                                    <q-item-section>Receber Cartela</q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup>
                                    <q-item-section>Devolver</q-item-section>
                                </q-item>
                                <q-separator />
                                <q-item clickable v-close-popup>
                                    <q-item-section>Informar Sorteada</q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup>
                                    <q-item-section>Informar Ganhadora</q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                </q-td>
            </template>
        </q-table>
        <div class="row justify-center q-mt-md">
            <q-pagination
                v-model="pagination.page"
                color="grey-8"
                :max="pagesNumber"
                size="sm"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, useAttrs } from "vue";
import { QTableColumn } from "quasar";
import { useGestaoCartelaStore } from "src/stores/gestao-cartela.store";
import { StatusCartela } from "src/model/status-cartela.enum";
import { GestaoCartelaItemResponse } from "src/model/gestao-cartela.interfave";
import { Tipo } from "src/model/tipo.enum";

const attrs = useAttrs();

const columns: QTableColumn[] = [
    { name: 'numeroBloco', required: true, label: 'N. Bloco', align: 'left', field: 'numeroBloco', sortable: true },
    { name: 'cartelaRifa', required: true, label: 'Num.', align: 'left', field: (row: GestaoCartelaItemResponse) => row.cartelaRifa?.numero, sortable: false },
    { name: 'cartelaRifa', required: true, label: 'Valor', align: 'left', field: (row: GestaoCartelaItemResponse) => row.cartelaRifa?.valor, sortable: false },
    { name: 'cartelaRifa', required: true, label: 'Dt. Início', align: 'left', field: (row: GestaoCartelaItemResponse) => row.cartelaRifa?.evento.dataInicio, sortable: false },
    { name: 'cartelaRifa', required: true, label: 'Dt. Fim', align: 'left', field: (row: GestaoCartelaItemResponse) => row.cartelaRifa?.evento.dataFinal, sortable: false },
    { name: 'status', label: 'Status', align: 'center', field: (row: GestaoCartelaItemResponse) => StatusCartela[row.tipo as keyof typeof StatusCartela], sortable: true },
    { name: 'tipo', required: true, label: 'Tipo', align: 'left', field: (row: GestaoCartelaItemResponse) => Tipo[row.tipo as keyof typeof Tipo], sortable: true },
    { name: 'actions', label: 'Ações', field: 'actions', sortable: false }
];

const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 10
})

const gestaoCartelaStore = useGestaoCartelaStore();
</script>