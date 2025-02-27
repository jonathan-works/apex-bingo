<template>
  <q-select
    dense
    filled
    v-model="model"
    use-input
    :option-label="(meioPagamento: keyof typeof MeioPagamento) => Object.keys(MeioPagamento).find(key => MeioPagamento[key as keyof typeof MeioPagamento] === meioPagamento)"
    input-debounce="0"
    label="Meio de pagamento *"
    :options="options"
    @filter="filterFn"
    :rules="[val => !!val || 'Meio de pagamento é obrigatório']"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          Nenhuma opção encontrada
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { MeioPagamento } from 'src/model/meio-pagamento.enum';
import { computed, ref } from 'vue';

const props = defineProps<{ modelValue: MeioPagamento | null }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: MeioPagamento | null): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const meioPagamentoOptions = Object.values(MeioPagamento);
const options = ref(meioPagamentoOptions);

function filterFn(val: string, update: (inputValue?: any, doneFn?: any, abortFn?: any) => void) {
  if (val === '') {
    update(() => {
      options.value = meioPagamentoOptions;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = meioPagamentoOptions.filter(v => v.toLowerCase().includes(needle));
  });
}
</script>
