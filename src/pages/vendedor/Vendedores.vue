<template>
  <q-page padding>
      <div class="q-pa-md">
          <q-table
              :rows="vendedorStore.vendedorPaginados"
              :columns="columns"
              row-key="codigo"
              :loading="vendedorStore.loading"
              v-model:pagination="vendedorStore.pagination"
              @request="onRequest"
              :grid="$q.screen.lt.md || isGridView"
          >
            <template v-slot:top>
              <div class="row q-gutter-y-md full-width">
                <div class="col-12 row">
                  <div class="col-md-4 col-12">
                    <div class="col-2 q-table__title">Vendedores</div>
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
                      <q-btn color="primary" label="Nova Cartela" @click="openDialog()" />
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
                  </div>
                </div>
              </div>
            </template>

            <template v-slot:item="props">
              <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4" v-if="$q.screen.lt.md || isGridView">
                <q-card>
                  <q-card-section>
                      <div class="text-h6">{{ props.row.pessoa?.nome }}</div>
                      <div class="text-subtitle2">{{ formatarDocumento(props.row.pessoa?.documento) }}</div>
                      <div class="text-subtitle2">{{ props.row.pessoa?.email }}</div>
                      <div class="text-subtitle2">{{ formatarTelefone(props.row.pessoa?.telefone) }}</div>
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
      <VendedorDialog
          v-model="showDialog"
          :vendedor="vendedorStore.vendedor"
      />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useVendedorStore } from 'src/stores/vendedor.store';
import { VendedorFilter, VendedorResponse } from 'src/model/vendedor.interface';
import VendedorDialog from 'src/pages/vendedor/VendedorDialog.vue';
import { formatarDocumento, formatarTelefone } from 'src/utils/format';
import ButtonToggleView from 'src/components/button/ButtonToggleView.vue';

const $q = useQuasar();
const vendedorStore = useVendedorStore();
vendedorStore.getVendedoresPaginado();

const isGridView = ref(false);
const showDialog = ref(false);
const filter = ref<VendedorFilter>({});
const filterShow = ref(false);

const columns = [
  {
    name: 'codigo',
    field: 'codigo',
    label: 'Código',
    align: 'left',
    sortable: true
  },
  {
    name: 'nome',
    field: (row : VendedorResponse) => row.pessoa.nome,
    label: 'Nome',
    align: 'left',
    sortable: true
  },
  {
    name: 'documento',
    field: (row : VendedorResponse) => formatarDocumento(row.pessoa.documento),
    label: 'Documento',
    align: 'left'
  },
  {
    name: 'email',
    field: (row : VendedorResponse) => row.pessoa.email,
    label: 'Email',
    align: 'left'
  },
  {
    name: 'telefone',
    field: (row : VendedorResponse) => formatarTelefone(row.pessoa.telefone),
    label: 'Telefone',
    align: 'left'
  },
  {
    name: 'actions',
    label: 'Ações',
    field: 'actions',
    align: 'center'
  }
]

async function onRequest(props: any) {
  if(props?.pagination){
    vendedorStore.pagination = props.pagination
  }
  if(Object.keys(filter.value).length > 0){
    vendedorStore.filter = filter.value as VendedorFilter;
  }
  await vendedorStore.getVendedoresPaginado();
}

function openDialog(vendedor?: VendedorResponse) {
  vendedorStore.vendedor = vendedor ? { ...vendedor } : null;
  showDialog.value = true;
}

function editar(vendedor: VendedorResponse) {
  openDialog(vendedor);
}

function confirmarExclusao(vendedor: VendedorResponse) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Deseja realmente excluir o vendedor ${vendedor?.pessoa?.nome}?`,
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
      await vendedorStore.excluirVendedor(vendedor.codigo);
      await vendedorStore.getVendedoresPaginado(vendedorStore.pagination.page, vendedorStore.pagination.rowsPerPage);
    } catch (error) {
    }
  });
}
function toggleFilter(){
  filterShow.value = !filterShow.value;
}
</script>
  