<template>
  <q-select
        dense
        filled
        v-model="model"
        use-input
        :option-label="(cliente: Cliente) => cliente.pessoa.nome"
        input-debounce="0"
        label="Cliente"
        :options="pedidoStore.clientesFiltrados as Cliente[]"
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
import { Cliente } from 'src/model/cliente.interface';
import { usePedidoComandaStore } from 'src/stores/pedido-comanda.store';
import { computed, ref, useAttrs } from 'vue'

const attrs = useAttrs();

const props = defineProps<{ modelValue: Cliente | null }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: Cliente | null ): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const pedidoStore = usePedidoComandaStore();
pedidoStore.carregarClientes();

async function filterFn (val: string, update: (callback: () => void) => void) {
  if (val === '') {
    update(() => {
      pedidoStore.clientesFiltrados = pedidoStore.clientes;
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase();
    pedidoStore.clientesFiltrados = pedidoStore.clientes?.filter(v => v.pessoa.nome.toLowerCase().includes(needle)) as Cliente[];
  })
}

</script>
