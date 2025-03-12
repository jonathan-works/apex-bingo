<template>
    <q-dialog
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
        @hide="onHide"
        persistent
        transition-show="slide-up"
        transition-hide="slide-down"
    >
      <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none q-px-lg">
          <div class="text-h6">{{ isEdit ? 'Editar' : 'Novo' }} Evento</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
  
        <q-card-section>
          <q-form @submit="onSubmit" class="q-pa-sm">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <SelectEmpresa v-model="form.empresa as EmpresaResponse" :rules="[val => !!val || 'Empresa é obrigatório']"></SelectEmpresa>
              </div>
              <div class="col-12">
                <q-input
                  v-model="form.descricao"
                  label="Descrição *"
                  :rules="[
                    val => !!val || 'Descrição é obrigatória',
                    val => val.length >= 3 || 'Mínimo de 3 caracteres'
                  ]"
                  outlined
                  dense
                />
              </div>
  
              <div class="col-12 col-md-6">
                <q-input
                  v-model="dtInicio"
                  label="Data Início *"
                  type="date"
                  :rules="[val => !!val || 'Data início é obrigatória']"
                  outlined
                  dense
                />
              </div>
  
              <div class="col-12 col-md-6">
                <q-input
                  v-model="dtFim"
                  label="Data Final *"
                  type="date"
                  :rules="[
                    val => !!val || 'Data final é obrigatória',
                    val => !form.dataInicio || val >= form.dataInicio || 'Data final deve ser maior ou igual à data inicial'
                  ]"
                  outlined
                  dense
                />
              </div>
            </div>
  
            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn
                label="Cancelar"
                color="negative"
                flat
                v-close-popup
              />
              <q-btn
                :label="isEdit ? 'Salvar' : 'Criar'"
                type="submit"
                color="primary"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>
  
<script setup lang="ts">
import { defineEmits, defineProps, computed, ref, watch } from 'vue';
import { useEventoStore } from '../../stores/evento.store';
import { EventoResponse } from 'src/model/response/evento.response';
import SelectEmpresa from 'src/components/select/SelectEmpresa.vue';
  
const eventoStore = useEventoStore();

const props = defineProps<{
    modelValue: boolean,
    evento?: EventoResponse
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>();

const isEdit = computed(() => !!props.evento?.codigo);

const form = ref<EventoResponse>({
    descricao: '',
    dataInicio: '',
    dataFinal: '',
    empresa: null
});

const dtInicio = computed({
    get: () => form.value?.dataInicio?.split('/').reverse().join('-'),
    set: (value) => (form.value.dataInicio = value.split('-').reverse().join('/'))
})
const dtFim = computed({
    get: () => form.value?.dataFinal?.split('/').reverse().join('-'),
    set: (value) => (form.value.dataFinal = value.split('-').reverse().join('/'))
})
  
watch(() => props.evento, (newEvento) => {
    if (newEvento) {
        form.value = { ...newEvento } as EventoResponse;
    } else {
        form.value = {
            descricao: '',
            dataInicio: '',
            dataFinal: '',
            empresa: null
        };
    }
}, { immediate: true });

async function onSubmit() {
    try {
        if (isEdit.value) {
            await eventoStore.atualizarEvento(form.value);
        } else {
            await eventoStore.criarEvento(form.value);
        }
        emit('update:modelValue', false);
    } catch (error) {
    }
}

function onHide() {
    emit('update:modelValue', false);
}
</script>