<template>
  <q-select
        dense
        outlined
        v-model="model"
        use-input
        :option-label="(empresa) => empresa.pessoa?.nome"
        input-debounce="0"
        label="Empresa"
        :options="options"
        @filter="filterFn"
        v-bind="$attrs"
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
import { EmpresaResponse } from 'src/model/empresa.interface';
import { computed, useAttrs } from 'vue'

const attrs = useAttrs();

const props = defineProps<{
   modelValue: EmpresaResponse | null ,
   items: any[],
   itemsFiltrados: any[]
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: EmpresaResponse | null ): void;
  (e: 'update:items', value: EmpresaResponse[] ): void;
  (e: 'update:itemsFiltrados', value: EmpresaResponse[] ): void;
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
    options.value = props.items.filter((v: EmpresaResponse) => v.pessoa.nome.toLowerCase().includes(needle)) as EmpresaResponse[];
  })
}

</script>
