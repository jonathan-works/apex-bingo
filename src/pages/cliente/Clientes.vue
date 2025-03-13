<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
          title="Clientes"
          :rows="clienteStore.clientesPaginados"
          :columns="columns"
          row-key="codigo"
          :loading="clienteStore.loading"
          v-model:pagination="clienteStore.pagination"
          @request="onRequest"
          :grid="$q.screen.lt.md || isGridView"
      >
          <template v-slot:top-right>
            <div class="row items-center">
                <ButtonToggleView
                v-if="!$q.screen.lt.md"
                v-model:isGrid="isGridView"
                />
                <q-btn color="primary" label="Novo cliente" @click="openDialog()" class="q-ml-sm" />
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
    <ClienteDialog
        v-model="showDialog"
        :cliente="clienteStore.cliente as ClienteResponse"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useClienteStore } from 'src/stores/cliente.store';
import ButtonToggleView from 'src/components/button/ButtonToggleView.vue';
import { ClienteResponse } from 'src/model/cliente.interface';
import ClienteDialog from './ClienteDialog.vue';
import { formatarDocumento, formatarTelefone } from 'src/utils/format';

const $q = useQuasar();
const clienteStore = useClienteStore();
clienteStore.getClientesPaginado();

const isGridView = ref(false);
const showDialog = ref(false);
const filter = ref(null);

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
      field: (row : ClienteResponse) => row.pessoa.nome,
      label: 'Nome',
      align: 'left',
      sortable: true
    },
    {
      name: 'documento',
      field: (row : ClienteResponse) => formatarDocumento(row.pessoa.documento),
      label: 'Documento',
      align: 'left'
    },
    {
      name: 'email',
      field: (row : ClienteResponse) => row.pessoa.email,
      label: 'Email',
      align: 'left'
    },
    {
      name: 'telefone',
      field: (row : ClienteResponse) => formatarTelefone(row.pessoa.telefone),
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
  clienteStore.pagination = props.pagination
  await clienteStore.getClientesPaginado();
}

function openDialog(cliente?: ClienteResponse) {
  clienteStore.cliente = cliente ? { ...cliente } : null;
  showDialog.value = true;
}

function editar(cliente: ClienteResponse) {
  openDialog(cliente);
}

function confirmarExclusao(cliente: ClienteResponse) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Deseja realmente excluir o cliente ${cliente?.pessoa?.nome}?`,
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
      await clienteStore.excluirCliente(cliente.codigo);
      await clienteStore.getClientesPaginado(clienteStore.pagination.page, clienteStore.pagination.rowsPerPage, filter.value);
    } catch (error) {
    }
  });
}
</script>
  