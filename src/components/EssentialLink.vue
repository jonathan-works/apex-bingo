<template>
  <q-item
    clickable
    tag="div"
    :to="to"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface EssentialLinkProps {
  title: string;
  link?: string;
  icon?: string;
  to?: string;
};

withDefaults(defineProps<EssentialLinkProps>(), {
  link: '',
  icon: '',
  to: ''
});
</script>
