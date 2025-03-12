<template>
  <q-select
        dense
        outlined
        v-model="model"
        use-input
        :option-label="(empresa: EmpresaResponse) => empresa.pessoa?.nome"
        input-debounce="0"
        label="Cliente"
        :options="eventoStore.empresasFiltradas as EmpresaResponse[]"
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
import { useEventoStore } from 'src/stores/evento.store';
import { computed, useAttrs } from 'vue'

const attrs = useAttrs();

const props = defineProps<{ modelValue: EmpresaResponse | null }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: EmpresaResponse | null ): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const eventoStore = useEventoStore();
eventoStore.carregarEmpresas();

async function filterFn (val: string, update: (callback: () => void) => void) {
  if (val === '') {
    update(() => {
      eventoStore.empresasFiltradas = eventoStore.empresas;
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase();
    eventoStore.empresasFiltradas = eventoStore.empresas.filter(v => v.pessoa.nome.toLowerCase().includes(needle)) as EmpresaResponse[];
  })
}

</script>
