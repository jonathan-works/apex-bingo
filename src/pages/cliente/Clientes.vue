<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        title="Clientes"
        :rows="clienteStore.clientes"
        :columns="columns"
        row-key="codigo"
        :loading="clienteStore.loading"
        :pagination="pagination"
        @request="onRequest"
        :grid="$q.screen.lt.md || isGridView"
      >
        <template v-slot:top-right>
          <div class="row items-center">
            <ButtonToggleView
              v-if="!$q.screen.lt.md"
              v-model:isGrid="isGridView"
            />
            <q-btn color="primary" label="Novo Cliente" @click="novoCliente()" class="q-ml-sm" />
          </div>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
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
                  @click="editarCliente(props.row)"
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
              @click="editarCliente(props.row)"
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

    <ClienteDialog
      v-model="showDialog"
      :cliente="clienteSelecionado"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar, Dialog } from 'quasar';
import { clienteService } from 'src/service/cliente.service';
import { Cliente, ClienteResponse } from 'src/model/cliente.interface';
import ClienteDialog from './ClienteDialog.vue';
import { useClienteStore } from '../../stores/cliente.store';
import ButtonToggleView from 'src/components/button/ButtonToggleView.vue';
import { formatarTelefone, formatarDocumento } from 'src/utils/format';

const $q = useQuasar();
const clienteStore = useClienteStore();

const showDialog = ref(false);
const clienteSelecionado = ref<Cliente | undefined>();
const filter = ref('');
const isGridView = ref(false);

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const columns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left' as const },
  { name: 'nome', label: 'Nome', field: (row: ClienteResponse) => row.pessoa.nome, align: 'left' as const },
  { name: 'documento', label: 'Documento', field: (row: ClienteResponse) => formatarDocumento(row.pessoa.documento), align: 'left' as const },
  { name: 'email', label: 'Email', field: (row: ClienteResponse) => row.pessoa.email, align: 'left' as const },
  { name: 'telefone', label: 'Telefone', field: (row: ClienteResponse) => formatarTelefone(row.pessoa.telefone), align: 'left' as const },
  { name: 'tipoPessoa', label: 'Tipo', field: (row: ClienteResponse) => row.pessoa.tipoPessoa, align: 'left' as const },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' as const }
];

async function carregarClientes(page: number, rowsPerPage: number, filter = '') {
  clienteStore.loading = true;
  try {
    const { data } = await clienteService.listarClientes(page - 1, rowsPerPage, filter);
    clienteStore.clientes = data.content;
    pagination.value.rowsNumber = data.totalElements;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar clientes'
    });
  } finally {
    clienteStore.loading = false;
  }
}

async function onRequest(props: any) {
  const { page, rowsPerPage } = props.pagination;
  await carregarClientes(page, rowsPerPage, filter.value);
}

function novoCliente() {
  clienteSelecionado.value = undefined;
  showDialog.value = true;
}

function editarCliente(cliente: Cliente) {
  clienteSelecionado.value = { ...cliente };
  showDialog.value = true;
}

function confirmarExclusao(cliente: ClienteResponse) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Deseja realmente excluir o cliente ${cliente.pessoa.nome}?`,
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
      await clienteService.excluirCliente(cliente.codigo);
      await carregarClientes(pagination.value.page, pagination.value.rowsPerPage, filter.value);
      $q.notify({
        type: 'positive',
        message: 'Cliente excluído com sucesso'
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao excluir cliente'
      });
    }
  });
}

onMounted(async () => {
  await carregarClientes(pagination.value.page, pagination.value.rowsPerPage);
});

// Registrar o Dialog plugin
Dialog.create = Dialog.create || useQuasar().dialog;
</script>
