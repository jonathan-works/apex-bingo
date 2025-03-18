<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
          :rows="empresaStore.empresasPaginados"
          :columns="columns"
          row-key="codigo"
          :loading="empresaStore.loading"
          v-model:pagination="empresaStore.pagination"
          @request="onRequest"
          :grid="$q.screen.lt.md || isGridView"
      >
        <template v-slot:top>
          <div class="row q-gutter-y-md full-width">
            <div class="col-12 row">
              <div class="col-md-4 col-12">
                <div class="col-2 q-table__title">Empresas</div>
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
    <EmpresaDialog
        v-model="showDialog"
        :empresa="empresaStore.empresa as EmpresaResponse"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import EmpresaDialog from 'src/components/dialog/EmpresaDialog.vue';
import { formatarDocumento, formatarTelefone } from 'src/utils/format';
import ButtonToggleView from 'src/components/button/ButtonToggleView.vue';
import { useEmpresaStore } from 'src/stores/empresa.store';
import { EmpresaFilter, EmpresaResponse } from 'src/model/empresa.interface';

const $q = useQuasar();
const empresaStore = useEmpresaStore();
empresaStore.getEmpresaPaginado();

const isGridView = ref(false);
const showDialog = ref(false);
const filter = ref<EmpresaFilter>({});
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
    field: (row : EmpresaResponse) => row.pessoa.nome,
    label: 'Nome',
    align: 'left',
    sortable: true
  },
  {
    name: 'documento',
    field: (row : EmpresaResponse) => formatarDocumento(row.pessoa.documento),
    label: 'Documento',
    align: 'left'
  },
  {
    name: 'email',
    field: (row : EmpresaResponse) => row.pessoa.email,
    label: 'Email',
    align: 'left'
  },
  {
    name: 'telefone',
    field: (row : EmpresaResponse) => formatarTelefone(row.pessoa.telefone),
    label: 'Telefone',
    align: 'left'
  },
  {
    name: 'actions',
    label: 'Ações',
    field: 'actions',
    align: 'center'
  }
];

async function onRequest(props: any) {
  if(props?.pagination){
    empresaStore.pagination = props.pagination
  }
  if(Object.keys(filter.value).length > 0){
    empresaStore.filter = filter.value as EmpresaFilter;
  }
  await empresaStore.getEmpresaPaginado();
}

function openDialog(empresa?: EmpresaResponse) {
  empresaStore.empresa = empresa ? { ...empresa } : null;
  showDialog.value = true;
}

function editar(empresa: EmpresaResponse) {
  openDialog(empresa);
}

function confirmarExclusao(cliente: EmpresaResponse) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Deseja realmente excluir a Empresa ${cliente?.pessoa?.nome}?`,
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
      await empresaStore.excluirEmpresa(cliente.codigo);
      await empresaStore.getEmpresaPaginado(empresaStore.pagination.page, empresaStore.pagination.rowsPerPage, filter.value);
    } catch (error) {
    }
  });
}
function toggleFilter(){
  filterShow.value = !filterShow.value;
}
</script>
  