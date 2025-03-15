<template>
  <q-select
        dense
        outlined
        v-model="model"
        use-input
        :option-label="(item) => `${item.descricao} - ${item.dataInicio} - ${item.dataFinal} - ${item.empresa.pessoa.nome}`"
        input-debounce="0"
        label="Eventos"
        :options="options"
        @filter="filterFn"
        v-bind="$attrs"
      >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          Nenhum evento encontrado
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { EventoRequest, EventoResponse } from 'src/model/evento.interface';
import { computed, useAttrs } from 'vue'

const attrs = useAttrs();

const props = defineProps<{
   modelValue: EventoResponse | EventoRequest | null ,
   items: any[],
   itemsFiltrados: any[]
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: EventoResponse | EventoRequest | null ): void;
  (e: 'update:items', value: EventoResponse[] ): void;
  (e: 'update:itemsFiltrados', value: EventoResponse[] ): void;
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
    options.value = props.items.filter((v: EventoResponse) => v.descricao.toLowerCase().includes(needle)) as EventoResponse[];
  })
}

</script>
