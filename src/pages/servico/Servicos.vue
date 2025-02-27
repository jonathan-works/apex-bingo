<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        title="Serviços"
        :rows="servicos"
        :columns="columns"
        row-key="codigo"
        :loading="loading"
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
            <q-btn color="primary" label="Novo Serviço" @click="openDialog()" class="q-ml-sm" />
          </div>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4" v-if="$q.screen.lt.md || isGridView">
            <q-card>
              <q-card-section>
                <div class="text-h6">{{ props.row.nome }}</div>
                <div class="text-subtitle2">{{ props.row.descricao }}</div>
                <div class="text-subtitle2">{{ formatCurrency(props.row.valor) }}</div>
                <div class="text-subtitle2">{{ props.row.duracao }} min</div>
              </q-card-section>
              <q-separator />
              <q-card-actions align="center">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="edit"
                  @click="editarServico(props.row)"
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

        <template v-slot:body-cell-valor="props">
          <q-td :props="props">
            {{ formatCurrency(props.value) }}
          </q-td>
        </template>

        <template v-slot:body-cell-duracao="props">
          <q-td :props="props">
            {{ props.value }} min
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-sm">
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="editarServico(props.row)"
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

    <ServicoDialog
      v-model="showDialog"
      :servico="selectedServico"
      @save="salvarServico"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar, Dialog } from 'quasar';
import ButtonToggleView from 'src/components/button/ButtonToggleView.vue';
import { servicoService } from 'src/service/servico.service';
import { Servico } from 'src/model/servico.interface';
import ServicoDialog from './ServicoDialog.vue';

const $q = useQuasar();
const loading = ref(false);
const servicos = ref<Servico[]>([]);
const isGridView = ref(false);
const filter = ref('');
const showDialog = ref(false);
const selectedServico = ref<Servico | undefined>();

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
});

const columns = [
  { name: 'codigo', label: 'Código', field: 'id', align: 'left' as const },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' as const },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' as const },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' as const },
  { name: 'duracao', label: 'Duração', field: 'duracao', align: 'right' as const },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' as const }
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

async function carregarServicos(page: number, rowsPerPage: number, filter = '') {
  loading.value = true;
  try {
    const { data } = await servicoService.listarServicos(page - 1, rowsPerPage, filter);
    servicos.value = data.content;
    pagination.value.rowsNumber = data.totalElements;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar serviços'
    });
  } finally {
    loading.value = false;
  }
}

async function onRequest(props: any) {
  const { page, rowsPerPage } = props.pagination;
  await carregarServicos(page, rowsPerPage, filter.value);
}

function openDialog(servico?: Servico) {
  selectedServico.value = servico ? { ...servico } : undefined;
  showDialog.value = true;
}

function editarServico(servico: Servico) {
  openDialog(servico);
}

function confirmarExclusao(servico: Servico) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Deseja realmente excluir o serviço ${servico.nome}?`,
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
      await servicoService.excluirServico(servico.codigo!);
      await carregarServicos(pagination.value.page, pagination.value.rowsPerPage, filter.value);
      $q.notify({
        type: 'positive',
        message: 'Serviço excluído com sucesso'
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao excluir serviço'
      });
    }
  });
}

async function salvarServico(servico: Servico) {
  try {
    if (servico.id) {
      servico.codigo = servico.id;
      await servicoService.atualizarServico(servico.id, servico);
      $q.notify({
        type: 'positive',
        message: 'Serviço atualizado com sucesso'
      });
    } else {
      await servicoService.criarServico(servico);
      $q.notify({
        type: 'positive',
        message: 'Serviço criado com sucesso'
      });
    }
    await carregarServicos(pagination.value.page, pagination.value.rowsPerPage, filter.value);
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: servico.id ? 'Erro ao atualizar serviço' : 'Erro ao criar serviço'
    });
  }
}

onMounted(() => {
  carregarServicos(pagination.value.page, pagination.value.rowsPerPage);
});

// Registrar o Dialog plugin
Dialog.create = Dialog.create || useQuasar().dialog;
</script>
