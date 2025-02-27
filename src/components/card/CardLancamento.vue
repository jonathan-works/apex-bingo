<template>
  <q-card>
    <q-card-section :class="{'bg-positive': lancamento.tipo === 'CREDITO', 'bg-negative': lancamento.tipo === 'DEBITO'}">
      <div class="text-white text-h6">{{lancamento.pedido?.cliente?.pessoa?.nome}}</div>
      <div class="text-caption text-white absolute-top-right q-mt-xs q-mr-md">Laçamento {{ lancamento.pedido?.numeroPedido }}</div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-list dense>
        <q-item>
          <q-item-section side>
            <q-item-label class="text-weight-bold">Tipo</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ lancamento.tipo }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section side>
            <q-item-label class="text-weight-bold">Meio de Pagamento</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ lancamento.meioPagamento }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section side>
            <q-item-label class="text-weight-bold">Status</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <q-chip v-if="lancamento.pedido?.status === 'CONCLUIDO'"
              color="positive" text-color="white" icon="done" size="sm">
                CONCLUÍDO
              </q-chip>
              <q-chip v-if="lancamento.pedido?.status === 'ABERTO'"
              text-color="negative" icon="schedule" size="sm">
                PEDIDO ABERTO
              </q-chip>
              <q-chip v-if="lancamento.pedido?.status === 'FECHADO'"
              color="warning" text-color="primary" icon="currency_exchange" size="sm">
                PEDIDO FECHADO
              </q-chip>
              <q-chip v-if="lancamento.pedido?.status === 'CANCELADO'"
              color="cancelado" text-color="primary" icon="close" size="sm">
                PEDIDO CANCELADO
              </q-chip>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>
            <q-item-label class="text-weight-bold">Pagamento</q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section side>
            <q-item-label class="text-weight-bold">Data/Horário</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ formatDateTime(lancamento.dataHora) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-card-section class="row items-center justify-between q-pt-none">
      <div :class="{'text-positive': lancamento.tipo === 'CREDITO', 'text-negative': lancamento.tipo === 'DEBITO'}" class="text-h5">
        {{ lancamento.tipo === 'CREDITO' ? '+' : '-' }} {{ formatToBRL(lancamento.valor) }}
      </div>
      <q-btn round dense color="primary" icon="attach_money" :to="{name: 'pedido', query: {p: lancamento.pedido.codigo}}">
        <q-tooltip>
          Pedido
        </q-tooltip>
      </q-btn>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { Lancamento } from 'src/model/lancamento.interface';

defineProps<{
  lancamento: Lancamento;
}>();

function formatToBRL(value: number) {
  if (!value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(0);
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function formatDateTime(dateTime: string) {
  return new Date(dateTime).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>
