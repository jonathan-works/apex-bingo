<template>
  <div>
    <div :style="{ fontSize: `${size || 1.9}em` }" class="font-bold">
      <span class="text-secondary font-bold">APEX</span>Barber
    </div>
    <div class="text-overline m--15">
      Portal de Gestão de Barbearia
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{ size?: number }>();
</script>

<style scoped>
.text-secondary {
  color: #888;
}
.font-bold {
  font-weight: bold;
}
.m--15{
  margin-top: -15px;
}
</style>
