<template>
  <q-select
        dense
        outlined
        v-model="model"
        use-input
        :option-label="(vendedor: VendedorResponse) => vendedor.pessoa.nome"
        input-debounce="0"
        label="Vendedor"
        :options="options"
        @filter="filterFn"
        v-bind="$attrs"
      >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          Nenhum vendedor encontrado
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { VendedorRequest, VendedorResponse } from 'src/model/vendedor.interface';
import { computed, useAttrs } from 'vue'

const attrs = useAttrs();

const props = defineProps<{
   modelValue: VendedorResponse | VendedorRequest | null ,
   items: any[],
   itemsFiltrados: any[]
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: VendedorResponse | VendedorRequest | null ): void;
  (e: 'update:items', value: VendedorResponse[] ): void;
  (e: 'update:itemsFiltrados', value: VendedorResponse[] ): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const options = computed({
  get: () => props.itemsFiltrados,
  set: (value) => emit('update:itemsFiltrados', value),
});

async function filterFn (val: string, update: (callback: () => void) => void) {
  if (val === '') {
    update(() => {
      options.value = props.items;
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = props.items.filter((v: VendedorResponse) => v.pessoa.nome.toLowerCase().includes(needle)) as VendedorResponse[];
  })
}

</script>
