<template>
  <q-select
        dense
        outlined
        v-model="model"
        use-input
        :option-label="(cartela) => `${cartela.numero} - ${cartela.evento.descricao} - ${cartela.evento.dataInicio} a ${cartela.evento.dataFinal}`"
        input-debounce="0"
        label="Cartela"
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
import { CartelaRequest, CartelaResponse } from 'src/model/cartela.interface';
import { EmpresaResponse } from 'src/model/empresa.interface';
import { EventoResponse } from 'src/model/evento.interface';
import { computed, useAttrs } from 'vue'

const attrs = useAttrs();

const props = defineProps<{
   modelValue: CartelaResponse | CartelaRequest | null ,
   items: any[],
   itemsFiltrados: any[],
   evento: EventoResponse | null,
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: CartelaResponse | CartelaRequest | null ): void;
  (e: 'update:items', value: CartelaResponse[] ): void;
  (e: 'update:itemsFiltrados', value: CartelaResponse[] ): void;
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
      options.value = props.items.filter((x) => (props.evento ? x.evento.codigo === props.evento.codigo : true) ) as CartelaResponse[];
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase();
    options.value = props.items.filter((x) => (props.evento ? x.evento.codigo === props.evento.codigo : true) ).filter((v: CartelaResponse) => v.evento.descricao.toLowerCase().includes(needle)) as CartelaResponse[];
  })
}

</script>
