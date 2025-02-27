<!-- ButtonToggleView.vue -->
<template>
  <q-btn
    :icon="isGridView ? 'view_list' : 'grid_view'"
    flat
    round
    dense
    @click="toggleView"
    class="q-ml-sm"
  >
    <q-tooltip>
      {{ isGridView ? 'Visualizar em lista' : 'Visualizar em cards' }}
    </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isGridView = ref(false);

const emit = defineEmits<{
  (e: 'update:isGrid', value: boolean): void
}>();

function toggleView() {
  isGridView.value = !isGridView.value;
  emit('update:isGrid', isGridView.value);
}
</script>
