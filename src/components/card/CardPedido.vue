<template>
  <q-card>
    <q-card-section class="bg-grey-3">
      <div class="text-orange-10 text-h6">{{pedido?.cliente?.pessoa?.nome}}</div>
      <div class="text-caption text-grey-8 absolute-top-right q-mt-xs q-mr-md">Comanda {{ comanda }}</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-list dense>
        <q-item>
          <q-item-section side>
            <q-item-label class="text-weight-bold">Profissional</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>- x -</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section side>
            <q-item-label class="text-weight-bold">Categoria</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>- x -</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section side>
            <q-item-label class="text-weight-bold">Data/Horário</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>- x -</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-card-section class="row items-center justify-between q-pt-none">
      <div class="text-orange-10 text-h5">{{formatToBRL(pedido.total)}}</div>
      <div class="row">
        <template v-if="pedido.status === 'ABERTO'">
          <q-btn flat round dense icon="delete" color="black" @click="confirmarCancelamento(pedido)">
            <q-tooltip>
              Cancelar
            </q-tooltip>
          </q-btn>
          <q-btn round dense color="secondary" icon="edit" :to="{name: 'pedido', query: {p: pedido.codigo}}">
            <q-tooltip>
              Editar
            </q-tooltip>
          </q-btn>
        </template>
        <template v-if="pedido.status === 'CONCLUIDO'">
          <q-btn flat round dense icon="visibility" color="black" @click="showDetalhesDialog = true">
            <q-tooltip>
              Ver detalhes
            </q-tooltip>
          </q-btn>
        </template>
        <!-- <q-btn flat round dense icon="delete" color="black" />
        <q-btn flat round dense icon="list" color="black" />
        <q-btn round dense color="orange" icon="check" /> -->
      </div>
    </q-card-section>
  </q-card>

  <DialogPedidoDetalhes v-model="showDetalhesDialog" :pedido="pedido" />
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';
import { Pedido } from 'src/model/pedido.interface';
import { usePedidoStore } from 'src/stores/pedido.store';
import { ref } from 'vue';
import DialogPedidoDetalhes from 'src/components/dialog/DialogPedidoDetalhes.vue';

defineProps<{ pedido: Pedido, comanda: number }>();

const emit = defineEmits<{
  (e: 'update:modelValue'): void;
}>();

const $q = useQuasar();
const pedidoStore = usePedidoStore();
const showDetalhesDialog = ref(false);


function formatToBRL(value: number) {
    if(!value){
      return 0
    }

    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

async function confirmarCancelamento(pedido: Pedido) {
  $q.dialog({
    title: 'Confirmar cancelamento',
    message: `Deseja realmente cancelar o pedido ${pedido.numeroPedido} do cliente ${pedido.cliente.pessoa.nome}?`,
    cancel: {
      label: 'Voltar',
      flat: true,
      color: 'primary'
    },
    ok: {
      label: 'Canvelar Pedido',
      color: 'negative'
    },
    persistent: true
  }).onOk(async () => {
    try {
      await pedidoStore.cancelarPedido(pedido.codigo as string);
      $q.notify({
        type: 'positive',
        message: 'Pedido cancelado com sucesso!'
      });
      emit("update:modelValue")
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      $q.notify({
        type: 'negative',
        message: 'Erro ao cancelar pedido'
      });
    }
  });
}
</script>
