<template>
  <q-dialog v-model="model">
    <q-card style="min-width: 350px">
      <q-card-section class="row items-center">
        <div class="text-h6">Detalhes do Pedido #{{pedido.numeroPedido}}</div>
        <q-space />
        <q-btn icon="print" flat round dense @click="imprimirDetalhes" />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label caption>Cliente</q-item-label>
              <q-item-label>{{pedido.cliente?.pessoa?.nome}}</q-item-label>
            </q-item-section>
          </q-item>

          <!-- <q-item>
            <q-item-section>
              <q-item-label caption>Data/Hora</q-item-label>
              <q-item-label>{{formatarData(pedido.dataHora)}}</q-item-label>
            </q-item-section>
          </q-item> -->

          <q-item>
            <q-item-section>
              <q-item-label caption>Itens</q-item-label>
              <q-list dense>
                <q-item v-for="item in pedido.itens" :key="item.codigo as number">
                  <q-item-section>
                    <q-item-label>{{item.quantidade}}x {{item.produto?.nome || item.servico?.nome}}</q-item-label>
                    <q-item-label caption>{{formatToBRL(item.produto?.valorVenda || item.servico?.valor || 0)}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>Condição de Pagamento</q-item-label>
              <q-list dense>
                <q-item v-for="item in pedido.pagamentos" :key="item.codigo as number">
                  <q-item-section>
                    <q-item-label>{{item.condicaoPagamento.descricao}} - {{item.meioPagamento}}</q-item-label>
                    <q-item-label caption>{{formatToBRL(item.valor)}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-item-section>
          </q-item>

          <!-- Total -->
          <q-item>
            <q-item-section>
              <q-item-label caption>Total</q-item-label>
              <q-item-label class="text-h6 text-orange-10">{{formatToBRL(pedido.total)}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Pedido } from 'src/model/pedido.interface';
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  pedido: Pedido;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});


function formatarData(data: string) {
  if (!data) return '-';
  return new Date(data).toLocaleString('pt-BR');
}

function formatToBRL(value: number) {
  if(!value) {
    return 0;
  }
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function imprimirDetalhes() {
  const conteudo = document.createElement('div');
  conteudo.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h2>Pedido #${props.pedido.numeroPedido}</h2>
      <hr>
      <p><strong>Cliente:</strong> ${props.pedido.cliente?.pessoa?.nome}</p>
      <hr>
      <h3>Itens</h3>
      ${props.pedido.itens.map(item => `
        <p>
          ${item.quantidade}x ${item.produto?.nome || item.servico?.nome}<br>
          <small>${formatToBRL(item.produto?.valorVenda || item.servico?.valor || 0)}</small>
        </p>
      `).join('')}
      <hr>
      <h3>Condição de pagamento</h3>
      ${props.pedido.pagamentos.map(item => `
        <p>
          ${item.condicaoPagamento.descricao} - ${item.meioPagamento}<br>
          <small>${formatToBRL(item.valor)}</small>
        </p>
      `).join('')}
      <hr>
      <h3>Total: ${formatToBRL(props.pedido.total)}</h3>
    </div>
  `;

  const janela = window.open('', '', 'height=600,width=800');
  janela?.document.write('<html><head><title>Detalhes do Pedido</title></head><body>');
  janela?.document.write(conteudo.innerHTML);
  janela?.document.write('</body></html>');
  janela?.document.close();
  janela?.print();
}
</script>
