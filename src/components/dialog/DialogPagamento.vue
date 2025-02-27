<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog ref="dialog" v-model="model" backdrop-filter="blur(4px) saturate(150%)" no-esc-dismiss no-backdrop-dismiss no-route-dismiss>
      <q-card :style="{ maxWidth: isMobile ? '100vw' : '50vw', width: '100%' }">
        <q-form @submit="emit('registrarPagamento')">
          <q-card-section class="row items-center q-pb-none text-h6">
            Resumo da Comanda
          </q-card-section>
          <q-card-section>
            <div class="row justify-between q-gutter-x-md">
              <div class="text-left text-weight-bold">Total:</div>
              <div class="text-right text-weight-bold text-black">{{ formatToBRLCurrency(valorTotal || 0) }}</div>
            </div>
            <div class="row justify-between q-gutter-x-md">
              <div class="text-left text-weight-bold">Total Pago:</div>
              <div class="text-right text-weight-bold text-positive">{{ formatToBRLCurrency(valorTotalPago || 0) }}</div>
            </div>
            <div class="row justify-between q-gutter-x-md">
              <div class="text-left text-weight-bold">Total à Pagar:</div>
              <div class="text-right text-weight-bold text-negative">{{ formatToBRLCurrency(valorTotalAPagar || 0) }}</div>
            </div>
            <div class="row justify-between q-gutter-x-md">
              <div class="text-left text-weight-bold">Troco:</div>
              <div class="text-right text-weight-bold text-orange">{{ formatToBRLCurrency(valorTroco || 0) }}</div>
            </div>
          </q-card-section>
          <q-card-section v-if="pagamentos && pagamentos.length > 0">
            <div class="text-h6 q-mb-md">Pagamentos Realizados</div>
            <q-markup-table flat bordered>
              <thead>
                <tr>
                  <th class="text-left">Data/Hora</th>
                  <th class="text-left">Meio de Pagamento</th>
                  <th class="text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pagamento in pagamentos" :key="pagamento.codigo">
                  <td class="text-left">{{formatarData(pagamento.dataCriacao)}}</td>
                  <td class="text-left">{{formatarMeioPagamento(pagamento.meioPagamento)}}</td>
                  <td class="text-right text-weight-bold">{{formatToBRLCurrency(pagamento.valor)}}</td>
                </tr>
                <tr class="bg-grey-2">
                  <td colspan="2" class="text-right text-weight-bold">Total Pago:</td>
                  <td class="text-right text-weight-bold text-positive">{{formatToBRLCurrency(totalPago)}}</td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
          <q-card-section class="row items-center q-pb-none text-h6">
            Pagar
          </q-card-section>
          <q-card-section v-if="!dividaQuitada" class="row q-col-gutter-md">
            <div class="col">
              <SelectCondicaoPagamento v-model="condicaoPagamentoSelecionada"/>
            </div>
            <div class="col">
              <q-input
                v-model="valorPago"
                label="Valor pago *"
                type="number"
                prefix="R$"
                :rules="[
                  val => !!val || 'Valor é obrigatório',
                  val => val <= valorTotalAPagar || 'O Valor não pode ser maior do que o Total à Pagar.',
                  val => val > 0 || 'O Valor não pode ser negativo.'
                ]"
                outlined
                dense
              />
            </div>
          </q-card-section>
          <q-card-section>
            <div v-if="!dividaQuitada">
              <q-btn :disable="!valido" class="full-width" color="primary" label="Registrar pagamento" type="submit"/>
            </div>
            <div v-else>
              <q-btn class="full-width" color="primary" label="Finalizar Pedido" @click="emit('finalizarPedido')"/>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn outline label="Voltar" color="primary" v-close-popup />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { CondicaoPagamento } from 'src/model/condicao-pagamento.interface';
import SelectCondicaoPagamento from 'src/components/select/SelectCondicaoPagamento.vue';
import { MeioPagamento } from 'src/model/meio-pagamento.enum';
import { Pagamento } from 'src/model/pagamento.interface';

const $q = useQuasar();
const isMobile = computed(() => $q.platform.is.mobile);

const totalPago = computed(() => {
  if (!props.pagamentos) return 0;
  return props.pagamentos.reduce((total, pagamento) => total + pagamento.valor, 0);
});

function formatarData(data: string) {
  if (!data) return '-';
  return new Date(data).toLocaleString('pt-BR');
}

function formatToBRLCurrency(value: number) {
  if(!value) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarMeioPagamento(meio: MeioPagamento) {
  const meios = {
    [MeioPagamento.Dinheiro]: 'Dinheiro',
    [MeioPagamento['Cartão de Crédito']]: 'Cartão de Crédito',
    [MeioPagamento['Cartão de Débito']]: 'Cartão de Débito',
    [MeioPagamento['PIX']]: 'PIX',
  };
  return meios[meio] || meio;
}

const dialog = ref();

const props = defineProps<{
  valorTotal: number;
  valorTotalPago: number;
  valorTotalAPagar: number;
  valorTroco: number;
  modelValue: boolean;
  dividaQuitada: boolean;
  condicaoPagamentoSelecionada: CondicaoPagamento | null;
  meioPagamentoSelecionado: MeioPagamento | null;
  valorPago: number| null;
  pagamentos: Pagamento[] | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:condicaoPagamentoSelecionada', value: CondicaoPagamento | null): void;
  (e: 'update:meioPagamentoSelecionado', value: MeioPagamento | null): void;
  (e: 'update:valorPago', value: number | null): void;
  (e: 'registrarPagamento'): void;
  (e: 'finalizarPedido'): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const condicaoPagamentoSelecionada = computed({
  get: () => props.condicaoPagamentoSelecionada,
  set: (value: CondicaoPagamento | null) => emit('update:condicaoPagamentoSelecionada', value),
});

const meioPagamentoSelecionado = computed({
  get: () => props.meioPagamentoSelecionado,
  set: (value: MeioPagamento | null) => emit('update:meioPagamentoSelecionado', value),
});

const valorPago = computed({
  get: () => props.valorPago,
  set: (value: number | null) => emit('update:valorPago', value),
});

const valido = computed(() => {
  return props.condicaoPagamentoSelecionada && props.valorPago
})

function formatToBRL(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
</script>
