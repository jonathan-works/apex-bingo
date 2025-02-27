<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        title="Colaboradores"
        :rows="colaboradorStore.colaboradores"
        :columns="columns"
        row-key="codigo"
        :loading="colaboradorStore.loading"
        :pagination="pagination"
        @request="onRequest"
        :grid="$q.screen.lt.md || isGridView"
      >
        <template v-slot:top-right>
          <!-- <q-input
            v-model="filter"
            placeholder="Buscar"
            dense
            debounce="300"
            class="q-mr-md"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input> -->

          <div class="row items-center">
            <ButtonToggleView
              v-if="!$q.screen.lt.md"
              v-model:isGrid="isGridView"
            />
            <q-btn color="primary" label="Novo Colaborador" @click="novoColaborador()" class="q-ml-sm" />
          </div>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4" v-if="$q.screen.lt.md || isGridView">
            <q-card>
              <q-card-section>
                <div class="text-h6">{{ props.row.pessoa.nome }}</div>
                <div class="text-subtitle2">{{ props.row.pessoa.documento }}</div>
                <div class="text-subtitle2">{{ props.row.pessoa.email }}</div>
                <div class="text-subtitle2">{{ props.row.pessoa.telefone }}</div>
                <div class="text-subtitle2">{{ props.row.pessoa.tipoPessoa }}</div>
              </q-card-section>
              <q-separator />
              <q-card-actions align="center">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="edit"
                  @click="editarColaborador(props.row)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  @click="excluirColaborador(props.row)"
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
              @click="editarColaborador(props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="excluirColaborador(props.row)"
            >
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <ColaboradorDialog
      v-model="showDialog"
      :colaborador="colaboradorSelecionado"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar, Dialog } from 'quasar';
import { useColaboradorStore } from '../../stores/colaborador.store';
import { Colaborador, ColaboradorResponse } from 'src/model/colaborador.interface';
import ColaboradorDialog from './ColaboradorDialog.vue';
import ButtonToggleView from 'src/components/button/ButtonToggleView.vue';
import { formatarTelefone, formatarDocumento } from 'src/utils/format';

const $q = useQuasar();
const colaboradorStore = useColaboradorStore();
const showDialog = ref(false);
const colaboradorSelecionado = ref<Colaborador | undefined>();
const isGridView = ref(false);
const filter = ref('');

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const columns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left' as const },
  { name: 'nome', label: 'Nome', field: (row: ColaboradorResponse) => row.pessoa.nome, align: 'left' as const },
  { name: 'documento', label: 'Documento', field: (row: ColaboradorResponse) => formatarDocumento(row.pessoa.documento), align: 'left' as const },
  { name: 'email', label: 'Email', field: (row: ColaboradorResponse) => formatarTelefone(row.pessoa.email), align: 'left' as const },
  { name: 'telefone', label: 'Telefone', field: (row: ColaboradorResponse) => formatarTelefone(row.pessoa.telefone), align: 'left' as const },
  { name: 'tipoPessoa', label: 'Tipo', field: (row: ColaboradorResponse) => row.pessoa.tipoPessoa, align: 'left' as const },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' as const }
];

async function carregarColaboradores(page: number, rowsPerPage: number, filter = '') {
  colaboradorStore.loading = true;
  try {
    await colaboradorStore.buscarColaboradores();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar colaboradores'
    });
  } finally {
    colaboradorStore.loading = false;
  }
}

async function onRequest(props: any) {
  const { page, rowsPerPage } = props.pagination;
  await carregarColaboradores(page, rowsPerPage, filter.value);
}

function novoColaborador() {
  colaboradorSelecionado.value = undefined;
  showDialog.value = true;
}

function editarColaborador(colaborador: Colaborador) {
  colaboradorSelecionado.value = { ...colaborador };
  showDialog.value = true;
}

function excluirColaborador(colaborador: Colaborador) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Deseja realmente excluir o colaborador ${colaborador.pessoa.nome}?`,
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
      await colaboradorStore.excluirColaborador(colaborador.codigo!);
      await carregarColaboradores(pagination.value.page, pagination.value.rowsPerPage);
      $q.notify({
        type: 'positive',
        message: 'Colaborador excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir colaborador:', error);
      $q.notify({
        type: 'negative',
        message: 'Erro ao excluir colaborador'
      });
    }
  });
}

onMounted(async () => {
  await carregarColaboradores(pagination.value.page, pagination.value.rowsPerPage);
});

// Registrar o Dialog plugin
Dialog.create = Dialog.create || useQuasar().dialog;
</script>
