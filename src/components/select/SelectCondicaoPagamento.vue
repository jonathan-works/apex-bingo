<template>
  <q-select
        dense
        filled
        v-model="model"
        use-input
        :option-label="(cliente: CondicaoPagamento) => cliente.descricao"
        input-debounce="0"
        label="Condição de pagamento *"
        :options="pedidoStore.condicoesPagamento as CondicaoPagamento[]"
        @filter="filterFn"
        :rules="[val => !!val || 'Condição de pagamento é obrigatório']"
      >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          Nenhum cliente encontrado
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { CondicaoPagamento } from 'src/model/condicao-pagamento.interface';
import { usePedidoComandaStore } from 'src/stores/pedido-comanda.store';
import { computed, ref } from 'vue'

const props = defineProps<{ modelValue: CondicaoPagamento | null }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: CondicaoPagamento | null ): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const pedidoStore = usePedidoComandaStore();
pedidoStore.carregarCondicoesPagamento();

const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]
const options = ref(stringOptions);

function filterFn (val: string, update: (inputValue?: any, doneFn?:any, abortFn?:any) => void ) {
  if (val === '') {
    update(() => {
      options.value = stringOptions

      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    options.value = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
  })
}

</script>
