<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        title="Condições de Pagamento"
        :rows="condicoesPagamento"
        :columns="columns"
        row-key="codigo"
        :loading="loading"
        :grid="$q.screen.lt.md || isGridView"
      >
        <template v-slot:top-right>
          <div class="row items-center">
            <ButtonToggleView
              v-if="!$q.screen.lt.md"
              v-model:isGrid="isGridView"
            />
            <q-btn color="primary" label="Nova Condição" @click="openDialog()" class="q-ml-sm" />
          </div>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4" v-if="$q.screen.lt.md || isGridView">
            <q-card>
              <q-card-section>
                <div class="text-h6">{{ props.row.descricao }}</div>
                <div class="text-subtitle2">Parcelas: {{ props.row.parcela }}</div>
                <div class="text-subtitle2">Intervalo: {{ props.row.intervalo }} dias</div>
                <div class="text-subtitle2">Juros: {{ props.row.juros }}%</div>
                <div class="text-subtitle2">Tipo: {{ props.row.tipo }}</div>
                <div class="text-subtitle2">Meio de Pagamento: {{ props.row.meioPagamento }}</div>
              </q-card-section>
              <q-separator />
              <q-card-actions align="center">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="edit"
                  @click="editarCondicao(props.row)"
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

        <template v-slot:body-cell-juros="props">
          <q-td :props="props">
            {{ props.value }}%
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-sm">
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="editarCondicao(props.row)"
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

    <CondicaoPagamentoDialog
      v-model="showDialog"
      :condicaoPagamento="selectedCondicao"
      @save="salvarCondicao"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar, Dialog } from 'quasar';
import { condicaoPagamentoService } from 'src/service/condicao-pagamento.service';
import { CondicaoPagamento } from 'src/model/condicao-pagamento.interface';
import CondicaoPagamentoDialog from './CondicaoPagamentoDialog.vue';

const $q = useQuasar();
const loading = ref(false);
const condicoesPagamento = ref<CondicaoPagamento[]>([]);
const isGridView = ref(false);
const showDialog = ref(false);
const selectedCondicao = ref<CondicaoPagamento | undefined>();

const columns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left' as const },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' as const },
  { name: 'parcela', label: 'Parcelas', field: 'parcela', align: 'right' as const },
  { name: 'intervalo', label: 'Intervalo', field: 'intervalo', align: 'right' as const },
  { name: 'juros', label: 'Juros', field: 'juros', align: 'right' as const },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' as const },
  { name: 'meioPagamento', label: 'Meio de Pagamento', field: 'meioPagamento', align: 'left' as const },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' as const }
];

async function carregarCondicoes() {
  loading.value = true;
  try {
    const { data } = await condicaoPagamentoService.listarCondicoesPagamento();
    condicoesPagamento.value = data;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar condições de pagamento'
    });
  } finally {
    loading.value = false;
  }
}

function openDialog(condicao?: CondicaoPagamento) {
  selectedCondicao.value = condicao ? { ...condicao } : undefined;
  showDialog.value = true;
}

function editarCondicao(condicao: CondicaoPagamento) {
  openDialog(condicao);
}

function confirmarExclusao(condicao: CondicaoPagamento) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Deseja realmente excluir a condição de pagamento ${condicao.descricao}?`,
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
      await condicaoPagamentoService.excluirCondicaoPagamento(condicao.codigo!);
      await carregarCondicoes();
      $q.notify({
        type: 'positive',
        message: 'Condição de pagamento excluída com sucesso'
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao excluir condição de pagamento'
      });
    }
  });
}

async function salvarCondicao(condicao: CondicaoPagamento) {
  try {
    if (condicao.codigo) {
      await condicaoPagamentoService.atualizarCondicaoPagamento(condicao.codigo, condicao);
      $q.notify({
        type: 'positive',
        message: 'Condição de pagamento atualizada com sucesso'
      });
    } else {
      await condicaoPagamentoService.criarCondicaoPagamento(condicao);
      $q.notify({
        type: 'positive',
        message: 'Condição de pagamento criada com sucesso'
      });
    }
    await carregarCondicoes();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: condicao.codigo ? 'Erro ao atualizar condição de pagamento' : 'Erro ao criar condição de pagamento'
    });
  }
}

onMounted(() => {
  carregarCondicoes();
});

// Registrar o Dialog plugin
Dialog.create = Dialog.create || useQuasar().dialog;
</script>
